// Single source of truth for portfolio content — edit here, the UI updates everywhere.

export const profile = {
  name: 'Neetpal Singh',
  role: 'AI Engineer',
  location: 'Gurugram, India',
  company: 'Ascent Business Technology',
  headline: ['I build AI agents, platforms', '& MCP servers for the enterprise.'],
  tagline:
    'AI Engineer with 2+ years designing production Generative AI: a multi-tenant agent platform built from scratch, a 350+ tool MCP server, and multi-agent automation across GRC & BCM products.',
  summary: [
    'I am an AI Engineer at Ascent Business Technology, where I design and own AI systems end-to-end, from architecture and backend services to LLM orchestration and deployment.',
    'I designed and built **Agent Studio** from scratch: a multi-tenant, no-code SaaS platform for building and deploying chatbots, Agent APIs and Extractor Agents, now production-ready. I also built a **custom MCP server** that exposes 350+ authenticated REST endpoints as tools, so any AI client can operate our GRC and BCM systems.',
    'Across the GRC product I have shipped **14+ AI use cases**, including multi-agent workflows for policy creation, risk & control generation, regulatory gap analysis, vendor evaluation and automated RBI/SEBI monitoring. They turn days of manual compliance work into minutes.',
  ],
  email: 'neetpalsingh750@gmail.com',
  // Optional: drop a photo into /public and set e.g. photo: 'profile.jpg'
  photo: null as string | null,
  resume: 'Neetpal_Singh_Resume.pdf',
  socials: {
    github: 'https://github.com/neetpalsingh',
    linkedin: 'https://www.linkedin.com/in/neetpal-singh-690330218',
    certifications: 'https://www.linkedin.com/in/neetpal-singh-690330218/details/certifications/',
    email: 'mailto:neetpalsingh750@gmail.com',
  },
}

export const heroStats = [
  { value: 350, suffix: '+', label: 'REST endpoints as MCP tools' },
  { value: 300, suffix: '+', label: 'Agent Studio platform APIs' },
  { value: 14, suffix: '+', label: 'GRC AI use cases shipped' },
  { value: 2, suffix: '+', label: 'Years in production AI' },
]

export const focusAreas = [
  { title: 'Agent Platforms', text: 'Multi-tenant SaaS for building and deploying agents, designed from the architecture up.' },
  { title: 'MCP & Tooling', text: 'Secure tool layers that let any LLM client act on enterprise systems.' },
  { title: 'Multi-Agent Workflows', text: 'SME, reviewer, research and scoring agents orchestrated with LangGraph.' },
  { title: 'Retrieval & Knowledge', text: 'Hybrid RAG over vector, graph and lexical indexes with RBAC.' },
]

/* ------------------------------ Agent Studio ------------------------------ */

