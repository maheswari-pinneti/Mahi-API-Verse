const fs = require('fs');
const path = require('path');

const categoriesRaw = `01 AI
02 Machine Learning
03 AI Agents
04 MCP
05 Developer
06 Git
07 GitHub
08 GitLab
09 Packages
10 npm
11 PyPI
12 Cloud
13 DevOps
14 Kubernetes
15 Docker
16 Security
17 Identity
18 Authentication
19 Payments
20 Banking
21 Finance
22 Crypto
23 Blockchain
24 E-commerce
25 Retail
26 SaaS
27 CRM
28 ERP
29 HR
30 Payroll
31 Marketing
32 Advertising
33 Analytics
34 Monitoring
35 Observability
36 Communication
37 Email
38 SMS
39 Chat
40 Social
41 Video
42 Audio
43 Music
44 Images
45 Design
46 Icons
47 Fonts
48 Colors
49 Documents
50 PDF
51 OCR
52 Search
53 SEO
54 Web
55 DNS
56 Domains
57 IP
58 Geolocation
59 Maps
60 Transportation
61 Travel
62 Airlines
63 Hotels
64 Weather
65 Environment
66 Government
67 Open Data
68 Education
69 Research
70 Science
71 Space
72 Health
73 Medical
74 Food
75 Sports
76 Gaming
77 Books
78 Libraries
79 News
80 Media
81 Jobs
82 Recruitment
83 Real Estate
84 Legal
85 Insurance
86 Automotive
87 Logistics
88 Shipping
89 Agriculture
90 Energy
91 IoT
92 Robotics
93 Quantum
94 AR
95 VR
96 XR
97 Automation
98 Workflow
99 Testing
100 Mock Data
101 API Management
102 API Discovery
103 API Monitoring
104 API Marketplace
105 API Documentation
106 API Gateway
107 Webhooks
108 WebSockets
109 GraphQL
110 gRPC
111 SOAP
112 AsyncAPI
113 OpenAPI
114 SDK
115 CLI
116 Data
117 Databases
118 Vector Databases
119 Knowledge Graphs
120 Semantic Search`;

// Parse Categories
const categories = categoriesRaw.split('\n').map(line => {
  const match = line.match(/^(\d+)\s+(.+)$/);
  if (!match) return null;
  const name = match[2];
  return {
    id: `cat_${match[1].padStart(3, '0')}`,
    name: name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
}).filter(Boolean);

fs.writeFileSync(
  path.join(__dirname, '../data/categories/master.json'),
  JSON.stringify(categories, null, 2)
);
console.log('✅ Generated data/categories/master.json with 120 categories.');


// Languages Data (Sampling the core active ones provided)
const activeLanguages = [
  { id: 'lang_000001', name: 'Python', slug: 'python', type: 'general-purpose', status: 'active', paradigms: ['imperative', 'object-oriented', 'functional'], packageManagers: ['pip', 'poetry'] },
  { id: 'lang_000002', name: 'JavaScript', slug: 'javascript', type: 'web', status: 'active', paradigms: ['event-driven', 'imperative', 'object-oriented'], packageManagers: ['npm', 'yarn', 'pnpm'] },
  { id: 'lang_000003', name: 'TypeScript', slug: 'typescript', type: 'web', status: 'active', paradigms: ['object-oriented', 'functional'], packageManagers: ['npm', 'yarn', 'pnpm'] },
  { id: 'lang_000004', name: 'Java', slug: 'jvm', type: 'general-purpose', status: 'active', paradigms: ['object-oriented', 'concurrent'], packageManagers: ['maven', 'gradle'] },
  { id: 'lang_000005', name: 'Go', slug: 'go', type: 'systems', status: 'active', paradigms: ['concurrent', 'imperative'], packageManagers: ['go modules'] },
  { id: 'lang_000006', name: 'Rust', slug: 'rust', type: 'systems', status: 'active', paradigms: ['concurrent', 'functional', 'imperative'], packageManagers: ['cargo'] },
  { id: 'lang_000007', name: 'C#', slug: 'csharp', type: 'dotnet', status: 'active', paradigms: ['object-oriented', 'generic'], packageManagers: ['nuget'] },
  { id: 'lang_000008', name: 'C++', slug: 'cpp', type: 'systems', status: 'active', paradigms: ['object-oriented', 'generic'], packageManagers: ['vcpkg', 'conan'] },
  { id: 'lang_000009', name: 'Ruby', slug: 'ruby', type: 'general-purpose', status: 'active', paradigms: ['object-oriented', 'functional'], packageManagers: ['gem'] },
  { id: 'lang_000010', name: 'PHP', slug: 'php', type: 'general-purpose', status: 'active', paradigms: ['imperative', 'object-oriented'], packageManagers: ['composer'] }
];

fs.writeFileSync(
  path.join(__dirname, '../data/languages/active.json'),
  JSON.stringify(activeLanguages, null, 2)
);
console.log('✅ Generated data/languages/active.json with foundational languages.');
