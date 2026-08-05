export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishDate: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  product: string;
  targetProduct: string;
  ctaHref: string;
  ctaText: string;
  content: string;
  metaDescription: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'autonomous-rfp-engine-b2b-proposals',
    title: 'How Autonomous AI Engines Cut B2B Tender Proposal Drafting Time by 92%',
    excerpt: 'Manual tender questionnaires consume hundreds of engineering hours. Learn how grounded RAG vector search automates 100-page RFPs with verified company citations.',
    publishDate: 'August 4, 2026',
    date: 'August 4, 2026',
    readTime: '6 min read',
    category: 'RFP & Proposal Automation',
    author: 'ContextSkeleton Research',
    product: 'RFP & Tender Engine',
    targetProduct: 'RFP & Tender Engine ($499/mo)',
    ctaHref: '/projects',
    ctaText: 'Launch Autonomous RFP Engine',
    metaDescription: 'Discover how B2B proposal teams use grounded vector search to automate RFP responses and export formatted Microsoft Word (.docx) documents.',
    content: `
<h2>The Cost of Manual Tender Questionnaires</h2>
<p>B2B sales and engineering teams spend hundreds of hours responding to decision-stage RFPs and tenders. Complex questionnaires demand precise answers regarding architecture, SLA commitments, and security posture.</p>
<p>Relying on scattered internal spreadsheets leads to inconsistent facts, outdated technical metrics, and high risk of missed tender deadlines.</p>

<h2>Grounded RAG: Facts Over Hallucinations</h2>
<p>Unlike generic LLMs that guess facts, <strong>ContextSkeleton's Autonomous RFP Engine</strong> operates on a strict RAG (Retrieval-Augmented Generation) paradigm.</p>
<ul>
  <li><strong>Document Shredding:</strong> Upload prior proposal PDFs and technical documentation.</li>
  <li><strong>Vector Indexing:</strong> High-dimensional vector embeddings store company facts securely in isolated Turso databases.</li>
  <li><strong>Citation Matching:</strong> Every generated answer explicitly cites the original source document and paragraph.</li>
</ul>

<h2>Single-Click Word (.docx) Export</h2>
<p>Proposal managers can review generated answers in a collaborative workspace and export clean, formatted Microsoft Word (.docx) documents ready for instant submission to enterprise clients.</p>
    `,
  },
  {
    slug: 'nzbc-building-consent-ai-auditor',
    title: 'Pre-Auditing Architectural Specifications Against the NZBC Building Code',
    excerpt: 'Council consent RFI rejections delay construction by months. See how AI pre-auditing against NZBC E2, H1, and B1 standards ensures first-pass approval.',
    publishDate: 'August 3, 2026',
    date: 'August 3, 2026',
    readTime: '8 min read',
    category: 'Building Consent Compliance',
    author: 'NZBC Compliance Team',
    product: 'AI Building Consent Auditor',
    targetProduct: 'Building Consent Auditor ($750/mo)',
    ctaHref: '/consent',
    ctaText: 'Launch Building Consent Auditor',
    metaDescription: 'Learn how architects and builders audit specifications against New Zealand Building Code (NZBC E2/H1) prior to council lodgement.',
    content: `
<h2>Why Council Building Consent Applications Get Rejected</h2>
<p>In New Zealand, local councils issue Requests for Information (RFIs) when architectural specifications lack explicit verification against the New Zealand Building Code (NZBC).</p>

<h2>Automated NZBC Pre-Audit Workflow</h2>
<p>The <strong>ContextSkeleton AI Building Consent Auditor</strong> compares project specifications directly against verified NZBC clause databases:</p>
<ul>
  <li><strong>E2 Moisture Checker:</strong> Evaluates weatherboard, brick veneer, and butyl rubber gutter specifications.</li>
  <li><strong>H1 Thermal Audit:</strong> Compares window R-values and ceiling insulation batts against climate zone thresholds.</li>
  <li><strong>RFI Risk Scorecard:</strong> Highlights potential rejection risks before submitting to council portals.</li>
</ul>
    `,
  },
  {
    slug: 'soc2-iso27001-security-questionnaire-resolver',
    title: 'Automating Enterprise SOC 2 & ISO 27001 Security Questionnaires',
    excerpt: 'Vendor risk assessments stall enterprise SaaS sales cycles. Learn how grounded security policies auto-resolve SIG, CAIQ, and custom security audits.',
    publishDate: 'August 2, 2026',
    date: 'August 2, 2026',
    readTime: '5 min read',
    category: 'SaaS Security & CISOs',
    author: 'Security & Compliance Lab',
    product: 'SOC2 & ISO 27001 Security Resolver',
    targetProduct: 'Security Questionnaire Resolver ($499/mo)',
    ctaHref: '/security-questionnaire',
    ctaText: 'Launch Security Resolver',
    metaDescription: 'Automate enterprise vendor risk assessments with grounded SOC 2 Type II and ISO 27001 policy control mappings.',
    content: `
<h2>The Vendor Security Bottleneck</h2>
<p>Enterprise SaaS procurement requires CISOs to fill out 200+ question security questionnaires (SIG, VSA, CAIQ) covering data encryption, SOC 2 controls, and incident response procedures.</p>

<h2>Policy-Grounded Control Mapping</h2>
<p>The <strong>SOC 2 & ISO 27001 Security Questionnaire Resolver</strong> indexes your company's formal security policies, SOC 2 Type II reports, and penetration test summaries.</p>
<ul>
  <li><strong>Exact Clause Mapping:</strong> Maps incoming questions directly to ISO 27001:2022 controls and SOC 2 Trust Services Criteria.</li>
  <li><strong>Confidence Scoring:</strong> Assigns high/medium/low confidence scores to each answer.</li>
  <li><strong>Excel/CSV Export:</strong> Exports structured spreadsheets compatible with vendor procurement portals.</li>
</ul>
    `,
  },
  {
    slug: 'automating-iso-9001-as9100-aerospace-quality-audits',
    title: 'Automating ISO 9001 and AS9100 Aerospace Quality Manual Audits and CAPA Root Cause Analysis',
    excerpt: 'Aerospace supplier non-conformances risk severe customer penalties. Discover how QA directors audit CAPA logs and FAI reports against AS9100D standards.',
    publishDate: 'August 5, 2026',
    date: 'August 5, 2026',
    readTime: '9 min read',
    category: 'Aerospace & Quality Systems',
    author: 'Quality Systems Lab',
    product: 'ISO 9001 & AS9100 Quality Auditor',
    targetProduct: 'ISO 9001 & AS9100 Quality Auditor ($899/mo)',
    ctaHref: '/iso-quality',
    ctaText: 'Launch Quality System Engine',
    metaDescription: 'Discover how aerospace quality directors audit non-conformance logs (NCR) and First Article Inspection (FAI) reports against ISO 9001:2015 and AS9100D rules.',
    content: `
<h2>The Cost of Quality Non-Conformances in Aerospace</h2>
<p>In aerospace manufacturing and precision machining, non-conforming parts can trigger customer line stoppages and audit findings from major OEMs.</p>

<h2>Automated AS9100D & ISO 9001 Clause Verification</h2>
<p>The <strong>ContextSkeleton ISO 9001 & AS9100 Quality System Auditor</strong> evaluates plant inspection logs and CAPA reports:</p>
<ul>
  <li><strong>AS9102 First Article Inspection:</strong> Validates FAI reports against component drawings.</li>
  <li><strong>Measurement Traceability:</strong> Checks equipment calibration logs against ISO 9001 Clause 7.1.5.</li>
  <li><strong>CAPA Root Cause Rationale:</strong> Verifies that corrective actions address systemic causes rather than temporary fixes.</li>
</ul>
    `,
  },
  {
    slug: 'automating-sox-404-financial-controls-audits',
    title: 'Automating SOX 404 Financial Control Audits and Segregation of Duties (SoD) Testing',
    excerpt: 'Material weaknesses in internal controls over financial reporting risk SEC penalties. Learn how internal auditors audit SOX 404 and SSAE 18 controls.',
    publishDate: 'August 5, 2026',
    date: 'August 5, 2026',
    readTime: '9 min read',
    category: 'Internal Audit & SOX 404',
    author: 'Internal Audit Lab',
    product: 'SOX 404 & SOC 1 Financial Auditor',
    targetProduct: 'SOX 404 & SOC 1 Financial Auditor ($750/mo)',
    ctaHref: '/sox-audit',
    ctaText: 'Launch SOX Audit Engine',
    metaDescription: 'Discover how internal audit directors and corporate controllers audit SOX Section 404 financial controls and ITGC Segregation of Duties against PCAOB rules.',
    content: `
<h2>The Legal Burden of SOX 404 Compliance</h2>
<p>Public company CFOs and corporate controllers face strict reporting requirements under Sarbanes-Oxley (SOX) Section 404 to maintain effective Internal Control over Financial Reporting (ICFR).</p>

<h2>Automated ICFR & ITGC Audit Engine</h2>
<p>The <strong>ContextSkeleton SOC 1 & SOX 404 Financial Controls Auditor</strong> processes journal entry logs and ITGC access reviews:</p>
<ul>
  <li><strong>Segregation of Duties (SoD):</strong> Flags developer write access to financial ledger production databases.</li>
  <li><strong>Journal Entry Approvals:</strong> Identifies manual journal entries posted without secondary controller sign-off.</li>
  <li><strong>ITGC Change Management:</strong> Validates database schema migrations against CAB approval tickets.</li>
</ul>
    `,
  },
];
