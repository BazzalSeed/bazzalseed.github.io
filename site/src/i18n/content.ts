import type { Locale } from './config';

export type Slide = { title: string; desc: string };
export type Role = { title: string; org: string; logo: string; period: string; current?: boolean; summary: string; notes: string[] };
export type Education = { title: string; org: string; period: string; honors: string[]; note: string };

export type SiteContent = {
  headline: string;
  bioSlides: Slide[];
  roles: Role[];
  education: Education[];
  podcastDesc: string;
  contactTagline: string;
};

const en: SiteContent = {
  headline: 'AI × Infrastructure | Engineering Leader | Angel Investor',
  bioSlides: [
    { title: 'Building Critical Infrastructure', desc: "As a Senior Staff Engineer at DoorDash, I lead the architecture and evolution of the company's core storage platforms. From distributed databases to large-scale data infrastructure, my work powers the systems millions of customers rely on every day. Beyond technology, I focus on growing engineers and building high-performing teams." },
    { title: 'From Startup to Global Scale', desc: "I've spent my career across both startups and hyperscale technology companies. At Klaviyo, I helped scale the core data platform by hundreds of times and witnessed the company's journey to IPO. I later led large-scale distributed systems initiatives at Meta and now drive infrastructure strategy at DoorDash." },
    { title: 'Backing the Next Generation of Founders', desc: 'Outside of engineering, I stay deeply connected to the startup ecosystem. As an angel investor, I back ambitious founders at the earliest stages and enjoy helping them navigate technology, product, and company building challenges.' },
    { title: 'First-Principles Thinking', desc: 'My journey into technology started with physics. That training shaped how I approach complex problems: start with first principles, validate assumptions with data, and iterate relentlessly toward better solutions. Whether in engineering, investing, or leadership, I believe clear thinking compounds over time.' },
  ],
  roles: [
    { title: 'Senior Staff Software Engineer', org: 'DoorDash', logo: 'doordash', period: 'Jan 2026 — present', current: true,
      summary: "I lead the team and own the technical direction for DoorDash's Storage org — the data infrastructure the whole company runs on.",
      notes: [
        'Lead and grow a 40-engineer organization — mentoring and developing staff and senior engineers into the next layer of technical leaders.',
        'Set vision and roadmap for the core initiatives redefining the storage layer, partnering across product and infra teams.',
        'Own the online datastore platform every product team builds on — accountable for reliability, performance, and long-term architecture behind millions of orders a day.',
      ] },
    { title: 'Staff Software Engineer', org: 'DoorDash', logo: 'doordash', period: 'Jul 2022 — Dec 2025',
      summary: "Made DoorDash's core storage faster and cheaper as the business scaled globally.",
      notes: [
        'Drove fleet-wide efficiency and performance gains across the Cassandra deployment (“Cassandra Unleashed”).',
        'Mentored engineers and raised the technical bar across the team.',
        'Scaled core storage infrastructure to keep pace with global growth.',
      ] },
    { title: 'Lead Software Engineer', org: 'Meta', logo: 'meta', period: 'Aug 2020 — Oct 2022',
      summary: "Tech-led data-integrity systems for Meta's distributed infrastructure.",
      notes: [
        'Built inconsistency-detection services for large distributed systems using novel techniques.',
        'Scaled complex backend services to absorb major traffic spikes.',
        'Mentored engineers and helped them grow.',
      ] },
    { title: 'Senior Software Engineer', org: 'Klaviyo', logo: 'klaviyo', period: 'May 2019 — Aug 2020',
      summary: "Re-architected Klaviyo's data ingestion and scaled it ~300×.",
      notes: [
        'Built Abacus 2.0 — a full overhaul of the ingestion model, read API, and schema — ~10× faster than its predecessor.',
        'Scaled the pipeline from 500 to 150,000 events/sec (3M DB writes/sec), built to scale horizontally.',
        'Wrote the migration service that moved production data onto the new schema.',
      ] },
    { title: 'Software Engineer · early engineer', org: 'Klaviyo', logo: 'klaviyo', period: 'Apr 2017 — Jul 2019',
      summary: "Built the streaming foundations Klaviyo's data platform still runs on.",
      notes: [
        'Built Abacus 1.0 on Apache Flink, replacing the legacy ingestion pipeline — 1.5B events on Cyber Monday alone.',
        'Built Klaviyo’s first Kafka microservice, now handling billions of events a day.',
        'Maintained core data stores (MySQL, Cassandra, Redis, Memcache) and refactored the legacy pipeline to clean OOP.',
      ] },
    { title: 'Backend Software Engineer', org: 'SurveyMini (acq. SMG)', logo: 'surveymini', period: 'Jul 2016 — Mar 2017',
      summary: 'Backend engineer across survey infrastructure and AWS data systems.',
      notes: [
        'Built survey-branching logic that adapts each next question to user input.',
        'Improved AWS scalability and led a migration from Postgres to DynamoDB.',
      ] },
  ],
  education: [
    { title: 'B.S. Computer Science', org: 'Washington University in St. Louis', period: '2014 — 2016',
      honors: ['GPA 3.97', 'Summa Cum Laude', 'Tau Beta Pi', 'Brown Fellowship'],
      note: 'Teaching assistant for Advanced Algorithms, Web Development, and iOS Development.' },
    { title: 'B.S. Physics', org: 'Denison University', period: '2011 — 2014',
      honors: ['GPA 3.90', 'Summa Cum Laude', 'Sigma Pi Sigma', 'Sigma Xi'],
      note: 'Co-authored a paper in Physical Review A and researched laser cooling of negative ions at Lawrence Berkeley National Lab.' },
  ],
  podcastDesc: "Conversations with founders on the craft and chaos of building startups. New episodes are paused for now while I'm on a break.",
  contactTagline: "Like what you see here? Drop me a line — I'm more awesome in person.",
};

