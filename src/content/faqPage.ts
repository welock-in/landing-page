/**
 * The full FAQ, grouped by category.
 *
 * This module is the data layer behind three route levels: the `/faq` hub, the
 * eight `/faq/[category]` hubs, and one page per question. Slugs live here
 * rather than being derived from the question text, because a slug is a URL —
 * once it ships it is a promise, and rewording a question must not silently
 * break the link to it.
 *
 * Each entry carries `answer` (the direct, self-contained response, which is
 * also what goes into structured data) and `detail` (the practical specifics
 * that would bloat the answer). Keeping them apart is what lets one question
 * render as a compact accordion row on the hub and as a full page on its own.
 */

export type FaqEntry = {
  /** URL segment under the category. Never change one without a redirect. */
  slug: string;
  question: string;
  /**
   * The direct answer, 40–70 words, leading with the answer itself.
   * Doubles as the `acceptedAnswer` in FAQPage structured data, so it has to
   * stand on its own with no surrounding page for context.
   */
  answer: string;
  /** Practical specifics that expand the answer on the question's own page. */
  detail: string[];
  /** Meta description, ≤ 155 characters. */
  description: string;
  /** Extra search terms — matched by the on-page search alongside Q and A. */
  keywords: string;
};

export type FaqCategory = {
  /** URL segment under `/faq`. */
  slug: string;
  name: string;
  /** H1 of the category hub — phrased as a topic, not a label. */
  headline: string;
  /** Opening paragraph of the category hub. */
  intro: string;
  /** Meta description for the category hub, ≤ 155 characters. */
  description: string;
  items: FaqEntry[];
};

