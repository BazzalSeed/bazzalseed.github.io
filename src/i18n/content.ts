import type { Locale } from './config';

export type Slide = { title: string; desc: string };
export type Role = { title: string; org: string; logo: string; period: string; current?: boolean; summary: string; notes: string[] };
export type Education = { school: string; degree: string; gpa: string; logo: string; period: string; honors?: string; summary: string; notes: string[] };

export type SiteContent = {
  headline: string;
  bioSlides: Slide[];
  roles: Role[];
  education: Education[];
  podcastDesc: string;
  contactTagline: string;
};

const en: SiteContent = {
  headline: 'AI Infra | Engineering Leader | Angel Investor',
  bioSlides: [
    { title: 'Building Critical Systems, Growing Exceptional Teams', desc: "As a Senior Staff Engineer at DoorDash, I lead the architecture and evolution of the company's core storage platforms. From distributed databases to large-scale data infrastructure, my work powers the systems millions of customers rely on every day. Beyond technology, I focus on growing engineers and building high-performing teams." },
    { title: '0 to 100', desc: "I've spent my career across both startups and hyperscale technology companies. At Klaviyo, I helped scale the core data platform by hundreds of times and witnessed the company's journey to IPO. I later led large-scale distributed systems initiatives at Meta and now drive infrastructure strategy at DoorDash." },
    { title: 'Backing the Next Generation of Founders', desc: 'Outside of engineering, I stay deeply connected to the startup ecosystem. As an angel investor, I back ambitious founders at the earliest stages and enjoy helping them navigate technology, product, and company building challenges.' },
    { title: 'First-Principles Thinking', desc: 'My journey into technology started with physics. That training shaped how I approach complex problems: start with first principles, validate assumptions with data, and iterate relentlessly toward better solutions. Whether in engineering, investing, or leadership, I believe clear thinking compounds over time.' },
  ],
  roles: [
    { title: 'Senior Staff Software Engineer', org: 'DoorDash', logo: 'doordash', period: '2026.1 — present', current: true,
      summary: "I lead the team and own the technical direction for DoorDash's Storage org — the data infrastructure the whole company runs on.",
      notes: [
        'Lead and grow a 40-engineer organization — mentoring and developing staff and senior engineers into the next layer of technical leaders.',
        'Set vision and roadmap for DoorDash’s next-generation storage platform, including Event Bus, Chronos, and self-serve datastore automation.',
        'Own the online datastore platform every product team builds on — accountable for reliability, performance, and long-term architecture behind millions of orders a day.',
      ] },
    { title: 'Staff Software Engineer', org: 'DoorDash', logo: 'doordash', period: '2022.7 — 2025.12',
      summary: "Made DoorDash's core storage faster and cheaper as the business scaled globally.",
      notes: [
        'Built and scaled Event Bus, a platform abstraction over Kafka that enables product teams to publish and consume events without operating Kafka directly.',
        'Built Chronos, a storage orchestration platform for running safe, auditable, self-serve operations across Cassandra, Kafka, CockroachDB, Redis, and Postgres.',
        'Drove fleet-wide efficiency and performance gains across the Cassandra deployment (“Cassandra Unleashed”), reducing cost while improving reliability.',
      ] },
    { title: 'Lead Software Engineer', org: 'Meta', logo: 'meta', period: '2020.8 — 2022.10',
      summary: "Tech-led data-integrity systems for Meta's distributed infrastructure.",
      notes: [
        'Built inconsistency-detection services for large distributed systems using novel techniques.',
        'Scaled complex backend services to absorb major traffic spikes.',
        'Mentored engineers and helped them grow.',
      ] },
    { title: 'Senior Software Engineer', org: 'Klaviyo', logo: 'klaviyo', period: '2019.5 — 2020.8',
      summary: "Re-architected Klaviyo's data ingestion and scaled it ~300×.",
      notes: [
        'Built Abacus 2.0 — a full overhaul of the ingestion model, read API, and schema — ~10× faster than its predecessor.',
        'Scaled the pipeline from 500 to 150,000 events/sec (3M DB writes/sec), built to scale horizontally.',
        'Wrote the migration service that moved production data onto the new schema.',
      ] },
    { title: 'Founding Engineer', org: 'Klaviyo', logo: 'klaviyo', period: '2017.4 — 2019.7',
      summary: "Built the streaming foundations Klaviyo's data platform still runs on.",
      notes: [
        'Built Abacus 1.0 on Apache Flink, replacing the legacy ingestion pipeline — 1.5B events on Cyber Monday alone.',
        'Built Klaviyo’s first Kafka microservice, now handling billions of events a day.',
        'Maintained core data stores (MySQL, Cassandra, Redis, Memcache) and refactored the legacy pipeline to clean OOP.',
      ] },
    { title: 'Backend Software Engineer', org: 'SurveyMini (acq. by SMG)', logo: 'surveymini', period: '2016.7 — 2017.3',
      summary: 'Backend engineer on survey infrastructure and AWS data systems; I moved on following SurveyMini’s acquisition by SMG.',
      notes: [
        'Built survey-branching logic that adapts each next question to user input.',
        'Improved AWS scalability and led a migration from Postgres to DynamoDB.',
      ] },
  ],
  education: [
    { school: 'Washington University in St. Louis', degree: 'B.S. Computer Science', gpa: 'GPA 3.97', logo: 'wustl', period: '2014 — 2016',
      honors: 'Summa Cum Laude · Full scholarship',
      summary: 'Computer science with a focus on algorithms and systems — the groundwork for a career in infrastructure.',
      notes: [
        'Ranked 9 / 500',
        'Brown Fellowship recipient',
        'Teaching assistant — Advanced Algorithms, Web Development, iOS Development',
      ] },
    { school: 'Denison University', degree: 'B.A. Physics', gpa: 'Major GPA 3.97', logo: 'denison', period: '2011 — 2014',
      honors: 'Summa Cum Laude',
      summary: 'A physics foundation that still shapes how I reason about hard problems — rigor, measurement, first principles.',
      notes: [
        'Recognized for outstanding contribution to the Physics Department',
        'Co-authored a paper in Physical Review A; researched laser cooling of negative ions at Lawrence Berkeley National Lab',
      ] },
  ],
  podcastDesc: "Conversations with founders on the craft and chaos of building startups. New episodes are paused for now while I'm on a break.",
  contactTagline: "Like what you see here? Drop me a line — I'm more awesome in person.",
};

