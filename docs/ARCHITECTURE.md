# System Architecture: KarmaCourt

```mermaid
flowchart TD
    subgraph Reddit Platform
        Client[Reddit Web / Mobile Client]
        Subreddit[r/KarmaCourt or Community Subreddit]
    end

    subgraph Devvit Runtime
        Post[Interactive Custom Post]
        Router[Daily Docket Resolver]
        State[Player State Hook: Vote & Streak]
        RedisKV[(Devvit Redis Store)]
    end

    Subreddit -->|Loads Post| Post
    Post --> Router
    Router -->|Determines Day of Year| Data[(Curated Dockets)]
    Client -->|Clicks Verdict: YTA/NTA/ESH/NAH| State
    State -->|Persists User Record| RedisKV
    State -->|Renders Consensus & Quote| Post
    Post -->|Wordle-style Emoji Share| Client
```

## Core Components
1. **Interactive Post (`src/main.tsx`):** Built with Devvit JSX declarative blocks (`<vstack>`, `<hstack>`, `<button>`, `<text>`). Zero external iframe or external webview required.
2. **Deterministic Daily Engine (`src/data/dockets.ts`):** Syncs all users globally to the same 24-hour case docket based on timestamp.
3. **Verdict Accord Validator:** Evaluates player judgment vs community consensus and renders responsive visual scorecards.
4. **Subreddit Action Menu:** Allows moderators or creators to pin a new trial docket to any subreddit with one click.