const zh: SiteContent = {
  headline: 'AI × 基础设施 | 技术领导者 | 天使投资人',
  bioSlides: [
    { title: '打造关键基础设施', desc: '作为 DoorDash 高级首席工程师，我负责公司核心存储平台的架构演进与技术方向。从分布式数据库到大规模数据基础设施，我所构建的系统每天支撑着数百万用户的关键业务。除了技术建设，我同样专注于培养优秀工程师并打造高绩效团队。' },
    { title: '从创业公司到全球规模', desc: '我的职业生涯横跨创业公司与全球化科技企业。在 Klaviyo，我参与构建并扩展核心数据平台，支撑业务实现数百倍增长，并见证公司成功上市。随后在 Meta 负责大规模分布式系统建设，如今在 DoorDash 推动核心基础设施的发展与演进。' },
    { title: '支持下一代创业者', desc: '除了工程工作之外，我也长期活跃于创业生态。作为天使投资人，我投资并支持早期创业者，帮助他们在技术、产品和组织建设等方面不断成长。' },
    { title: '第一性原理思维', desc: '我的职业起点是物理学。这样的训练塑造了我的思维方式：从第一性原理出发，用数据验证假设，通过持续迭代寻找更优解。无论是在工程、投资还是领导力领域，我都相信清晰而严谨的思考能够在长期创造复利价值。' },
  ],
  roles: [
    { title: '高级资深软件工程师', org: 'DoorDash', logo: 'doordash', period: '2026年1月 — 至今', current: true,
      summary: '我带领团队并负责 DoorDash 存储部门的技术方向——支撑整个公司运转的数据基础设施。',
      notes: [
        '带领并培养一支约 40 人的工程团队——指导资深与高级工程师成长为下一批技术领导者。',
        '为重塑存储层的核心项目制定愿景与路线图，与产品和基础设施团队紧密协作。',
        '负责所有产品团队赖以构建的在线数据存储平台——为每天数百万订单背后的可靠性、性能与长期架构负责。',
      ] },
    { title: '资深软件工程师', org: 'DoorDash', logo: 'doordash', period: '2022年7月 — 2025年12月',
      summary: '在公司全球扩张的同时，让 DoorDash 的核心存储更快、更省。',
      notes: [
        '在整个 Cassandra 集群上推动效率与性能提升（《Cassandra Unleashed》）。',
        '指导工程师，提升团队的技术标准。',
        '扩展核心存储基础设施，跟上全球增长的步伐。',
      ] },
    { title: '主任软件工程师', org: 'Meta', logo: 'meta', period: '2020年8月 — 2022年10月',
      summary: '为 Meta 的分布式基础设施技术主导数据一致性系统。',
      notes: [
        '用新颖的技术为大型分布式系统构建数据不一致检测服务。',
        '扩展复杂的后端服务以承接巨大的流量峰值。',
        '指导工程师并帮助他们成长。',
      ] },
    { title: '高级软件工程师', org: 'Klaviyo', logo: 'klaviyo', period: '2019年5月 — 2020年8月',
      summary: '重构 Klaviyo 的数据接入系统，并将其扩展约 300 倍。',
      notes: [
        '打造 Abacus 2.0——对接入模型、读取 API 与数据库结构的彻底重写，速度约为前代的 10 倍。',
        '将管道从每秒 500 事件扩展到 15 万事件（每秒 300 万次数据库写入），并支持横向扩展。',
        '编写迁移服务，将生产数据迁移到新的数据结构。',
      ] },
    { title: '软件工程师 · 早期工程师', org: 'Klaviyo', logo: 'klaviyo', period: '2017年4月 — 2019年7月',
      summary: '打下了 Klaviyo 数据平台至今仍在运行的流式基础。',
      notes: [
        '基于 Apache Flink 打造 Abacus 1.0，取代旧的接入管道——仅网络星期一当天就处理 15 亿事件。',
        '构建 Klaviyo 的第一个 Kafka 微服务，如今每天处理数十亿事件。',
        '维护核心数据存储（MySQL、Cassandra、Redis、Memcache），并将旧管道重构为清晰的面向对象设计。',
      ] },
    { title: '后端软件工程师', org: 'SurveyMini (被 SMG 收购)', logo: 'surveymini', period: '2016年7月 — 2017年3月',
      summary: '负责问卷基础设施与 AWS 数据系统的后端工程师。',
      notes: [
        '构建问卷分支逻辑，根据用户输入动态决定下一题。',
        '提升 AWS 可扩展性，并主导从 Postgres 到 DynamoDB 的迁移。',
      ] },
  ],
  education: [
    { title: '计算机科学学士', org: '圣路易斯华盛顿大学', period: '2014 — 2016',
      honors: ['GPA 3.97', '最优等毕业', 'Tau Beta Pi', 'Brown Fellowship'],
      note: '担任《高级算法》《Web 开发》《iOS 开发》课程的助教。' },
    { title: '物理学学士', org: 'Denison University', period: '2011 — 2014',
      honors: ['GPA 3.90', '最优等毕业', 'Sigma Pi Sigma', 'Sigma Xi'],
      note: '在《Physical Review A》合著论文，并在劳伦斯伯克利国家实验室研究负离子的激光冷却。' },
  ],
  podcastDesc: '和创业者畅聊创业的手艺与混乱。目前我在休整，暂停更新新一期。',
  contactTagline: '喜欢你看到的内容？给我留个言吧——我本人更有意思。',
};

export const CONTENT: Record<Locale, SiteContent> = { en, zh };
export function getContent(lang: Locale): SiteContent { return CONTENT[lang]; }
