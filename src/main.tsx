import { Devvit, useState, useAsync } from '@devvit/public-api';
import { getTodayDocket, Docket, Evidence } from './data/dockets.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: 'KarmaCourt Post',
  height: 'tall',
  render: (context) => {
    const { redis, ui, userId } = context;
    const docket: Docket = getTodayDocket();
    const caseKey = `karmacourt:case:${docket.id}`;
    const userVoteKey = `karmacourt:user:${userId ?? 'anon'}:${docket.id}:vote`;
    const userStreakKey = `karmacourt:user:${userId ?? 'anon'}:streak`;

    // Interactive Game State
    const [inspectedEvidence, setInspectedEvidence] = useState<{ [id: number]: boolean }>({});
    const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
    const [userVote, setUserVote] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState<boolean>(false);
    const [streak, setStreak] = useState<number>(1);
    const [liveVotes, setLiveVotes] = useState({
      YTA: docket.stats.YTA,
      NTA: docket.stats.NTA,
      ESH: docket.stats.ESH,
      NAH: docket.stats.NAH,
    });

    // Time until next court docket resets (00:00 UTC)
    const getHoursUntilReset = (): string => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setUTCHours(24, 0, 0, 0);
      const diffMs = nextReset.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    // Hydrate existing user session & live votes from Redis
    useAsync(async () => {
      try {
        const [savedVote, savedStreak, voteData] = await Promise.all([
          redis.get(userVoteKey),
          redis.get(userStreakKey),
          redis.hGetAll(`${caseKey}:tallies`),
        ]);

        if (savedVote) {
          setUserVote(savedVote);
          setHasVoted(true);
        }

        if (savedStreak) {
          setStreak(parseInt(savedStreak, 10));
        }

        if (voteData && Object.keys(voteData).length > 0) {
          const yta = parseInt(voteData.YTA || '0', 10) + docket.stats.YTA;
          const nta = parseInt(voteData.NTA || '0', 10) + docket.stats.NTA;
          const esh = parseInt(voteData.ESH || '0', 10) + docket.stats.ESH;
          const nah = parseInt(voteData.NAH || '0', 10) + docket.stats.NAH;
          const total = yta + nta + esh + nah || 1;

          setLiveVotes({
            YTA: Math.round((yta / total) * 100),
            NTA: Math.round((nta / total) * 100),
            ESH: Math.round((esh / total) * 100),
            NAH: Math.round((nah / total) * 100),
          });
        }
      } catch {
        // Safe offline execution
      }
      return true;
    });

    // Toggle evidence inspection
    const handleInspectEvidence = (item: Evidence) => {
      setInspectedEvidence((prev) => ({ ...prev, [item.id]: true }));
      setSelectedEvidence(item);
      ui.showToast({
        text: `🔍 Uncovered: ${item.label}`,
        appearance: 'neutral',
      });
    };

    // Cast final verdict
    const handleVote = async (choice: 'YTA' | 'NTA' | 'ESH' | 'NAH') => {
      if (hasVoted) return;

      setUserVote(choice);
      setHasVoted(true);

      const isAccord = choice === docket.verdict;
      const nextStreak = isAccord ? streak + 1 : 1;
      setStreak(nextStreak);

      try {
        await Promise.all([
          redis.set(userVoteKey, choice),
          redis.set(userStreakKey, nextStreak.toString()),
          redis.hIncrBy(`${caseKey}:tallies`, choice, 1),
        ]);
      } catch {
        // Safe fallback
      }

      if (isAccord) {
        ui.showToast({
          text: `⚖️ ACCORD REACHED! You matched the community verdict (${liveVotes[docket.verdict]}%)!`,
          appearance: 'success',
        });
      } else {
        ui.showToast({
          text: `🏛️ DISSENTING OPINION! The community voted ${docket.verdict} (${liveVotes[docket.verdict]}%).`,
        });
      }
    };

    // Generate Wordle-style evidence scorecard
    const handleShare = () => {
      const isAccord = userVote === docket.verdict;
      const statusIcon = isAccord ? '🟩 ACCORD' : '🟥 DISSENT';
      const evidenceCount = Object.keys(inspectedEvidence).length;
      const evidenceIcons = '🔍'.repeat(evidenceCount) + '🔒'.repeat(3 - evidenceCount);

      const shareText = `⚖️ KarmaCourt ${docket.caseNumber}\nEvidence: ${evidenceIcons} (Reviewed ${evidenceCount}/3)\nVerdict: ${userVote} | Community: ${docket.verdict}\n${statusIcon} • 🔥 ${streak} Day Streak!\n#KarmaCourt`;

      ui.showToast({
        text: '📋 Copied detective scorecard! Paste in comments below.',
        appearance: 'neutral',
      });
    };

    const inspectedCount = Object.keys(inspectedEvidence).length;

    return (
      <vstack height="100%" width="100%" backgroundColor="#0A0E17" padding="medium" gap="small">
        {/* Top Courtroom Banner */}
        <hstack width="100%" alignment="middle center" gap="small">
          <text size="large" weight="bold" color="#FF4500">
            ⚖️ KARMA COURT
          </text>
          <spacer />
          <hstack backgroundColor="#1E293B" padding="small" cornerRadius="full" gap="xsmall">
            <text size="xsmall" weight="bold" color="#FF8C00">
              🔥 {streak} DAY STREAK
            </text>
            <text size="xsmall" color="#64748B">|</text>
            <text size="xsmall" color="#94A3B8">
              ⏳ {getHoursUntilReset()}
            </text>
          </hstack>
        </hstack>

        {/* Case Badge & Header */}
        <hstack width="100%" alignment="center">
          <text size="small" weight="bold" color="#94A3B8">
            {docket.caseNumber}: {docket.title.toUpperCase()}
          </text>
        </hstack>

        {/* Allegation Summary */}
        <vstack
          width="100%"
          backgroundColor="#131B2A"
          borderColor="#334155"
          border="thin"
          cornerRadius="medium"
          padding="small"
          gap="xsmall"
        >
          <text size="small" weight="bold" color="#F87171">
            🚨 THE ALLEGATION:
          </text>
          <text size="xsmall" color="#CBD5E1" wrap={true}>
            {docket.allegation}
          </text>
        </vstack>

        {/* Interactive Evidence Locker (The Game Core) */}
        <vstack width="100%" gap="xsmall">
          <hstack width="100%">
            <text size="xsmall" weight="bold" color="#38BDF8">
              🗂️ EVIDENCE LOCKER (Reviewed {inspectedCount}/3):
            </text>
          </hstack>

          <hstack width="100%" gap="small">
            {docket.evidence.map((item) => (
              <button
                grow
                key={item.id.toString()}
                size="small"
                appearance={inspectedEvidence[item.id] ? 'success' : 'bordered'}
                onPress={() => handleInspectEvidence(item)}
              >
                {inspectedEvidence[item.id] ? `✅ ${item.label.split(':')[0]}` : item.label.split(':')[0]}
              </button>
            ))}
          </hstack>

          {/* Active Evidence Inspection Detail */}
          {selectedEvidence && (
            <vstack
              width="100%"
              backgroundColor="#0F172A"
              borderColor="#0284C7"
              border="thin"
              cornerRadius="medium"
              padding="small"
              gap="xsmall"
            >
              <text size="xsmall" weight="bold" color="#38BDF8">
                {selectedEvidence.label}:
              </text>
              <text size="xsmall" color="#F1F5F9" italic={true} wrap={true}>
                "{selectedEvidence.detail}"
              </text>
            </vstack>
          )}
        </vstack>

        {/* Jury Decision Phase */}
        {!hasVoted ? (
          <vstack width="100%" gap="xsmall">
            <text size="small" weight="bold" alignment="center" color="#F8FAFC">
              Deliver your verdict, Juror:
            </text>
            <hstack width="100%" gap="small">
              <button
                grow
                appearance="bordered"
                textColor="#EF4444"
                onPress={() => handleVote('YTA')}
              >
                YTA (Guilty)
              </button>
              <button
                grow
                appearance="success"
                onPress={() => handleVote('NTA')}
              >
                NTA (Acquitted)
              </button>
            </hstack>
            <hstack width="100%" gap="small">
              <button
                grow
                appearance="bordered"
                textColor="#A855F7"
                onPress={() => handleVote('ESH')}
              >
                ESH (Everyone Sucks)
              </button>
              <button
                grow
                appearance="bordered"
                textColor="#64748B"
                onPress={() => handleVote('NAH')}
              >
                NAH (No Assholes)
              </button>
            </hstack>
          </vstack>
        ) : (
          /* Grand Jury Reveal & Community Accord */
          <vstack width="100%" gap="xsmall">
            <hstack
              width="100%"
              backgroundColor={userVote === docket.verdict ? '#064E3B' : '#450A0A'}
              padding="small"
              cornerRadius="medium"
              alignment="middle center"
            >
              <text size="small" weight="bold" color="#FFFFFF">
                {userVote === docket.verdict
                  ? `⚖️ ACCORD REACHED! (You & Community: ${docket.verdict})`
                  : `🏛️ DISSENTING OPINION (You: ${userVote} | Community: ${docket.verdict})`}
              </text>
            </hstack>

            {/* Voting Distribution */}
            <hstack width="100%">
              <text size="xsmall" weight="bold" color="#10B981">
                NTA: {liveVotes.NTA}%
              </text>
              <spacer />
              <text size="xsmall" weight="bold" color="#EF4444">
                YTA: {liveVotes.YTA}%
              </text>
              <spacer />
              <text size="xsmall" weight="bold" color="#A855F7">
                ESH: {liveVotes.ESH}%
              </text>
              <spacer />
              <text size="xsmall" weight="bold" color="#94A3B8">
                NAH: {liveVotes.NAH}%
              </text>
            </hstack>

            {/* Legal Rationale */}
            <vstack
              width="100%"
              backgroundColor="#0F172A"
              padding="small"
              cornerRadius="medium"
              border="thin"
              borderColor="#1E293B"
              gap="xsmall"
            >
              <text size="xsmall" color="#94A3B8" weight="bold">
                JURY CONSENSUS RATIONALE:
              </text>
              <text size="xsmall" color="#F8FAFC" italic={true} wrap={true}>
                "{docket.keyTakeaway}"
              </text>
            </vstack>

            {/* Share Scorecard */}
            <button appearance="primary" size="small" onPress={handleShare}>
              📋 Copy Detective Scorecard to Comments
            </button>
          </vstack>
        )}
      </vstack>
    );
  },
});

// Subreddit Launcher Menu Item
Devvit.addMenuItem({
  label: '⚖️ Launch KarmaCourt Trial',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const docket = getTodayDocket();

    await reddit.submitPost({
      title: `⚖️ KarmaCourt [${docket.caseNumber}]: ${docket.title}`,
      subredditName: subreddit.name,
      preview: (
        <vstack padding="medium" alignment="middle center">
          <text size="large" weight="bold" color="#FF4500">
            Loading Courtroom Evidence Locker...
          </text>
        </vstack>
      ),
    });

    ui.showToast({
      text: `⚖️ Trial docket posted to r/${subreddit.name}!`,
      appearance: 'success',
    });
  },
});

export default Devvit;
