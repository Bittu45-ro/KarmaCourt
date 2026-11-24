export interface Evidence {
  id: number;
  label: string; // e.g., "💬 Leaked Text", "📜 The Receipt"
  teaser: string;
  detail: string;
  isCrucial: boolean; // The "Smoking Gun"
}

export interface Docket {
  id: number;
  caseNumber: string;
  title: string;
  allegation: string;
  summary: string;
  evidence: Evidence[];
  verdict: 'YTA' | 'NTA' | 'ESH' | 'NAH';
  stats: {
    NTA: number;
    YTA: number;
    ESH: number;
    NAH: number;
  };
  keyTakeaway: string;
  topComment: string;
  commentAuthor: string;
}

export const DOCKETS: Docket[] = [
  {
    id: 1,
    caseNumber: "CASE #1042",
    title: "The Carolina Reaper Lunch Trap",
    allegation: "Accused poisoned the office fridge by putting ghost pepper sauce in their sandwich, sending an executive to the ER.",
    summary: "For 3 weeks, someone kept stealing my clearly labeled lunch from the company fridge. Management ignored my complaints. On Friday, I drenched my turkey sub with Carolina Reaper sauce. An executive choked, had a medical reaction, and is now demanding I be fired.",
    evidence: [
      {
        id: 1,
        label: "🏷️ Exhibit A: The Lunchbox",
        teaser: "Physical evidence from the breakroom fridge.",
        detail: "The lunchbox clearly had three bold labels stating: 'PRIVATE PROPERTY OF MARK - DO NOT TOUCH OR CONSUME.'",
        isCrucial: false
      },
      {
        id: 2,
        label: "💬 Exhibit B: HR Email Chain",
        teaser: "Official communication with office management.",
        detail: "Two prior emails proving the accused formally notified HR that lunches were being stolen daily, and HR replied: 'We cannot police personal food.'",
        isCrucial: false
      },
      {
        id: 3,
        label: "📜 Exhibit C: The Smoking Gun Receipt",
        teaser: "The accused's personal spicy food tolerance history.",
        detail: "Purchase history and sworn affidavits prove the accused regularly eats ultra-spicy hot sauces at home and brought it for personal consumption.",
        isCrucial: true
      }
    ],
    verdict: "NTA",
    stats: {
      NTA: 74,
      YTA: 18,
      ESH: 6,
      NAH: 2
    },
    keyTakeaway: "You cannot be held liable for food safety when someone unlawfully steals food clearly marked as your personal property.",
    topComment: "Play stupid games, win spicy prizes. You labeled your food. You didn't force him to steal your lunch.",
    commentAuthor: "u/spicy_justice"
  },
  {
    id: 2,
    caseNumber: "CASE #1043",
    title: "The First-Class Seat Extortion",
    allegation: "Accused refused to give up a paid first-class seat to allow a mother to sit next to her teenage daughter on an 11-hour flight.",
    summary: "I saved airline miles for two years to book a solo 1st-class ticket to Tokyo. A mother traveling in row 34 of economy demanded I swap my seat so she could sit with her 16-year-old daughter. When I refused, she rallied flight attendants and loudly shamed me for 'hating families.'",
    evidence: [
      {
        id: 1,
        label: "🎫 Exhibit A: The Boarding Pass",
        teaser: "Ticket class and pricing verification.",
        detail: "The accused paid 120,000 frequent flyer points and a $350 booking surcharge for Seat 2A two years in advance.",
        isCrucial: false
      },
      {
        id: 2,
        label: "📱 Exhibit B: Passenger Manifest",
        teaser: "Ages and seat reservations of the family.",
        detail: "The 'child' in question was 16 years and 10 months old, possessing her own smartphone and passport, seated in an aisle seat with extra legroom.",
        isCrucial: false
      },
      {
        id: 3,
        label: "✈️ Exhibit C: The Crucial Offer",
        teaser: "Transcript of the negotiation attempt.",
        detail: "The accused offered: 'I will gladly let you sit together if your daughter moves to first class and you trade me two economy seats.' The mother refused because she wanted the upgrade for herself.",
        isCrucial: true
      }
    ],
    verdict: "NTA",
    stats: {
      NTA: 91,
      YTA: 4,
      ESH: 4,
      NAH: 1
    },
    keyTakeaway: "Guilt-tripping a passenger into a multi-thousand-dollar seat downgrade is entitlement, not parenting.",
    topComment: "A 16-year-old can sit alone for a flight. She wanted your first-class upgrade for free under the guise of family.",
    commentAuthor: "u/sky_watcher"
  },
  {
    id: 3,
    caseNumber: "CASE #1044",
    title: "The Secret Wedding Dress Ambush",
    allegation: "Accused exposed the Mother-in-Law's secret dress purchase 48 hours before the ceremony, fracturing the bridal party.",
    summary: "I was picking up bridesmaids dresses when I saw my best friend's soon-to-be MIL purchasing the exact identical bridal gown. The bride had custom-tailored hers for 6 months. I secretly photographed the receipt and sent it to the bride. The groom's family is now demanding I be banned from the wedding.",
    evidence: [
      {
        id: 1,
        label: "📸 Exhibit A: The Boutique Photo",
        teaser: "Visual confirmation of the garment.",
        detail: "Timestamped photo showing the Mother-in-Law paying for a pure white bridal gown with an identical cathedral lace train.",
        isCrucial: false
      },
      {
        id: 2,
        label: "💬 Exhibit B: The Groom's Warning",
        teaser: "Text exchange before the leak.",
        detail: "The groom admitted in text that his mother 'loves attention' and begged the accused: 'Please don't tell Sarah, it will cause drama.'",
        isCrucial: true
      },
      {
        id: 3,
        label: "👰 Exhibit C: The Bride's Statement",
        teaser: "Reaction from the bride herself.",
        detail: "The bride stated under affidavit: 'She saved me from having a panic attack walking down my own aisle. She is my maid of honor for life.'",
        isCrucial: false
      }
    ],
    verdict: "NTA",
    stats: {
      NTA: 88,
      YTA: 2,
      ESH: 9,
      NAH: 1
    },
    keyTakeaway: "Protecting a bride from public humiliation at her own wedding is loyalty; the person creating the conflict is the one wearing white.",
    topComment: "You saved her from a public ambush at her own altar. The MIL ruined harmony, not you.",
    commentAuthor: "u/bridal_shield"
  }
];

export function getTodayDocket(): Docket {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DOCKETS[dayOfYear % DOCKETS.length];
}