export const agentStudio = {
  name: 'Agent Studio',
  alias: 'Plug Chat',
  summary:
    'A multi-tenant, no-code AI agent platform I designed and built from scratch at Ascent Business Technology, now production-ready ahead of launch. Organizations create and deploy three kinds of agents without writing code: customer-facing chatbots, backend Agent APIs for structured data processing, and Extractor Agents that pull fields out of PDFs and documents. I own the backend architecture end-to-end: LLM orchestration, the async worker system, multi-tenant isolation and admin analytics.',
  metrics: [
    { value: 3, suffix: '', label: 'Agent types' },
    { value: 5, suffix: '+', label: 'LLM providers' },
    { value: 100, suffix: '+', label: 'Page documents handled' },
    { value: 300, suffix: '+', label: 'Platform APIs' },
  ],
  features: [
    { icon: 'bot', title: 'Three agent types', text: 'Chatbots, Agent APIs and Extractor Agents, all configured from one no-code builder.' },
    { icon: 'layers', title: 'Provider-agnostic LLMs', text: 'Agents run interchangeably on OpenAI, Azure OpenAI, Anthropic, Gemini and Groq, with provider quirks hidden.' },
    { icon: 'shield', title: 'Strict tenant isolation', text: 'Every MongoDB query, vector DB collection and Redis key is scoped by organization ID.' },
    { icon: 'workflow', title: 'Priority queue workers', text: 'RabbitMQ workers with priority lanes keep chat under 2s while ingestion and crawls run in the background.' },
    { icon: 'file', title: '100+ page documents', text: 'Token-budget-aware semantic chunking and structured JSON merging for inputs far beyond context limits.' },
    { icon: 'globe', title: 'Knowledge from anywhere', text: 'Upload documents or crawl websites into a vector DB knowledge base for grounded answers.' },
    { icon: 'lock', title: 'Secure auth & SSO', text: 'HttpOnly cookies, SameSite CSRF protection, Google/Microsoft OAuth and an iframe-safe embed widget.' },
    { icon: 'chart', title: 'Admin analytics', text: 'Usage, billing and queue health dashboards backed by Redis-cached aggregations.' },
  ],
  impact: [
    { value: '15s → 50ms', label: 'Admin dashboard load' },
    { value: '45s → 200ms', label: 'Document upload response' },
    { value: '+40%', label: 'Extraction accuracy (semantic chunking)' },
    { value: '−60%', label: 'MongoDB CPU usage' },
    { value: '<2s', label: 'Chat latency under background load' },
    { value: '0', label: 'Lost jobs on worker crash (persistent queues)' },
  ],
  decisions: [
    {
      title: 'RabbitMQ over Celery',
      why: 'True priority queues, full control of worker lifecycle, message persistence so crashes never lose jobs, and direct visibility into queue depth.',
      tradeoff: 'Rebuilt retries and monitoring by hand in place of Celery and Flower.',
      outcome: 'Three worker types with chat kept under 2s while background jobs take 30s+. A 5MB message cap and pre-splitting fixed unbounded memory on huge files.',
    },
    {
      title: 'HttpOnly cookies over JWT in localStorage',
      why: 'Tokens become unreadable to JavaScript, SameSite adds CSRF protection, and it works cleanly with the embedded widget and OAuth.',
      tradeoff: 'Native-mobile integration got harder, and Redis now tracks active sessions.',
      outcome: 'Closed the gap behind two beta XSS incidents, and SSO integration became much simpler.',
    },
    {
      title: 'Scaling MongoDB aggregations',
      why: 'Under large-scale load, dashboard aggregations scanned whole collections and pushed load time past 15s.',
      tradeoff: 'Accepted a 5-minute stats lag in exchange for caching.',
      outcome: 'Redis cache + compound indexes + distributed locks: 15s → 50ms and −60% MongoDB CPU.',
    },
    {
      title: 'Async document ingestion',
      why: 'Inline extraction → chunking → embedding took 30–45s, caused duplicate uploads and timeouts, and stalled the worker pool.',
      tradeoff: 'Added WebSocket progress events and a job-state model.',
      outcome: 'Upload response dropped from ~45s to ~200ms and duplicate uploads stopped. The rule: nothing over 2s stays in the request cycle.',
    },
  ],
  stack: ['FastAPI', 'MongoDB', 'Redis', 'RabbitMQ', 'Vector DB', 'LangChain', 'WebSockets', 'OAuth / SSO', 'React', 'Docker'],
}

/* ---------------------------- Custom MCP server --------------------------- */

