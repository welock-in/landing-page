export type FaqEntry = {
  question: string;
  answer: string;
  /** Extra search keywords — matched alongside the question and answer. */
  keywords: string;
};

export type FaqCategory = {
  name: string;
  items: FaqEntry[];
};

/** Full FAQ, grouped by category — powers the /faq page. */
export const faqCategories: FaqCategory[] = [
  {
    name: "Getting started",
    items: [
      {
        question: "What is WeLockIn?",
        answer:
          "WeLockIn blocks distracting and addictive apps and websites across all your devices. You pick what to block, choose how hard it is to turn off — from a simple PIN to a lock that can't be undone until a date you set — and it stays blocked, everywhere, until then. Built for deep focus, and for quitting genuinely addictive habits like porn, gambling or endless scrolling.",
        keywords: "about app blocker focus what is welockin",
      },
      {
        question: "How does WeLockIn actually work?",
        answer:
          "Three steps: choose the devices and the apps or sites you want gone, pick how strict the lock should be, then start. From install to locked in takes under a minute. Once a session is running, your distractions stay blocked on every synced device at the same time.",
        keywords: "how works steps start setup",
      },
      {
        question: "Who is WeLockIn for?",
        answer:
          "Anyone who wants their attention back — students and deep-work people first, since it's made by students and used at universities around the world. It's equally for people quitting something real: adult content, gambling, dating-app compulsion or gaming.",
        keywords: "who for audience students",
      },
      {
        question: "How do I set it up the first time?",
        answer:
          "Download WeLockIn from welock.in onto your Mac, iPhone, iPad or Windows PC, pick the devices you want covered, bundle the apps and sites you want blocked, set your strictness level, and start. You can add more devices at any time so one session locks all of them at once.",
        keywords: "install download setup first time onboarding",
      },
      {
        question: "What makes WeLockIn different?",
        answer:
          "Two things. It's $20 once, for life — no subscription, no renewal, no bill quietly landing every year. And it locks for real: for people quitting an addiction, Nuclear Mode is genuinely un-bypassable — no override, no back door, no 'just five minutes'.",
        keywords: "different unique why choose alternative special",
      },
      {
        question: "Are you really students?",
        answer:
          "Yes. A small team of engineering students from EPFL (Lausanne) and Polytechnique Paris who got tired of paying a subscription just to focus. Built by students, for students — that's the whole idea.",
        keywords: "students team founders who makes epfl polytechnique",
      },
      {
        question: "Can I use it for exam season or deep study?",
        answer:
          "That's exactly what it's built for. Bundle your distractions into a 'study' blocklist, schedule daily focus blocks, then use a Soft Lock for everyday revision or a Nuclear Lock when the deadline genuinely matters. Add the focus sounds and you're set for the whole session.",
        keywords: "exam exams study revision finals midterms deep work semester",
      },
    ],
  },
  {
    name: "What you can block",
    items: [
      {
        question: "What can I block with WeLockIn?",
        answer:
          "Any app or website, plus notifications. Social apps, specific sites, whole categories, or a custom mix — you decide what gets through and what goes quiet. You can bundle blocks together for contexts like work, study or sleep.",
        keywords:
          "block apps websites sites instagram tiktok youtube social media games",
      },
      {
        question: "Are there ready-made categories I can block in one tap?",
        answer:
          "Yes. WeLockIn's Protection categories are: Adult & explicit sites, Gambling (casinos, betting and lotteries), Dating apps, and Mature games. Pick a category and it's blocked everywhere, instantly.",
        keywords:
          "categories presets ready-made gambling betting casino dating tinder",
      },
      {
        question: "Does it block adult content automatically?",
        answer:
          "Yes — turn on the Adult & explicit category and pornography and explicit sites are blocked automatically across your devices, without you having to list them one by one.",
        keywords: "porn pornography adult explicit nsfw xxx content",
      },
      {
        question: "Can I block a specific app or site that isn't in a category?",
        answer:
          "Yes. Alongside the ready-made categories, you can block any individual app or website you name — a particular social network, a news site, that one game. Everything can be mixed into your own blocklists.",
        keywords: "specific custom individual site app name",
      },
      {
        question: "Can I group blocks together?",
        answer:
          "Yes. Bundle apps and sites into sets — a 'study' bundle, a 'sleep' bundle — and lock a whole bundle at once rather than toggling things one by one.",
        keywords: "bundle bundles groups sets blocklist lists",
      },
      {
        question: "Does it block notifications too, not just the app?",
        answer:
          "Yes. WeLockIn can silence notifications as well as block the apps and sites themselves, so a blocked app can't keep pulling you back with badges and pings.",
        keywords: "notifications badges pings alerts silence",
      },
      {
        question: "Can I schedule blocks to start automatically?",
        answer:
          "Yes. Set up recurring focus blocks and they start on their own — every weekday at nine, every evening at eleven — so showing up is automatic and skipping takes actual effort.",
        keywords: "schedule scheduling automatic recurring routine calendar",
      },
      {
        question: "Are there focus extras beyond blocking?",
        answer:
          "Yes: focus sounds (rain, lo-fi or forest), scheduling for recurring focus blocks that start automatically, short timed 'ad breaks' inside a session, and a password lock for your settings.",
        keywords: "sounds music rain lofi forest extras features breaks",
      },
    ],
  },
  {
    name: "Unlock difficulty levels",
    items: [
      {
        question: "How do I turn a block off — and how hard is that?",
        answer:
          "That's up to you. When you start, you choose one of five escalating difficulty levels, from a quick tap to no way out: PIN (Easy), Cooldown delay (Medium), Accountability partner (Hard), Passphrase (Hard), and Lock until a date — Nuclear Mode. The harder the level, the more friction stands between you and giving up.",
        keywords: "unlock turn off disable difficulty levels strictness",
      },
      {
        question: "How does the PIN unlock work?",
        answer:
          "You set a PIN and can unlock any time you enter it. It's the gentlest level — good for light focus where you mainly need a speed bump, not a wall.",
        keywords: "pin code easy",
      },
      {
        question: "What's the cooldown delay?",
        answer:
          "Turning protection off only takes effect after a waiting period. The delay gives the impulse time to pass, so you can't quit in the heat of the moment — by the time the wait is over, you often don't want to anymore.",
        keywords: "cooldown delay wait waiting medium",
      },
      {
        question: "Can a friend keep me accountable?",
        answer:
          "Yes — that's the Accountability partner level. You nominate a trusted person, and unblocking requires their approval. It turns quitting into a decision you have to justify to someone else, which is a powerful deterrent.",
        keywords: "friend accountability partner buddy approval trusted person",
      },
      {
        question: "What's the passphrase method?",
        answer:
          "To disable protection you must type out a long, random phrase in full. There's no shortcut — the deliberate effort is the point, making an impulsive unlock much less likely.",
        keywords: "passphrase phrase typing password hard",
      },
      {
        question: "Which level should I choose?",
        answer:
          "Match the level to how serious the habit is. For everyday focus, a PIN or cooldown is plenty. For something you truly want to quit, use an accountability partner, a passphrase, or Nuclear Mode. Start gentle and move up as you learn how much resistance you actually need.",
        keywords: "choose which level recommend advice",
      },
      {
        question: "What's the difference between a Soft Lock and a Nuclear Lock?",
        answer:
          "A Soft Lock lets you pause when life happens and stop the session early — it's for daily deep work. A Nuclear Lock disables pausing and can't be stopped until the timer ends; it even survives restarts and uninstalling the app. Choose Soft when you want a nudge, Nuclear when the deadline genuinely matters.",
        keywords: "soft lock nuclear lock pause stop early session",
      },
      {
        question: "Can I change the difficulty after I've started?",
        answer:
          "For gentle sessions (like a Soft Lock), yes — you can stop or adjust. For hard and Nuclear locks, no: the whole point is that you can't dial the difficulty back down mid-session. Choose the level deliberately before you commit.",
        keywords: "change adjust difficulty mid session after started",
      },
    ],
  },
  {
    name: "Nuclear Mode",
    items: [
      {
        question: "What is Nuclear Mode?",
        answer:
          "Nuclear Mode is WeLockIn's point of no return. You pick a date, arm it, and until that day arrives nothing turns your block off — no PIN, no override, no 'just five minutes'. It's built for people who genuinely want to quit something and know that leaving themselves an exit is exactly how they relapse.",
        keywords: "nuclear mode what is date point of no return",
      },
      {
        question: "Is it really permanent — genuinely no way to turn it off early?",
        answer:
          "Yes. Once Nuclear Mode is armed, it cannot be disabled before the date you set. There's no emergency unlock and no hidden back door. This is the one promise WeLockIn is built around, so we don't soften it: if you might need an escape hatch, choose a lower difficulty level instead.",
        keywords: "permanent early turn off back door escape",
      },
      {
        question: "I changed my mind an hour later. Can I undo it?",
        answer:
          "No. Changing your mind is the exact situation Nuclear Mode exists to overrule — the version of you that wants to quit is protecting you from the version that wants to relapse. It stays locked until the date. So set your date thoughtfully, and start with a shorter horizon if you're unsure.",
        keywords: "undo regret mistake changed mind cancel",
      },
      {
        question:
          "Can I bypass it by restarting my device, deleting the app, or reinstalling?",
        answer:
          "No. A Nuclear lock survives restarts and uninstalling the app — deleting WeLockIn doesn't lift the block, and reinstalling won't hand you a clean slate before the date. It's designed so the obvious 'outs' simply don't work.",
        keywords:
          "bypass uninstall delete reinstall restart reboot cheat hack workaround loophole",
      },
      {
        question: "What happens on my other devices?",
        answer:
          "The lock applies on every device you've synced — it's locked everywhere at once, not just where you armed it. You can't sidestep it by switching from your laptop to your phone.",
        keywords: "other devices everywhere sidestep switch",
      },
      {
        question: "What if I have a real emergency and truly need access?",
        answer:
          "Nuclear Mode has no emergency unlock, so anything you might genuinely need in a crisis must stay outside what you block. Block the specific addictive apps and sites — not tools you rely on for safety, work, health, or reaching people.",
        keywords: "emergency crisis urgent safety access",
      },
      {
        question: "Isn't this too extreme? Is it safe?",
        answer:
          "For casual focus, yes, it's more than you need — that's why the gentler levels exist. Nuclear Mode is deliberately for people quitting something that a softer block never holds against. Use it intentionally: choose a sensible date, only block what's actually harming you, and keep essential tools accessible. For a serious compulsion, WeLockIn can be one part of your plan alongside real-world support.",
        keywords: "extreme safe dangerous intense addiction",
      },
      {
        question: "Who is Nuclear Mode actually for?",
        answer:
          "People who have tried to stop on willpower alone and know they'll talk themselves out of it. If 'I'll just disable it this once' is how every previous attempt ended, removing that option is the point. If you still want flexibility, you're not ready for Nuclear yet — and that's fine.",
        keywords: "who for willpower relapse quit ready",
      },
      {
        question: "What happens when my focus session or Nuclear date ends?",
        answer:
          "The lock lifts on its own and you're back in control — keep protection running, start a fresh period, or turn it off. A Nuclear Lock focus session ends the same way the moment its timer hits zero.",
        keywords: "ends date arrives after over finish timer expires",
      },
      {
        question:
          "Nuclear Mode vs. a Nuclear Lock focus session — what's the difference?",
        answer:
          "Same spirit, different clock. A Nuclear Lock focus session can't be stopped until its timer ends — great for a hard deadline today. Nuclear Mode locks a whole category until a date you choose — built for quitting over days, weeks or longer. Both survive restarts and uninstalls; both have no override.",
        keywords: "nuclear lock mode difference timer date session",
      },
    ],
  },
  {
    name: "Devices & platforms",
    items: [
      {
        question: "Which devices and operating systems are supported?",
        answer:
          "WeLockIn works today on macOS, iOS (iPhone and iPad) and Windows. Android is coming soon. One session can cover your Mac, iPhone and iPad together.",
        keywords:
          "devices platforms mac macos ios iphone ipad windows pc supported",
      },
      {
        question: "Is it on Android yet?",
        answer:
          "Not yet — Android is on the way. Today WeLockIn runs on macOS, iOS and Windows. If Android is your main device, check welock.in for the latest before buying.",
        keywords: "android samsung pixel google phone mobile",
      },
      {
        question: "How does syncing work across my devices?",
        answer:
          "You add each device once, and from then on a single block locks all of them at the same time. Start protection on one device and your distractions go quiet everywhere you've synced — no need to set it up separately on each.",
        keywords: "sync syncing across devices together",
      },
      {
        question: 'What does "always on, 24/7" mean?',
        answer:
          "Once protection is active it runs continuously in the background — you don't have to re-arm it each day or remember to switch it on. Your status shows it's live and how many devices are covered.",
        keywords: "always on 24/7 background continuous",
      },
    ],
  },
  {
    name: "Privacy",
    items: [
      {
        question: "Do you track or log the websites I visit?",
        answer:
          "No. WeLockIn never logs which sites you visit. Filtering happens privately, on your device — the point is to protect your focus, not to watch your browsing.",
        keywords: "track log history spy watch browsing data",
      },
      {
        question: 'What does "on-device filtering" mean for me?',
        answer:
          "It means the decision to block or allow a site is made locally on your device, not by sending your browsing to a server first. Your activity stays with you, and blocking keeps working without handing a log of your habits to anyone.",
        keywords: "on-device local filtering server privacy secure",
      },
    ],
  },
  {
    name: "Pricing",
    items: [
      {
        question: "How much does WeLockIn cost?",
        answer:
          "$20, once. That's it — you own it for life, with no subscription and no renewal. It's a deliberate contrast to focus apps that bill you every year.",
        keywords: "price cost money how much cheap pay refund",
      },
      {
        question: "Is it really a one-time payment, not a subscription?",
        answer:
          "Yes. $20 once, yours for life, no subscription. You are not signed up for a recurring charge.",
        keywords: "subscription one-time payment recurring billing cancel refund",
      },
      {
        question: "What do I get for the $20?",
        answer:
          "The full product: block any app, site or category; all five unlock difficulty levels including Nuclear Mode; multi-device sync across supported platforms; scheduling, focus sounds and the rest — for life.",
        keywords: "included what get features full lifetime",
      },
      {
        question: "If I stop paying, do my active blocks turn off?",
        answer:
          "There's nothing to stop paying — WeLockIn is a one-time purchase, not a subscription. Your blocks, including a Nuclear lock, aren't tied to an ongoing bill and won't lapse because a renewal failed. There is no renewal.",
        keywords: "stop paying lapse expire renewal billing nuclear",
      },
    ],
  },
  {
    name: "Troubleshooting",
    items: [
      {
        question: "A site or app isn't being blocked. What do I do?",
        answer:
          "First check it's actually included — that the app or site is in an active blocklist or category, and that the block is running on that specific device. If it still slips through, note the app or URL and email hello@welock.in so we can add it.",
        keywords: "not blocked working slips through missed broken bug",
      },
      {
        question: "Something is blocked that I need. How do I unblock just that?",
        answer:
          "If you're on a gentle level (PIN or cooldown), remove that app or site from your list, or briefly unlock to adjust it. Under a hard or Nuclear lock it stays blocked until the lock ends — by design. Which is why it's best to block only the things genuinely harming your focus.",
        keywords: "unblock need accidentally exception remove",
      },
      {
        question: "My devices aren't syncing — a block isn't showing up everywhere.",
        answer:
          "Make sure each device is added to WeLockIn and connected, then give it a moment to sync. If a device is still out of step, restart the app on that device. Still stuck? Email hello@welock.in.",
        keywords: "sync not syncing showing missing device problem",
      },
      {
        question:
          "What does the screen look like when I open something that's blocked?",
        answer:
          "A clean, minimal block screen with WeLockIn's padlock — a simple 'this is locked' moment rather than a nagging wall of text. Peep may or may not judge you gently.",
        keywords: "blocked screen looks like see padlock peep",
      },
      {
        question: "How do I contact support or report a bug?",
        answer:
          "Email hello@welock.in with your device, OS and what happened. A real human student reads it — usually between two lectures.",
        keywords: "support help contact bug report email human",
      },
    ],
  },
];