export const faqCategories: FaqCategory[] = [
  {
    slug: "getting-started",
    name: "Getting started",
    headline: "Getting started with WeLockIn",
    intro:
      "What WeLockIn is, who it is built for, and how to go from downloading it to your first locked session in under a minute.",
    description:
      "What WeLockIn is, who it's for, how it works, and how to set it up on your first device. Answered by the students who built it.",
    items: [
      {
        slug: "what-is-welockin",
        question: "What is WeLockIn?",
        answer:
          "WeLockIn blocks distracting and addictive apps and websites across all your devices at once. You pick what to block, choose how hard it is to turn off — from a simple PIN to a lock that cannot be undone until a date you set — and it stays blocked everywhere until then.",
        detail: [
          "It runs on macOS, iOS, iPadOS and Windows today, with Android on the way.",
          "There is no device limit — link as many devices as you want, and they all lock together.",
          "It is built for two jobs at once: deep focus for work and study, and quitting genuinely addictive habits like porn, gambling or endless scrolling.",
        ],
        description:
          "WeLockIn blocks distracting apps and sites across every device you own, with five unlock difficulty levels up to a lock nothing lifts early.",
        keywords: "about app blocker focus what is welockin",
      },
      {
        slug: "how-it-works",
        question: "How does WeLockIn actually work?",
        answer:
          "Three steps. Choose the devices and the apps or sites you want gone, pick how strict the lock should be, then start. From install to locked in takes under a minute. Once a session is running, your distractions stay blocked on every synced device at the same time.",
        detail: [
          "Blocking happens on the device itself, so it keeps working without sending your browsing anywhere.",
          "You can save a set of apps and sites as a bundle and reuse it, instead of rebuilding the list every session.",
          "Sessions can start on a schedule, so the decision to focus is made once rather than every morning.",
        ],
        description:
          "Pick your devices and blocklist, choose a strictness level, hit start. Under a minute from install to locked in, on every device at once.",
        keywords: "how works steps start setup",
      },
      {
        slug: "who-is-it-for",
        question: "Who is WeLockIn for?",
        answer:
          "Anyone who wants their attention back. Students and deep-work people first, since it is made by students and used at universities around the world. It is equally for people quitting something real — adult content, gambling, dating-app compulsion or gaming — where a block you can switch off is no block at all.",
        detail: [
          "For focus, the gentler levels are usually enough: a PIN or a cooldown delay is a speed bump, not a wall.",
          "For quitting a compulsion, Nuclear Mode exists precisely because willpower alone has already failed.",
          "It is used across 25+ universities from Lausanne to Tokyo, which is where most of the early feedback comes from.",
        ],
        description:
          "Students, deep-work people, and anyone quitting a real compulsion — porn, gambling, dating apps or gaming. Two jobs, one blocker.",
        keywords: "who for audience students",
      },
      {
        slug: "first-time-setup",
        question: "How do I set it up the first time?",
        answer:
          "Download WeLockIn onto your Mac, iPhone, iPad or Windows PC, pick the devices you want covered, bundle the apps and sites you want blocked, set your strictness level, and start. You can add more devices at any time, so one session locks all of them at once.",
        detail: [
          "Start with a Soft Lock for your first session — you will learn how much resistance you actually need before committing to more.",
          "Add every device you own before your first serious session. A blocker that covers your laptop but not your phone is a blocker with a door in it.",
          "Save your first blocklist as a bundle so the second session takes ten seconds instead of a minute.",
        ],
        description:
          "Download, pick your devices, bundle the apps and sites to block, set a strictness level, start. Add more devices any time.",
        keywords: "install download setup first time onboarding",
      },
      {
        slug: "what-makes-it-different",
        question: "What makes WeLockIn different?",
        answer:
          "It locks for real. Nuclear Mode is genuinely un-bypassable — no override, no back door, no 'just five minutes' — and it survives restarts and uninstalling the app. Most focus apps leave you an escape hatch, and that escape hatch is how people relapse. Removing it is the entire product.",
        detail: [
          "A lock that survives a restart and an uninstall is rare — plenty of blockers are defeated by deleting the app.",
          "Five escalating difficulty levels, so the friction matches the habit rather than one setting for everyone.",
          "One session covers your computer, phone and tablet at the same time, closing the switch-devices loophole.",
        ],
        description:
          "A Nuclear Mode with no override and no back door, that survives uninstalling the app. Most blockers leave you an escape hatch.",
        keywords: "different unique why choose alternative special",
      },
      {
        slug: "built-by-students",
        question: "Are you really students?",
        answer:
          "Yes. A small team of engineering students from EPFL in Lausanne and Polytechnique Paris, who got tired of every focus app either being too easy to switch off or asking too much of a student budget. Built by students, for students — that is the whole idea.",
        detail: [
          "Support emails are answered by the people who wrote the code, usually between lectures.",
          "It is used across 25+ universities, which is where most of the early feedback comes from.",
        ],
        description:
          "Yes — engineering students from EPFL Lausanne and Polytechnique Paris who wanted a blocker that actually holds.",
        keywords: "students team founders who makes epfl polytechnique",
      },
      {
        slug: "exam-season-study",
        question: "Can I use it for exam season or deep study?",
        answer:
          "That is exactly what it is built for. Bundle your distractions into a study blocklist, schedule daily focus blocks, then use a Soft Lock for everyday revision or a Nuclear Lock when the deadline genuinely matters. Add the focus sounds and the session runs itself while you work.",
        detail: [
          "Scheduling matters more than motivation during exam season: blocks that start on their own remove the daily decision.",
          "A Nuclear Lock is worth saving for the sessions that count — using it every day tends to make you resent it.",
          "Blocking notifications as well as the apps stops a silenced phone from still pulling you back with badges.",
        ],
        description:
          "Built for it. Bundle a study blocklist, schedule daily blocks, Soft Lock for revision and Nuclear Lock when the deadline matters.",
        keywords: "exam exams study revision finals midterms deep work semester",
      },
    ],
  },
  {
    slug: "what-you-can-block",
    name: "What you can block",
    headline: "What you can block with WeLockIn",
    intro:
      "Apps, websites, whole categories and notifications — what WeLockIn can shut out, and how to group it all so one tap covers a whole context.",
    description:
      "Block any app or website, one-tap categories for adult content, gambling, dating and games, plus notifications, bundles and schedules.",
    items: [
      {
        slug: "what-can-i-block",
        question: "What can I block with WeLockIn?",
        answer:
          "Any app or website, plus notifications. Social apps, specific sites, whole categories, or a custom mix — you decide what gets through and what goes quiet. You can bundle blocks together for contexts like work, study or sleep, and lock a whole bundle in one action.",
        detail: [
          "Individual apps and individual URLs can both be named directly, so nothing has to fit a preset.",
          "Notifications can be silenced alongside the app, which closes the badge-and-ping loophole.",
          "Bundles are reusable, so 'study' and 'sleep' become one tap each rather than a list you rebuild.",
        ],
        description:
          "Any app or website, whole categories, and notifications. Mix presets with your own picks, then bundle them for work, study or sleep.",
        keywords:
          "block apps websites sites instagram tiktok youtube social media games",
      },
      {
        slug: "ready-made-categories",
        question: "Are there ready-made categories I can block in one tap?",
        answer:
          "Yes. WeLockIn's Protection categories are Adult and explicit sites, Gambling including casinos, betting and lotteries, Dating apps, and Mature games. Pick a category and it is blocked everywhere, instantly, without you having to name each site or app yourself.",
        detail: [
          "Categories cover sites you have never heard of, which is the point — a manual list only blocks what you can remember.",
          "Categories and your own custom picks can be combined in the same session.",
          "A category stays blocked across every synced device, not just the one you armed it on.",
        ],
        description:
          "Four one-tap categories: adult and explicit sites, gambling, dating apps and mature games. Blocked everywhere, instantly.",
        keywords:
          "categories presets ready-made gambling betting casino dating tinder",
      },
      {
        slug: "block-adult-content",
        question: "Does it block adult content automatically?",
        answer:
          "Yes. Turn on the Adult and explicit category and pornography and explicit sites are blocked automatically across your devices, without you listing them one by one. This is the category most often paired with Nuclear Mode, because a porn block you can switch off in the moment is not really a block.",
        detail: [
          "The category approach matters here: manually listing sites means the block only covers what you already know about.",
          "Pairing it with an accountability partner or Nuclear Mode is what makes it hold during a craving.",
          "Filtering happens on the device, so using it does not mean sending anyone a log of what you browse.",
        ],
        description:
          "Yes — one toggle blocks pornography and explicit sites across every device. Pair it with Nuclear Mode so it actually holds.",
        keywords: "porn pornography adult explicit nsfw xxx content",
      },
      {
        slug: "block-a-specific-app",
        question: "Can I block a specific app or site that isn't in a category?",
        answer:
          "Yes. Alongside the ready-made categories you can block any individual app or website you name — a particular social network, a news site, that one game. Everything can be mixed into your own blocklists, so presets and custom picks live side by side in the same session.",
        detail: [
          "Useful for the distraction that is specific to you: a forum, a fantasy league, one particular subreddit.",
          "Custom entries can be saved into a bundle and reused like any preset.",
          "If a site slips through despite being listed, emailing the URL to support is what gets it fixed.",
        ],
        description:
          "Yes — name any individual app or website and it blocks, alongside the presets. Custom picks and categories mix in one blocklist.",
        keywords: "specific custom individual site app name",
      },
      {
        slug: "group-blocks-into-bundles",
        question: "Can I group blocks together?",
        answer:
          "Yes. Bundle apps and sites into sets — a study bundle, a sleep bundle, a work bundle — and lock a whole bundle at once rather than toggling things one by one. The bundle is what turns a focus session from a two-minute setup into a single tap.",
        detail: [
          "Bundles are the difference between a blocker you use twice and one that becomes a daily ritual.",
          "A bundle can mix categories with individually named apps and sites.",
          "Schedules run on bundles, so a recurring block starts with the right list already loaded.",
        ],
        description:
          "Yes — group apps and sites into reusable bundles like study, sleep or work, and lock a whole bundle in one tap.",
        keywords: "bundle bundles groups sets blocklist lists",
      },
      {
        slug: "block-notifications",
        question: "Does it block notifications too, not just the app?",
        answer:
          "Yes. WeLockIn can silence notifications as well as block the apps and sites themselves, so a blocked app cannot keep pulling you back with badges and pings. Blocking the app while leaving its notifications on is how most focus tools leak — the app is shut, but the pull is still there.",
        detail: [
          "A badge you cannot act on is worse than one you can: it creates the itch without the release.",
          "Notification silencing applies per bundle, so a work bundle and a sleep bundle can behave differently.",
        ],
        description:
          "Yes — notifications can be silenced alongside the apps, so a blocked app can't keep pulling you back with badges and pings.",
        keywords: "notifications badges pings alerts silence",
      },
      {
        slug: "schedule-blocks",
        question: "Can I schedule blocks to start automatically?",
        answer:
          "Yes. Set up recurring focus blocks and they start on their own — every weekday at nine, every evening at eleven — so showing up is automatic and skipping takes actual effort. Scheduling is what converts a blocker from something you remember to use into something that just runs.",
        detail: [
          "Recurring schedules run per bundle, so a morning work block and a nightly wind-down can differ.",
          "A scheduled block still respects the strictness level you set for it.",
          "Sleep schedules are the most common second use, after study.",
        ],
        description:
          "Yes — recurring blocks start on their own, every weekday morning or every evening, so focusing is automatic and skipping takes effort.",
        keywords: "schedule scheduling automatic recurring routine calendar",
      },
      {
        slug: "focus-extras",
        question: "Are there focus extras beyond blocking?",
        answer:
          "Yes. Focus sounds including rain, lo-fi and forest; scheduling for recurring blocks that start automatically; short timed breaks inside a session; and a password lock for your settings so the app itself cannot be quietly reconfigured mid-session.",
        detail: [
          "Focus sounds are per-session, so a study session and a wind-down can sound different.",
          "Timed breaks are bounded — they end on their own rather than becoming the rest of the evening.",
          "Locking the settings closes the obvious loophole of editing the blocklist instead of unlocking it.",
        ],
        description:
          "Focus sounds, recurring schedules, bounded timed breaks, and a password lock on settings so the app can't be reconfigured mid-session.",
        keywords: "sounds music rain lofi forest extras features breaks",
      },
    ],
  },
  {
    slug: "unlock-difficulty-levels",
    name: "Unlock difficulty levels",
    headline: "The five unlock difficulty levels",
    intro:
      "WeLockIn lets you choose how hard it is to quit a session, from a PIN you can type in two seconds to a lock nothing lifts before the date you set. Here is what each level does and which one to pick.",
    description:
      "PIN, cooldown delay, accountability partner, passphrase, and lock-until-a-date. What each unlock difficulty level does and which to choose.",
    items: [
      {
        slug: "how-to-turn-a-block-off",
        question: "How do I turn a block off — and how hard is that?",
        answer:
          "That is up to you. When you start, you choose one of five escalating difficulty levels: PIN (easy), cooldown delay (medium), accountability partner (hard), passphrase (hard), and lock until a date, which is Nuclear Mode. The harder the level, the more friction stands between you and giving up.",
        detail: [
          "The level is chosen at the start of a session, not during it — that is what makes it work.",
          "Gentle levels can be stopped early; hard and Nuclear levels cannot.",
          "Match the level to the habit rather than to your mood: pick for the version of you who will want out.",
        ],
        description:
          "Five escalating levels: PIN, cooldown delay, accountability partner, passphrase, and lock-until-a-date. You choose the friction up front.",
        keywords: "unlock turn off disable difficulty levels strictness",
      },
      {
        slug: "pin-unlock",
        question: "How does the PIN unlock work?",
        answer:
          "You set a PIN and can unlock any time you enter it. It is the gentlest level — good for light focus where you mainly need a speed bump rather than a wall. The PIN will not stop a determined craving; it stops the absent-minded unlock, which for everyday focus is most of the problem.",
        detail: [
          "Best for work sessions where you may legitimately need an app back mid-session.",
          "If you find yourself typing the PIN without deciding to, that is the signal to move up a level.",
        ],
        description:
          "Set a PIN, unlock any time you type it. The gentlest level — a speed bump for everyday focus, not a wall against a craving.",
        keywords: "pin code easy",
      },
      {
        slug: "cooldown-delay",
        question: "What's the cooldown delay?",
        answer:
          "Turning protection off only takes effect after a waiting period. The delay gives the impulse time to pass, so you cannot quit in the heat of the moment — and by the time the wait is over, you often do not want to anymore. It is the level that does the most work for the least commitment.",
        detail: [
          "The wait is the mechanism: cravings are short, and a delay outlasts most of them.",
          "Unlike a PIN, it cannot be defeated by knowing your own secret.",
          "A good default for people who find a PIN too soft and Nuclear Mode too final.",
        ],
        description:
          "Turning protection off only takes effect after a wait. The delay outlasts the impulse — by the time it's over, you usually don't want out.",
        keywords: "cooldown delay wait waiting medium",
      },
      {
        slug: "accountability-partner",
        question: "Can a friend keep me accountable?",
        answer:
          "Yes — that is the accountability partner level. You nominate a trusted person, and unblocking requires their approval. It turns quitting into a decision you have to justify to someone else, which is a far stronger deterrent than any amount of self-imposed friction.",
        detail: [
          "Choose someone who will actually ask why, not someone who will approve on reflex.",
          "It is the level most often recommended for quitting a compulsion when Nuclear Mode feels too absolute.",
          "Your partner approves the unlock; they do not receive a log of what you browse.",
        ],
        description:
          "Yes — nominate a trusted person and unblocking needs their approval. Quitting becomes a decision you have to justify out loud.",
        keywords: "friend accountability partner buddy approval trusted person",
      },
      {
        slug: "passphrase",
        question: "What's the passphrase method?",
        answer:
          "To disable protection you must type out a long, random phrase in full. There is no shortcut and no copy-paste — the deliberate effort is the point. By the time you have typed it, the unlock has become a conscious choice rather than a reflex, which is usually enough to stop it.",
        detail: [
          "It works on the same principle as the cooldown, but trades waiting for effort.",
          "Good for people who would simply wait out a delay but will not sit and type.",
        ],
        description:
          "Type a long random phrase in full to disable protection. No shortcut — the effort turns an unlock reflex into a conscious choice.",
        keywords: "passphrase phrase typing password hard",
      },
      {
        slug: "which-level-to-choose",
        question: "Which level should I choose?",
        answer:
          "Match the level to how serious the habit is. For everyday focus, a PIN or cooldown is plenty. For something you truly want to quit, use an accountability partner, a passphrase, or Nuclear Mode. Start gentle and move up as you learn how much resistance you actually need.",
        detail: [
          "Everyday deep work: PIN or cooldown. You may need an app back for legitimate reasons.",
          "A deadline that genuinely matters: Nuclear Lock for the length of the session.",
          "Quitting a compulsion: accountability partner, passphrase, or Nuclear Mode for a set date.",
          "If you have already talked yourself out of every previous attempt, the gentle levels will not hold.",
        ],
        description:
          "PIN or cooldown for everyday focus. Accountability partner, passphrase or Nuclear Mode for quitting something real. Start gentle.",
        keywords: "choose which level recommend advice",
      },
      {
        slug: "soft-lock-vs-nuclear-lock",
        question: "What's the difference between a Soft Lock and a Nuclear Lock?",
        answer:
          "A Soft Lock lets you pause when life happens and stop the session early — it is for daily deep work. A Nuclear Lock disables pausing and cannot be stopped until the timer ends; it survives restarts and even uninstalling the app. Choose Soft when you want a nudge, Nuclear when the deadline genuinely matters.",
        detail: [
          "Soft Lock is the right default: most sessions do not need to be unbreakable.",
          "Nuclear Lock is scoped to a session timer; Nuclear Mode is scoped to a date, which is the bigger commitment.",
          "Nothing lifts a Nuclear Lock early, so only block what you can genuinely do without for that long.",
        ],
        description:
          "Soft Lock pauses and stops early — for daily deep work. Nuclear Lock can't be stopped until the timer ends and survives uninstalls.",
        keywords: "soft lock nuclear lock pause stop early session",
      },
      {
        slug: "change-difficulty-mid-session",
        question: "Can I change the difficulty after I've started?",
        answer:
          "For gentle sessions like a Soft Lock, yes — you can stop or adjust. For hard and Nuclear locks, no. The whole point is that you cannot dial the difficulty back down mid-session, because the version of you who wants to lower it is exactly the one the lock exists to overrule.",
        detail: [
          "You can always raise the stakes mid-session; you can never lower them.",
          "Choose the level deliberately before you commit, not once the craving has started.",
        ],
        description:
          "Soft sessions can be adjusted. Hard and Nuclear locks cannot — dialling the difficulty down mid-session is exactly what they prevent.",
        keywords: "change adjust difficulty mid session after started",
      },
    ],
  },
  {
    slug: "nuclear-mode",
    name: "Nuclear Mode",
    headline: "Nuclear Mode: the point of no return",
    intro:
      "Nuclear Mode locks a category until a date you choose, with no override and no back door. It is the most-asked-about part of WeLockIn, and the part we refuse to soften. Here is exactly what it does.",
    description:
      "Nuclear Mode locks until a date you set, with no override, no early unlock, and no bypass by restarting or deleting the app.",
    items: [
      {
        slug: "what-is-nuclear-mode",
        question: "What is Nuclear Mode?",
        answer:
          "Nuclear Mode is WeLockIn's point of no return. You pick a date, arm it, and until that day arrives nothing turns your block off — no PIN, no override, no 'just five minutes'. It is built for people who genuinely want to quit something and know that leaving themselves an exit is exactly how they relapse.",
        detail: [
          "It locks a category or bundle until a calendar date, rather than for the length of a session.",
          "It applies across every synced device at once, so switching devices is not a way out.",
          "It is deliberately not the default — the gentler levels exist for everyday focus.",
        ],
        description:
          "Pick a date, arm it, and nothing turns the block off until that day. No PIN, no override, no back door.",
        keywords: "nuclear mode what is date point of no return",
      },
      {
        slug: "is-it-really-permanent",
        question: "Is it really permanent — genuinely no way to turn it off early?",
        answer:
          "Yes. Once Nuclear Mode is armed it cannot be disabled before the date you set. There is no emergency unlock and no hidden back door. This is the one promise WeLockIn is built around, so we do not soften it: if you might need an escape hatch, choose a lower difficulty level instead.",
        detail: [
          "Support cannot lift it for you either — a lock staff can remove is not a lock.",
          "This is why the date matters more than any other setting you choose.",
          "If that sounds like too much, the accountability partner level gives you resistance without finality.",
        ],
        description:
          "Yes. Once armed it cannot be disabled before your date. No emergency unlock, no back door, and support can't lift it either.",
        keywords: "permanent early turn off back door escape",
      },
      {
        slug: "can-i-undo-it",
        question: "I changed my mind an hour later. Can I undo it?",
        answer:
          "No. Changing your mind is the exact situation Nuclear Mode exists to overrule — the version of you that wanted to quit is protecting you from the version that wants to relapse. It stays locked until the date. So set your date thoughtfully, and start with a shorter horizon if you are unsure.",
        detail: [
          "A first Nuclear Mode of a few days teaches you more than a first one of six months.",
          "Regret an hour in is normal and expected; it is not a sign you chose wrong.",
          "If you want the option to change your mind, you want a different level, and that is a legitimate choice.",
        ],
        description:
          "No — changing your mind is exactly what Nuclear Mode overrules. Set the date thoughtfully, and start short if you're unsure.",
        keywords: "undo regret mistake changed mind cancel",
      },
      {
        slug: "bypass-by-deleting-the-app",
        question:
          "Can I bypass it by restarting my device, deleting the app, or reinstalling?",
        answer:
          "No. A Nuclear lock survives restarts and uninstalling the app — deleting WeLockIn does not lift the block, and reinstalling will not hand you a clean slate before the date. It is designed so that the obvious ways out simply do not work, because those are the first three things everyone tries.",
        detail: [
          "Restarting does not clear it. Uninstalling does not clear it. Reinstalling does not reset it.",
          "This is the single biggest difference between WeLockIn and blockers that a delete-and-reinstall defeats.",
          "Switching to another of your synced devices does not work either — the lock is on all of them.",
        ],
        description:
          "No. A Nuclear lock survives restarts, uninstalling and reinstalling. The three obvious ways out are the three that are closed.",
        keywords:
          "bypass uninstall delete reinstall restart reboot cheat hack workaround loophole",
      },
      {
        slug: "nuclear-mode-other-devices",
        question: "What happens on my other devices?",
        answer:
          "The lock applies on every device you have synced — it is locked everywhere at once, not just where you armed it. You cannot sidestep it by switching from your laptop to your phone, which is the most common way a single-device blocker gets defeated in practice.",
        detail: [
          "Add every device you own before arming Nuclear Mode; an unsynced device is an open door.",
          "There is no device limit — every device you link locks at once.",
        ],
        description:
          "It locks every synced device at once. Switching from laptop to phone is not a way out.",
        keywords: "other devices everywhere sidestep switch",
      },
      {
        slug: "emergency-access",
        question: "What if I have a real emergency and truly need access?",
        answer:
          "Nuclear Mode has no emergency unlock, so anything you might genuinely need in a crisis must stay outside what you block. Block the specific addictive apps and sites — not tools you rely on for safety, work, health, or reaching people. This is the single most important thing to get right before you arm it.",
        detail: [
          "Never block your phone app, messages, maps, banking, or anything health-related.",
          "Block the specific thing that is harming you, not a broad category that sweeps up essentials.",
          "If you are unsure whether you will need something, leave it unblocked — you can always tighten next time.",
        ],
        description:
          "There is no emergency unlock, so keep anything you might need in a crisis outside your blocklist. Block the harm, never the essentials.",
        keywords: "emergency crisis urgent safety access",
      },
      {
        slug: "is-nuclear-mode-safe",
        question: "Isn't this too extreme? Is it safe?",
        answer:
          "For casual focus, yes, it is more than you need — that is why the gentler levels exist. Nuclear Mode is deliberately for people quitting something a softer block never holds against. Use it intentionally: choose a sensible date, block only what is actually harming you, and keep essential tools accessible.",
        detail: [
          "For a serious compulsion, WeLockIn is one part of a plan, not the whole plan — real-world support does the rest.",
          "Blocking essential tools is the one way this can genuinely go wrong, and it is entirely avoidable.",
          "Choosing a shorter first date is not a failure of commitment; it is how you learn what works.",
        ],
        description:
          "For casual focus it's overkill — use the gentler levels. For quitting something real, use it deliberately and keep essentials unblocked.",
        keywords: "extreme safe dangerous intense addiction",
      },
      {
        slug: "who-is-nuclear-mode-for",
        question: "Who is Nuclear Mode actually for?",
        answer:
          "People who have tried to stop on willpower alone and know they will talk themselves out of it. If 'I'll just disable it this once' is how every previous attempt ended, removing that option is the entire point. If you still want flexibility, you are not ready for Nuclear yet — and that is fine.",
        detail: [
          "The test is simple: has an escape hatch ended every previous attempt? Then close it.",
          "Wanting flexibility is not weakness; it means a different level fits you better right now.",
        ],
        description:
          "For people who know they'll talk themselves out of it. If 'I'll just disable it this once' ended every attempt, close that door.",
        keywords: "who for willpower relapse quit ready",
      },
      {
        slug: "when-nuclear-mode-ends",
        question: "What happens when my focus session or Nuclear date ends?",
        answer:
          "The lock lifts on its own and you are back in control — keep protection running, start a fresh period, or turn it off. A Nuclear Lock focus session ends the same way the moment its timer hits zero. Nothing is deleted and nothing is lost; the block simply stops being enforced.",
        detail: [
          "Your bundles and settings survive, so starting a fresh period takes one tap.",
          "Many people re-arm immediately with a longer date — the first period is the hard one.",
        ],
        description:
          "The lock lifts by itself and you're back in control. Keep it running, start a fresh period, or stop. Nothing is deleted.",
        keywords: "ends date arrives after over finish timer expires",
      },
      {
        slug: "nuclear-mode-vs-nuclear-lock",
        question:
          "Nuclear Mode vs. a Nuclear Lock focus session — what's the difference?",
        answer:
          "Same spirit, different clock. A Nuclear Lock focus session cannot be stopped until its timer ends — good for a hard deadline today. Nuclear Mode locks a whole category until a date you choose, built for quitting over days, weeks or longer. Both survive restarts and uninstalls, and neither has an override.",
        detail: [
          "Nuclear Lock: hours. Scoped to one session, ends when the timer does.",
          "Nuclear Mode: days to months. Scoped to a category, ends on a calendar date.",
          "Use the Lock for deadlines and the Mode for habits.",
        ],
        description:
          "Nuclear Lock ends when a session timer does — for today's deadline. Nuclear Mode runs to a calendar date — for quitting a habit.",
        keywords: "nuclear lock mode difference timer date session",
      },
    ],
  },
  {
    slug: "devices-and-platforms",
    name: "Devices & platforms",
    headline: "Devices and platforms WeLockIn supports",
    intro:
      "Which operating systems WeLockIn runs on today, what is coming, and how one session locks every device you link at the same time.",
    description:
      "WeLockIn runs on macOS, iOS, iPadOS and Windows, with Android coming. Link as many devices as you want — they lock together as one.",
    items: [
      {
        slug: "supported-devices",
        question: "Which devices and operating systems are supported?",
        answer:
          "WeLockIn works today on macOS, iOS for iPhone and iPad, and Windows. Android is coming soon. One session can cover your Mac, iPhone, iPad and PC together — you can link as many devices as you want, and they all lock at the same time.",
        detail: [
          "There is no device limit — link as many devices as you want.",
          "Linux is not supported and is not currently on the roadmap.",
          "Devices can be added at any time — you do not have to decide up front.",
        ],
        description:
          "macOS, iOS, iPadOS and Windows today; Android coming. No device limit — all your devices lock together.",
        keywords:
          "devices platforms mac macos ios iphone ipad windows pc supported",
      },
      {
        slug: "android-support",
        question: "Is it on Android yet?",
        answer:
          "Not yet — Android is on the way. Today WeLockIn runs on macOS, iOS, iPadOS and Windows. If Android is your main device, it is worth waiting, since a blocker that misses your primary phone leaves the door open.",
        detail: [
          "A blocker that does not cover your main phone is not much of a blocker — that is the honest answer.",
          "Windows and macOS coverage is complete today, so a desktop-only setup works now.",
        ],
        description:
          "Not yet — Android is coming. macOS, iOS, iPadOS and Windows work today. If Android is your main phone, it's worth waiting.",
        keywords: "android samsung pixel google phone mobile",
      },
      {
        slug: "sync-across-devices",
        question: "How does syncing work across my devices?",
        answer:
          "You add each device once, and from then on a single block locks all of them at the same time. Start protection on one device and your distractions go quiet everywhere you have synced — there is no need to set it up separately on each, and no way to escape by switching devices.",
        detail: [
          "Syncing is what makes a hard lock meaningful: an unsynced device is an unlocked device.",
          "Add every device you own before your first Nuclear session.",
        ],
        description:
          "Add each device once, then one block locks them all. Start on any device and distractions go quiet everywhere you've synced.",
        keywords: "sync syncing across devices together",
      },
      {
        slug: "always-on-24-7",
        question: 'What does "always on, 24/7" mean?',
        answer:
          "Once protection is active it runs continuously in the background — you do not have to re-arm it each day or remember to switch it on. Your status shows that it is live and how many devices are covered, so there is never any doubt about whether you are actually protected.",
        detail: [
          "Continuous protection is different from a session: it is the floor, not the sprint.",
          "The device count on your status screen is the quickest way to spot an unsynced device.",
        ],
        description:
          "Protection runs continuously in the background — no re-arming each day. Your status shows it's live and how many devices are covered.",
        keywords: "always on 24/7 background continuous",
      },
    ],
  },
  {
    slug: "privacy",
    name: "Privacy",
    headline: "Privacy: what WeLockIn does and does not see",
    intro:
      "A blocker sits between you and the internet, which makes what it logs a fair question. The short answer: filtering happens on your device, and your browsing is not recorded.",
    description:
      "WeLockIn does not log the sites you visit. Filtering happens on your device, so blocking works without sending your browsing to a server.",
    items: [
      {
        slug: "do-you-track-my-browsing",
        question: "Do you track or log the websites I visit?",
        answer:
          "No. WeLockIn never logs which sites you visit. Filtering happens privately, on your device — the point is to protect your focus, not to watch your browsing. A blocker that built a record of everything you looked at would be solving one problem by creating a worse one.",
        detail: [
          "This matters most for the Protection categories, where the browsing being blocked is deeply personal.",
          "An accountability partner approves unlock requests; they do not receive any browsing history.",
        ],
        description:
          "No. WeLockIn never logs the sites you visit — filtering happens privately on your device, not on a server.",
        keywords: "track log history spy watch browsing data",
      },
      {
        slug: "on-device-filtering",
        question: 'What does "on-device filtering" mean for me?',
        answer:
          "It means the decision to block or allow a site is made locally on your device, not by sending your browsing to a server first. Your activity stays with you, and blocking keeps working without handing a log of your habits to anyone — including us.",
        detail: [
          "No round-trip to a server also means blocking does not break when the network is slow.",
          "It is the technical reason the privacy answer above can be a flat no rather than a policy promise.",
        ],
        description:
          "Block-or-allow decisions happen locally on your device, not on a server. Your activity stays with you — including from us.",
        keywords: "on-device local filtering server privacy secure",
      },
    ],
  },
  {
    slug: "troubleshooting",
    name: "Troubleshooting",
    headline: "Troubleshooting WeLockIn",
    intro:
      "Something not blocking, devices out of sync, or a block you need lifted — the common problems and what to do about each.",
    description:
      "Fixes for the common problems: something not being blocked, devices not syncing, unblocking what you need, and how to reach a human.",
    items: [
      {
        slug: "site-not-being-blocked",
        question: "A site or app isn't being blocked. What do I do?",
        answer:
          "First check it is actually included — that the app or site is in an active blocklist or category, and that the block is running on that specific device. Most reports turn out to be a device that was never synced. If it still slips through, note the app or URL and email hello@welock.in so we can add it.",
        detail: [
          "Check the device count on your status screen first — an unsynced device is the usual cause.",
          "Confirm the item is in an active bundle, not one you saved but did not start.",
          "If it is genuinely slipping through, the exact URL is what makes it fixable.",
        ],
        description:
          "Check it's in an active blocklist and running on that device — usually it's an unsynced device. Otherwise email support.",
        keywords: "not blocked working slips through missed broken bug",
      },
      {
        slug: "unblock-something-i-need",
        question: "Something is blocked that I need. How do I unblock just that?",
        answer:
          "If you are on a gentle level like a PIN or cooldown, remove that app or site from your list, or briefly unlock to adjust it. Under a hard or Nuclear lock it stays blocked until the lock ends, by design. Which is why it is best to block only the things genuinely harming your focus.",
        detail: [
          "Under Nuclear Mode there is no exception mechanism — not even for support.",
          "Before arming a hard lock, walk through your week and check nothing essential is on the list.",
          "Blocking a whole category can sweep up something you rely on; individual picks are safer for a first hard lock.",
        ],
        description:
          "On gentle levels, edit your list or unlock briefly. Under a hard or Nuclear lock it stays blocked until the lock ends — by design.",
        keywords: "unblock need accidentally exception remove",
      },
      {
        slug: "devices-not-syncing",
        question: "My devices aren't syncing — a block isn't showing up everywhere.",
        answer:
          "Make sure each device is added to WeLockIn and connected, then give it a moment to sync. If a device is still out of step, restart the app on that device. Still stuck? Email hello@welock.in with the device and OS and a human will pick it up.",
        detail: [
          "Your status screen shows how many devices are covered — compare that to how many you own.",
          "Restarting the app on the lagging device resolves most cases.",
          "Fix syncing before arming Nuclear Mode, not after.",
        ],
        description:
          "Check each device is added and connected, give it a moment, then restart the app on the lagging device.",
        keywords: "sync not syncing showing missing device problem",
      },
      {
        slug: "what-the-blocked-screen-looks-like",
        question:
          "What does the screen look like when I open something that's blocked?",
        answer:
          "A clean, minimal block screen with WeLockIn's padlock — a simple 'this is locked' moment rather than a nagging wall of text. Peep, the mascot, may or may not judge you gently. The screen is deliberately calm: shame is not what makes a block work.",
        detail: [
          "No countdown of how many times you tried, and no lecture.",
          "The same screen appears on every device, so the experience is consistent.",
        ],
        description:
          "A clean, minimal block screen with the WeLockIn padlock — a calm 'this is locked' moment, not a nagging wall of text.",
        keywords: "blocked screen looks like see padlock peep",
      },
      {
        slug: "contact-support",
        question: "How do I contact support or report a bug?",
        answer:
          "Email hello@welock.in with your device, operating system and what happened. A real human student reads it — usually between two lectures. Including the exact app or URL involved is what turns a report into a fix rather than a back-and-forth.",
        detail: [
          "Include your OS version and which device is affected.",
          "For a site that is not blocking, the exact URL is the single most useful thing to send.",
        ],
        description:
          "Email hello@welock.in with your device, OS and what happened. A real human student reads it, usually between two lectures.",
        keywords: "support help contact bug report email human",
      },
    ],
  },
];