export const mcpServer = {
  name: 'Enterprise GRC & BCM MCP Server',
  summary:
    'A custom Model Context Protocol server that turns the entire GRC & BCM product, 350+ REST API endpoints, into authenticated tools. Any MCP-compatible AI client (Claude, IDE agents, internal copilots) can plug it in and operate policies, risks, compliance, business continuity and audits in natural language.',
  points: [
    { title: '350+ endpoints → tools', text: 'Every module exposed as typed, documented MCP tools, plus schema search and a universal API dispatcher for full coverage.' },
    { title: 'Full authentication', text: 'Login, browser-based SSO, session status and logout tools. Every tool call runs under the signed-in user’s identity and permissions.' },
    { title: 'Plug in anywhere', text: 'Remote MCP deployment, so the same tools work in Claude, IDEs, chat assistants and internal agents with no glue code.' },
    { title: 'Workflow automation', text: 'Multi-step approvals (draft → review → endorse → approve) become one conversation, cutting time and operating cost.' },
  ],
  modules: ['Policy', 'Risk / ERM', 'Compliance', 'BIA · TRA', 'BCS · BCP', 'Exercises', 'Issues & Actions', 'Audit & Users'],
  calls: [
    { tool: 'login_with_browser', result: 'authenticated via SSO ✓' },
    { tool: 'list_policies', result: '42 policies · 6 due for renewal' },
    { tool: 'create_bia', result: 'BIA draft created for "Payments Ops"' },
    { tool: 'get_tra_by_bia', result: '9 threats · 3 high residual risk' },
    { tool: 'create_bcp_from_bcs', result: 'BCP v1.0 generated from strategy' },
    { tool: 'submit_bcp_for_review', result: 'routed to dept head ✓' },
  ],
}

/* ---------------------------- GRC AI use cases ---------------------------- */

export type UseCaseStatus = 'Live' | 'API ready' | 'In development'

export const useCases: {
  title: string
  module: 'Policy' | 'Compliance' | 'Risk' | 'BCM'
  description: string
  agents: string[]
  status: UseCaseStatus
}[] = [
  { title: 'Policy Creation & Optimisation', module: 'Policy', status: 'Live', description: 'Generates a complete, template-rendered HTML policy from an initial brief, then rewrites any selected section on instruction.', agents: ['Policy Agent'] },
  { title: 'Policy Checker: Compare & Merge', module: 'Policy', status: 'API ready', description: 'Multi-level similarity compares two policies into conflicts, duplicates and unique sections, then merges them using the user’s resolutions.', agents: ['Parser', 'Comparator', 'Merger'] },
  { title: 'Tab-to-Complete Suggestions', module: 'Policy', status: 'Live', description: 'Real-time next-word suggestions inside the policy and form editors.', agents: ['Completion Model'] },
  { title: 'Compliance Auto-Monitoring', module: 'Compliance', status: 'Live', description: 'Watches RBI & SEBI notifications, checks applicability to the org, generates requirement/control tasks and a summary, and notifies owners.', agents: ['Applicability Agent', 'Action Agent'] },
  { title: 'Requirement & Control Extraction', module: 'Compliance', status: 'Live', description: 'Chunks regulatory PDFs/Word files, extracts requirements, finds missing ones and maps controls, with built-in data validation.', agents: ['Extraction', 'Validator', 'Control Mapper'] },
  { title: 'Regulatory Gap Analysis', module: 'Compliance', status: 'Live', description: 'Diffs a new document version against prior requirements, with hash-based dedupe and parallel per-chunk agents, plus an AI summary.', agents: ['Change Detector', 'Control Agent'] },
  { title: 'Compliance Universe Libraries', module: 'Compliance', status: 'Live', description: 'From a company profile, discovers applicable frameworks, classifies them as mandatory or recommended, and maps the required policies.', agents: ['Discovery', 'Classifier', 'Policy Mapper'] },
  { title: 'Requirement & Control Suggestions', module: 'Compliance', status: 'API ready', description: 'SME agents propose new requirements and controls while reviewer agents filter out duplicates against existing data.', agents: ['SME Agent', 'Reviewer Agent'] },
  { title: 'Compliance Program Audit', module: 'Compliance', status: 'API ready', description: 'Reconciles client Excel files with system data: LLM header mapping, fuzzy and semantic matching, then merge recommendations.', agents: ['Header Mapper', 'Matcher'] },
  { title: 'Library Deduplication', module: 'Compliance', status: 'Live', description: 'Embedding similarity search flags near-duplicate processes, risks and controls as they are created.', agents: ['Embeddings', 'Similarity'] },
  { title: 'Risk & Control Generation', module: 'Risk', status: 'Live', description: 'From a business objective, identifies risks, assesses likelihood and impact, and recommends 1–3 industry-aligned controls each. Days of work become minutes.', agents: ['Risk Analyst'] },
  { title: 'Control Generation for a Risk', module: 'Risk', status: 'In development', description: 'Assesses a risk’s severity and generates a right-sized set of practical, diverse controls.', agents: ['Control Agent'] },
  { title: 'Vendor Flag Evaluation', module: 'BCM', status: 'Live', description: 'Researches vendors on the web, analyses financial and operational stability, and assigns a green/orange/red flag with a verdict.', agents: ['Research', 'Analysis', 'Scoring'] },
  { title: 'AVV Discovery', module: 'BCM', status: 'API ready', description: 'Discovers the assets, vendors and vital records behind a business process using hybrid LLM and web search.', agents: ['Asset', 'Vendor Mapper', 'Vital Records'] },
]

