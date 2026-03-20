export const siteMeta = {
  title: "Suraj Pathak",
  shortTitle: "Suraj",
  siteName: "Suraj Pathak",
  description:
    "Senior mobile engineer in Melbourne building reliable iOS products, modernizing legacy systems, and writing about engineering tradeoffs.",
  url: "https://surajpathak.xyz",
  location: "Melbourne, Australia",
  email: "freesuraj@gmail.com",
  role: "Senior Mobile Engineer",
  socialImage: "/og-default.svg"
};

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/freesuraj" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/freesuraj" },
  { label: "X", href: "https://twitter.com/realsurajp" },
  {
    label: "Stack Overflow",
    href: "https://stackoverflow.com/users/1198935/suraj-pathak"
  }
];

export const principles = [
  "Modernize legacy code without stopping product delivery.",
  "Prefer simple systems that are easy to reason about under pressure.",
  "Use writing to clarify engineering tradeoffs, not just document decisions."
];

export const focusAreas = [
  "iOS platform architecture",
  "Swift and SwiftUI",
  "Legacy migrations",
  "CI/CD and release pipelines",
  "Mobile product delivery"
];

export const experience = [
  {
    company: "Butterfly Healthcare",
    role: "Technical consultant (part-time contract)",
    period: "2020 - Present",
    summary:
      "Do it all role from building iOS apps, helping with backend and infrastructure, and supporting the team with AI tools and engineering best practices.",
    highlights: [
            "Building iOS apps for hospital pre- and post-surgery management, focusing on reliability, usability, and patient/staff workflows." ,
            "Oversee the entire technical stack end-to-end, from mobile architecture to backend/API integration and release engineering.",
            "Manage AWS infrastructure and operational concerns (environments, deployments, monitoring/observability basics, security hygiene).",
            "Introduce AI tools to accelerate development and improve team productivity (prototyping, automation, and documentation support).",
            "Support hiring by reviewing candidates and contributing to interview loops; mentor engineers and drive engineering best practices.",
    ]
  },
  {
    company: "ANZ",
    role: "Senior Mobile Engineer",
    period: "2025 - Present",
    summary:
      "Working on ANZ's unified digital banking platform and pushing toward a cleaner, shared mobile foundation.",
    highlights: [
      "Helping consolidate multiple banking experiences into one customer-facing app.",
      "Contributing across core mobile architecture, delivery planning, and team guidance."
    ]
  },
  {
    company: "Catch.com.au",
    role: "iOS Engineer and Lead",
    period: "2020 - 2025",
    summary:
      "Led the modernization of a large ecommerce app while balancing delivery speed, app quality, and team growth.",
    highlights: [
      "Drove migration away from legacy Objective-C toward a more maintainable Swift and SwiftUI codebase.",
      "Built stronger release automation with CircleCI and GitHub Actions."
    ]
  },
  {
    company: "Kogan.com",
    role: "Senior iOS Engineer",
    period: "2017 - 2020",
    summary:
      "Built the iOS app from scratch and iterated quickly with a strong focus on performance and business impact.",
    highlights: [
      "Shipped the first version quickly as a solo iOS engineer.",
      "Improved product quality and release confidence with stronger tooling and process."
    ]
  },
  {
    company: "PropertyGuru",
    role: "iOS Engineer",
    period: "2015 - 2017",
    summary:
      "Worked across consumer and agent mobile products for multiple Southeast Asian markets.",
    highlights: [
      "Built and maintained Swift and Objective-C mobile products across several country variants.",
      "Contributed to modularization, testing, and shared mobile APIs."
    ]
  }
];

export const projects = [
  {
    title: "Omni: AI Notes & Flashcards",
    summary: "Upload PDFs, notes, web content, audio files, or record live audio. Omni transcribes and analyzes everything to generate quizzes, flashcards, summaries, and insights.",
    year: "2025",
    href: "https://omnistudy.site",
    featured: true
  },
  {
    title: "Dockett: Job management for tradies & contractors",
    summary: "A comprehensive job management app for tradies and contractors, streamlining project tracking, invoicing, and client communication.",
    year: "2025",
    href: "https://dockett.xyz",
    featured: true
  },
  {
    title: "Bulldog",
    summary: "A fast JSON parser for iOS and macOS built to keep app-side parsing simple and predictable.",
    year: "2016",
    href: "https://freesuraj.github.io/Bulldog/",
    featured: true
  },
  {
    title: "SwiftCrypto",
    summary: "MD5 and SHA256 helpers in Swift for projects that needed lightweight cryptographic utilities.",
    year: "2016",
    href: "https://github.com/freesuraj/SwiftCrypto",
    featured: true
  },
  {
    title: "Playground Generator",
    summary: "A Node-based CLI to generate Swift playgrounds quickly from the terminal.",
    year: "2016",
    href: "https://www.npmjs.com/package/swiftplayground",
    featured: true
  },
  {
    title: "Plist Viewer for iOS",
    summary: "A visual plist editor aimed at speeding up prototyping and debugging on iOS.",
    year: "2016",
    href: "https://freesuraj.github.io/PGDebugView/",
    featured: false
  },
  {
    title: "SPTinderView",
    summary: "A swipe-based Tinder-style UI component for iOS.",
    year: "2016",
    href: "https://freesuraj.github.io/SPTinderView/",
    featured: false
  },
  {
    title: "NBA CLI",
    summary: "A terminal-first way to check NBA box scores without leaving the shell.",
    year: "2016",
    href: "https://freesuraj.github.io/NBA/",
    featured: false
  }
];

export const talks = [
  {
    title: "Scripting in Swift",
    date: "2016-08-22",
    summary:
      "A practical talk on using Swift beyond app development and treating it as a capable scripting language.",
    embedUrl: "https://www.youtube.com/embed/XjpB0BjUA4A"
  },
  {
    title: "Write your own Web Framework in Swift",
    date: "2016-07-28",
    summary:
      "An exploration of how web frameworks are put together from low-level building blocks.",
    embedUrl: "https://www.youtube.com/embed/xbD7rm5opqw"
  }
];

export const recommendedTalks = [
  {
    title: "Exploring Java's Hidden Costs",
    conference: "360AnDev 2016",
    author: "Jake Wharton",
    href: "https://realm.io/news/360andev-jake-wharton-java-hidden-costs-android/"
  },
  {
    title: "Sharper Better Faster Dagger",
    conference: "DroidCon SF 2016",
    author: "John Rodriguez",
    href: "https://speakerdeck.com/johnrdrz/sharper-better-faster-dagger"
  }
];

export const podcasts = [
  {
    title: "Static vs Dynamic Framework",
    date: "2025-02-20",
    file: "/assets/audio/staticVsDynamic.wav"
  },
  {
    title: "Compiler, LLVM and Clang",
    date: "2025-02-20",
    file: "/assets/audio/compiler.wav"
  },
  {
    title: "ABI Stability",
    date: "2025-02-20",
    file: "/assets/audio/abiStability.wav"
  },
  {
    title: "iOS Concurrency, Thread Safety, GCD",
    date: "2025-02-20",
    file: "/assets/audio/concurrency.wav"
  },
  {
    title: "iOS Memory Deep Dive",
    date: "2025-02-21",
    file: "/assets/audio/memory_deepdive.wav"
  }
];