/** Every question, flattened, with its category attached. */
export const allFaqEntries = faqCategories.flatMap((category) =>
  category.items.map((entry) => ({ category, entry })),
);

/** Path to a question's own page. */
export function faqEntryPath(categorySlug: string, entrySlug: string): string {
  return `/faq/${categorySlug}/${entrySlug}`;
}

/** Path to a category hub. */
export function faqCategoryPath(categorySlug: string): string {
  return `/faq/${categorySlug}`;
}

export function findFaqCategory(slug: string): FaqCategory | undefined {
  return faqCategories.find((category) => category.slug === slug);
}

export function findFaqEntry(categorySlug: string, entrySlug: string) {
  const category = findFaqCategory(categorySlug);
  const entry = category?.items.find((item) => item.slug === entrySlug);
  return category && entry ? { category, entry } : undefined;
}

export type RelatedFaqLink = { categorySlug: string; entry: FaqEntry };

/**
 * Sibling questions to link to from a question's page.
 *
 * Same-category questions come first — those are the ones a reader actually
 * wants next — then the list is topped up from other categories so every page
 * links outward as well as sideways. The outward picks are offset by the
 * question's own position so that eight pages in a category don't all reach for
 * the same four links, which would leave most of the FAQ with one inbound link
 * and a handful with fifty.
 */
export function relatedFaqEntries(
  categorySlug: string,
  entrySlug: string,
  limit = 5,
): RelatedFaqLink[] {
  const own = findFaqCategory(categorySlug)?.items ?? [];

  const siblings: RelatedFaqLink[] = own
    .filter((item) => item.slug !== entrySlug)
    .map((entry) => ({ categorySlug, entry }));

  const others: RelatedFaqLink[] = allFaqEntries
    .filter(({ category }) => category.slug !== categorySlug)
    .map(({ category, entry }) => ({ categorySlug: category.slug, entry }));

  const index = Math.max(0, own.findIndex((item) => item.slug === entrySlug));
  const offset = others.length ? (index * 3) % others.length : 0;
  const rotated = [...others.slice(offset), ...others.slice(0, offset)];

  // Two from the same category, the rest from elsewhere — enough local context
  // to be useful, enough cross-links to keep the graph connected.
  return [...siblings.slice(0, 2), ...rotated].slice(0, limit);
}