/* ------------------------------- Background ------------------------------- */

export const skillGroups = [
  { title: 'Generative & Agentic AI', items: ['Agentic AI', 'Multi-Agent Systems', 'RAG / GraphRAG', 'LangChain', 'LangGraph', 'LangFlow', 'MCP', 'N8N'] },
  { title: 'LLMs & Platforms', items: ['OpenAI', 'Anthropic Claude', 'Gemini', 'Azure AI Foundry', 'AWS Bedrock', 'Groq', 'Ollama', 'HuggingFace'] },
  { title: 'ML & Fine-Tuning', items: ['PyTorch', 'TensorFlow', 'Transformers', 'Scikit-learn', 'Unsloth', 'LoRA / QLoRA'] },
  { title: 'Backend & Infra', items: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'RabbitMQ', 'Redis', 'WebSockets', 'Docker', 'OAuth / JWT'] },
  { title: 'Data & Vector Stores', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQL Server', 'ChromaDB', 'Qdrant', 'Milvus', 'PGVector', 'Neo4j', 'Elasticsearch'] },
  { title: 'Data Engineering & BI', items: ['Airflow', 'Airbyte', 'ELT pipelines', 'Tableau', 'Power BI'] },
]

export const marquee = [
  'Python', 'FastAPI', 'LangGraph', 'LangChain', 'MCP', 'OpenAI', 'Claude', 'Gemini', 'Azure OpenAI', 'Groq',
  'RabbitMQ', 'Redis', 'MongoDB', 'ChromaDB', 'Qdrant', 'Milvus', 'Neo4j', 'Elasticsearch', 'PyTorch', 'Docker', 'React',
]

export const experience = [
  {
    company: 'Ascent Business Technology',
    location: 'Gurugram',
    role: 'AI Engineer',
    period: 'Oct 2024 — Present',
    highlights: [
      'Designed and built **Agent Studio** from scratch: a production-ready, multi-tenant no-code agent platform (300+ APIs), owning architecture, async workers, LLM routing and tenant isolation.',
      'Built a **custom MCP server** exposing 350+ GRC & BCM REST endpoints as authenticated tools, so AI clients can run enterprise workflows end-to-end.',
      'Shipped **14+ multi-agent AI use cases** across the Policy, Compliance, Risk and BCM modules, cutting manual effort from days to minutes.',
      'Built **Compliance Auto-Monitoring** for RBI & SEBI: applicability checks, auto-generated action tasks and stakeholder notifications.',
      'Designed a self-hosted **Hybrid RAG** assistant over Vector DB, Graph DB and Elasticsearch with department-level **RBAC**.',
      'Developed an **NLP Query & Report Generator** plugin and a hybrid **ELTL pipeline** for PDFs and unstructured data.',
      'Fine-tuned **LLaMA 7B** and **Mistral** with LoRA / QLoRA for compliance-domain adaptation at lower compute cost.',
    ],
    tags: ['Agent Platforms', 'MCP', 'LangGraph', 'FastAPI', 'Hybrid RAG', 'LoRA'],
  },
]

export type Visual = 'rag' | 'sql' | 'vector' | 'platform' | 'finetune' | 'vision'

