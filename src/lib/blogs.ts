export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  product: string;
  readTime: string;
  publishDate: string;
  author: string;
  content: string;
  ctaText: string;
  ctaHref: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'autonomous-rfp-engine-b2b-proposals',
    title: 'How Autonomous AI RFP Engines Cut B2B Proposal Completion Time by 90%',
    excerpt: 'Discover how sales and bid managers use grounded vector RAG search to shred 100-page tender questionnaires and export ready-to-submit Microsoft Word (.docx) proposals in minutes.',
    category: 'B2B Sales & RFPs',
    product: 'Autonomous RFP & Tender Engine',
    readTime: '6 min read',
    publishDate: 'August 4, 2026',
    author: 'Rahul Gautam, CEO',
    content: `
      <h2>The Crisis of Manual RFP Responses in B2B Enterprise Sales</h2>
      <p>B2B enterprise deals live and die by Request for Proposals (RFPs) and Request for Information (RFIs). Sales engineers and proposal teams routinely spend 40+ hours per tender manually copying answers from scattered company brochures, past proposals, and internal wikis.</p>

      <h3>How Grounded AI Vector Search Solves the Hallucination Risk</h3>
      <p>Generic LLMs often hallucinate facts, which can disqualify enterprise bids. ContextSkeleton's Autonomous RFP Engine uses high-density vector embeddings stored in isolated Turso databases to match tender questions directly against your verified company knowledge base.</p>

      <h3>Key Features of the RFP Workspace:</h3>
      <ul>
        <li><strong>Automatic PDF & DOCX Questionnaire Shredding:</strong> Ingest complex tender tables instantly.</li>
        <li><strong>Exact Source Citations:</strong> Every drafted answer includes a confidence score and verifiable source document link.</li>
        <li><strong>Native Microsoft Word (.docx) Exporter:</strong> Download formatted proposal documents ready for client presentation.</li>
      </ul>

      <p>By automating 90% of draft creation, sales teams can submit 5x more proposals per quarter while maintaining total accuracy.</p>
    `,
    ctaText: 'Launch RFP Engine Workspace',
    ctaHref: '/projects',
  },
  {
    slug: 'nzbc-building-consent-ai-auditor',
    title: 'Navigating NZBC Building Code Compliance: Pre-Auditing Architectural Specs with AI',
    excerpt: 'Learn how New Zealand architects, drafters, and builders pre-audit blueprints against NZBC E2, H1, B1, and G12 clauses to eliminate costly council RFIs and approval delays.',
    category: 'Architecture & Construction',
    product: 'AI Building Consent Auditor',
    readTime: '7 min read',
    publishDate: 'August 3, 2026',
    author: 'Building Compliance Engineering Team',
    content: `
      <h2>The Cost of Council RFIs in New Zealand Construction</h2>
      <p>Requests for Information (RFIs) from local territorial authorities (Auckland Council, Christchurch City Council, Wellington City Council) add weeks or months to building consent processing times. Architectural specifications that miss critical NZBC E2 (External Moisture) flashings or H1 (Energy Efficiency) insulation calculations are immediately flagged.</p>

      <h3>AI-Powered Pre-Consent Audit Workflows</h3>
      <p>ContextSkeleton's AI Building Consent Auditor checks submitted architectural specifications against NZBC clauses before council lodgement:</p>

      <ul>
        <li><strong>NZBC Clause E2/AS1 Verification:</strong> Checks weatherproofing, window head flashings, and cavity batten specs.</li>
        <li><strong>NZBC Clause H1 Energy Compliance:</strong> Evaluates R-value targets for roof, wall, and floor assemblies.</li>
        <li><strong>Producer Statement (PS1/PS3) Tracking:</strong> Highlights missing engineer producer statements for structural elements.</li>
      </ul>

      <h3>Disclaimer & Professional Signoff</h3>
      <p>While the AI pre-auditor catches common specification oversights, final building consent applications must always be reviewed and signed off by a Registered Architect or Chartered Professional Engineer (CPEng).</p>
    `,
    ctaText: 'Launch Building Auditor',
    ctaHref: '/consent',
  },
  {
    slug: 'soc2-iso27001-security-questionnaire-resolver',
    title: 'Automating SOC2 & ISO 27001 Security Questionnaires for CISOs & SaaS Vendors',
    excerpt: 'Streamline customer vendor risk assessments with grounded SOC 2 Type II control mappings and single-click CSV / Excel spreadsheet exports.',
    category: 'SaaS Security & Compliance',
    product: 'SOC2 & ISO 27001 Security Resolver',
    readTime: '5 min read',
    publishDate: 'August 2, 2026',
    author: 'CISO & Security Operations Team',
    content: `
      <h2>The Bottleneck of Enterprise Vendor Risk Assessments</h2>
      <p>As SaaS companies scale, enterprise buyers require extensive security questionnaires covering SOC 2 Type II controls, ISO 27001 ISMS policies, GDPR data handling, and encryption standards. Security officers spend hundreds of hours re-answering identical security questions.</p>

      <h3>Grounded Control Mapping & Confidence Scoring</h3>
      <p>Our Security Resolver matches vendor questions against your official security whitepapers, SOC 2 reports, and ISO control frameworks:</p>

      <ul>
        <li><strong>SOC 2 CC6.1 & ISO 27001 A.9.1 Mapping:</strong> Maps access control policies directly to security standards.</li>
        <li><strong>HIGH/MEDIUM/LOW Confidence Ratings:</strong> Instantly flags answers requiring manual CISO review.</li>
        <li><strong>Excel & CSV Exporters:</strong> Download completed security spreadsheets matching customer layouts.</li>
      </ul>
    `,
    ctaText: 'Launch Security Resolver',
    ctaHref: '/security-questionnaire',
  },
  {
    slug: 'enterprise-vector-knowledge-base-rag',
    title: 'Architecting Isolated Vector Knowledge Bases with Turso Cloud & Gemini 2.5',
    excerpt: 'An technical guide on how ContextSkeleton builds high-performance multi-tenant vector RAG indexing pipelines with 5-chunk parallel batching.',
    category: 'AI Infrastructure',
    product: 'Enterprise Vector Knowledge Base',
    readTime: '8 min read',
    publishDate: 'August 1, 2026',
    author: 'AI Platform Engineering',
    content: `
      <h2>Solving Multi-Tenant Data Isolation in RAG Architectures</h2>
      <p>Most RAG implementations mix customer document embeddings in a shared vector database with tenant IDs. ContextSkeleton enforces strict multi-tenant isolation by deploying dedicated SQLite database instances on Turso Cloud.</p>

      <h3>High-Speed Chunking & Transactional Embeddings</h3>
      <p>By replacing sequential embedding loops with 5-chunk parallel batches and atomic SQLite transactions, document ingestion speed increased by 25x, processing 15MB PDFs in under 2 seconds.</p>
    `,
    ctaText: 'Manage Vector Knowledge Base',
    ctaHref: '/knowledge',
  },
  {
    slug: 'llm-token-skeletonizer-prompt-reduction',
    title: 'Reducing LLM Prompt Token Costs by Up to 92% with AST Code Skeletonization',
    excerpt: 'How AST structural code folding preserves 100% of function signatures, types, and logic context while drastically reducing prompt token consumption.',
    category: 'Developer Tools',
    product: 'LLM Token Skeletonizer',
    readTime: '4 min read',
    publishDate: 'July 30, 2026',
    author: 'Developer Tools Lead',
    content: `
      <h2>The High Cost of Large Code Context Windows</h2>
      <p>Feeding entire repositories or 5,000-line source code files into LLMs consumes tens of thousands of tokens per API call. 90% of function body implementations are unnecessary when asking an AI model to interface with an API or write unit tests.</p>

      <h3>AST-Level Structural Folding</h3>
      <p>The Token Skeletonizer extracts TypeScript interfaces, class definitions, function signatures, and docstrings while stripping internal boilerplate. The result is a structural skeleton that retains 100% context for LLMs while reducing token counts by up to 92%.</p>

      <p>Try the Token Skeletonizer tool for free today!</p>
    `,
    ctaText: 'Try Token Skeletonizer (Free)',
    ctaHref: '/skeletonizer',
  },
];