const zh: SiteContent = {
  headline: 'AI Infra｜技术领导者｜天使投资人',
  bioSlides: [
    { title: '构建关键系统，打造卓越团队', desc: '作为 DoorDash 高级首席工程师，我负责公司核心存储平台的架构演进与技术方向。从分布式数据库到大规模数据平台，我构建和演进的系统每天支撑着数百万用户依赖的核心业务。除了技术本身，我也专注于培养优秀工程师，打造高绩效团队。' },
    { title: '从 0 到 100', desc: '我的职业经历横跨早期创业公司与全球化科技平台。在 Klaviyo，我参与构建并扩展核心数据平台，支撑系统实现数百倍增长，并见证公司走向 IPO。此后，我在 Meta 负责大规模分布式系统建设，如今在 DoorDash 推动核心存储与平台系统的技术战略。' },
    { title: '支持下一代创业者', desc: '工程之外，我也长期活跃在创业生态中。作为天使投资人，我支持早期创业者，尤其关注那些有野心、敢于解决真实问题的 founders，并乐于和他们一起讨论技术、产品与公司建设中的关键挑战。' },
    { title: '第一性原理思维', desc: '我的技术之路始于物理学。这段训练塑造了我解决复杂问题的方式：回到第一性原理，用数据验证假设，通过持续迭代寻找更优解。无论是工程、投资还是领导力，我都相信清晰的思考会在长期产生复利。' },
  ],
  roles: [
    { title: '高级首席工程师（E7）', org: 'DoorDash', logo: 'doordash', period: '2026.1 — 至今', current: true,
      summary: '我带领 DoorDash Storage 团队，并负责整体技术方向——这是支撑公司核心业务运行的数据系统底座。',
      notes: [
        '带领并培养约 40 人的工程团队，指导 Staff 与 Senior 工程师成长为下一批技术领导者。',
        '制定 DoorDash 下一代存储平台的技术愿景与路线图，涵盖 Event Bus、Chronos 与自助化数据库平台。',
        '负责全公司产品团队依赖的在线数据存储平台，为每天数百万订单背后的可靠性、性能与长期架构负责。',
      ] },
    { title: '首席工程师（E6）', org: 'DoorDash', logo: 'doordash', period: '2022.7 — 2025.12',
      summary: '在 DoorDash 全球化扩张过程中，推动核心存储系统变得更快、更稳定、更高效。',
      notes: [
        '构建并规模化 Event Bus：基于 Kafka 的平台抽象，让业务团队无需直接操作 Kafka 即可发布与消费事件。',
        '构建 Chronos：面向 Cassandra、Kafka、CockroachDB、Redis、Postgres 的存储编排平台，用于安全、可审计、自助化地执行运维与生命周期操作。',
        '推动 Cassandra 平台的大规模性能与成本优化（Cassandra Unleashed），在降低成本的同时提升可靠性。',
      ] },
    { title: '主管工程师', org: 'Meta', logo: 'meta', period: '2020.8 — 2022.10',
      summary: '技术主导 Meta 分布式系统中的数据一致性与完整性平台建设。',
      notes: [
        '构建面向大规模分布式系统的数据不一致检测服务，提升系统正确性与可靠性。',
        '扩展复杂后端服务，支撑大规模流量峰值。',
        '指导工程师成长，帮助团队提升技术能力。',
      ] },
    { title: '高级软件工程师', org: 'Klaviyo', logo: 'klaviyo', period: '2019.5 — 2020.8',
      summary: '重构 Klaviyo 核心数据接入系统，并将其扩展约 300 倍。',
      notes: [
        '主导 Abacus 2.0，对数据接入模型、读取 API 与数据库结构进行全面重构，性能提升约 10 倍。',
        '将数据管道从每秒 500 条事件扩展到 15 万条事件，峰值达到每秒 300 万次数据库写入，并支持水平扩展。',
        '构建生产数据迁移服务，将核心业务数据平滑迁移到新架构。',
      ] },
    { title: '早期核心工程师', org: 'Klaviyo', logo: 'klaviyo', period: '2017.4 — 2019.7',
      summary: '构建 Klaviyo 数据平台的流式处理底座，至今支撑核心数据系统运行。',
      notes: [
        '基于 Apache Flink 构建 Abacus 1.0，替代旧数据接入管道，仅 Cyber Monday 当天处理 15 亿条事件。',
        '构建 Klaviyo 第一个 Kafka 微服务，如今每天处理数十亿条事件。',
        '维护核心数据系统，包括 MySQL、Cassandra、Redis、Memcache，并将旧管道重构为更清晰的面向对象架构。',
      ] },
    { title: '后端软件工程师', org: 'SurveyMini（被 SMG 收购）', logo: 'surveymini', period: '2016.7 — 2017.3',
      summary: '负责问卷平台后端、数据系统与 AWS 数据架构建设；在 SurveyMini 被 SMG 收购后离开。',
      notes: [
        '构建动态问卷分支逻辑，根据用户回答实时决定下一题。',
        '提升 AWS 系统可扩展性，并主导从 Postgres 到 DynamoDB 的迁移。',
      ] },
  ],
  education: [
    { school: '圣路易斯华盛顿大学', degree: '计算机科学学士', gpa: 'GPA 3.97', logo: 'wustl', period: '2014 — 2016',
      honors: '最高荣誉毕业 · 全额奖学金',
      summary: '主修计算机科学，专注算法与系统——这也是我深耕 AI Infra 与分布式系统的起点。',
      notes: [
        '年级排名 9 / 500',
        '获 Brown Fellowship 奖学金',
        '担任高级算法、Web 开发与 iOS 开发课程助教',
      ] },
    { school: '丹尼森大学', degree: '物理学学士', gpa: '专业 GPA 3.97', logo: 'denison', period: '2011 — 2014',
      honors: '最高荣誉毕业',
      summary: '物理学训练至今影响着我解决复杂问题的方式——严谨、量化、回到第一性原理。',
      notes: [
        '因对物理系的突出贡献获得认可',
        '在《Physical Review A》合著论文，并在劳伦斯伯克利国家实验室研究负离子激光冷却',
      ] },
  ],
  podcastDesc: '和创业者聊创业路上的方法、混乱与真实挑战。目前节目暂停更新，等我休整完再继续。',
  contactTagline: '喜欢这里的内容？来聊聊吧——本人比网页更有意思。',
};

export const CONTENT: Record<Locale, SiteContent> = { en, zh };
export function getContent(lang: Locale): SiteContent { return CONTENT[lang]; }