export const projects: { title: string; kicker: string; description: string; tags: string[]; visual: Visual; link?: string }[] = [
  { title: 'Hybrid RAG Enterprise Assistant', kicker: 'Retrieval', visual: 'rag', description: 'Fuses vector, graph and BM25 retrieval with reranking and role-based access at query time.', tags: ['Qdrant', 'Neo4j', 'Elasticsearch'] },
  { title: 'NLP Query & Report Generator', kicker: 'Text-to-SQL', visual: 'sql', description: 'Plug-in service that turns plain-English questions into SQL, charts and compliance reports on any product DB.', tags: ['LLMs', 'PostgreSQL', 'Reporting'] },
  { title: 'ChromaDB Admin', kicker: 'Open source', visual: 'vector', description: 'Admin dashboard for ChromaDB vector databases, published on Docker Hub, PyPI and npm.', tags: ['FastAPI', 'React', 'Docker'], link: 'https://github.com/neetpalsingh/ChromaDB-Admin-managment' },
  { title: 'PlugAI Business', kicker: 'Full-stack product', visual: 'platform', description: 'AI service platform with public and admin portals, an AI assistant, calendar-based call scheduling and a CMS.', tags: ['React', 'FastAPI', 'AI'] },
  { title: 'Domain LLM Fine-Tuning', kicker: 'LoRA · QLoRA', visual: 'finetune', description: 'Parameter-efficient fine-tuning of LLaMA 7B and Mistral for compliance language, using Unsloth.', tags: ['Unsloth', 'PEFT', 'PyTorch'] },
  { title: "Alzheimer's Detection", kicker: 'Computer vision', visual: 'vision', description: 'Transfer-learning CNN that classifies dementia stages from brain MRI scans.', tags: ['TensorFlow', 'CNN'], link: 'https://github.com/neetpalsingh/Alzheimer-Research' },
]

export const repos = [
  { name: 'parcelpilot-assistant', desc: 'AI support agent using hybrid GraphRAG and a multi-provider LLM gateway.', lang: 'Python', topic: 'Agents' },
  { name: 'Vyntra-Code', desc: 'Autonomous AI coding partner.', lang: 'TypeScript', topic: 'Agents' },
  { name: 'enterprise-assistant', desc: 'AI assistant that answers questions and performs business actions via API.', lang: 'Python', topic: 'Agents' },
  { name: 'UltraShip_TMS-Doc_Intelligence', desc: 'Query logistics documents in natural language with grounded answers.', lang: 'Python', topic: 'RAG' },
  { name: 'NavGurukul', desc: 'Turns unstructured learning content into searchable knowledge.', lang: 'Python', topic: 'RAG' },
  { name: 'rag-chatbot-gemini-chromadb-flask', desc: 'RAG chatbot with Gemini, ChromaDB and Flask, no LangChain.', lang: 'Python', topic: 'RAG' },
  { name: 'ChromaDB-Admin-managment', desc: 'Web-based admin dashboard for ChromaDB vector databases.', lang: 'TypeScript', topic: 'Tools' },
  { name: 'NLP-Article-Extract-data-', desc: 'Extracts article text from URLs and analyzes it with NLP.', lang: 'Python', topic: 'ML' },
  { name: 'Alzheimer-Research', desc: "Alzheimer's disease detection research using deep learning.", lang: 'Python', topic: 'ML' },
]

export const education = [
  { degree: 'Master of Computer Applications', school: 'Galgotias University, Greater Noida', period: '2023 — 2025', score: 'CGPA 8.68' },
  { degree: 'Bachelor of Computer Applications', school: 'Dr. Bhim Rao Ambedkar University, Agra', period: '2020 — 2023', score: 'CGPA 7.39' },
]

export const certifications = [
  { title: 'Applied Data Science Lab', issuer: 'WorldQuant University', note: '6-month program in AI, ML and deep learning' },
  { title: 'Graph DB Certified Professional', issuer: 'Neo4j', note: 'Graph modeling, Cypher and knowledge graphs' },
  { title: 'Google AI-ML Virtual Internship', issuer: 'Google × AICTE', note: 'Image processing, NLTK, TensorFlow Lite' },
  { title: 'Machine Learning', issuer: 'Microsoft', note: 'Regression, classification, clustering, deep learning' },
]
