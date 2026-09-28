const fs = require('fs');
const path = require('path');

const taxonomyRaw = `01  Fundamentals
02  Developer Utilities
03  Text
04  Encoding
05  Validation
06  Random Data
07  Mock Data
08  Images
09  Video
10  Audio
11  Icons
12  Logos
13  Colors
14  Fonts
15  Themes
16  Git
17  GitHub
18  GitLab
19  Package Registries
20  Programming Languages
21  Databases
22  Authentication
23  Identity
24  Email
25  SMS
26  Notifications
27  Chat
28  Payments
29  Finance
30  E-Commerce
31  Maps
32  Geolocation
33  Transportation
34  Travel
35  Weather
36  Environment
37  News
38  Content
39  Social
40  Search
41  Documents
42  OCR
43  Productivity
44  Cloud
45  DevOps
46  CI/CD
47  Containers
48  Kubernetes
49  Infrastructure
50  Monitoring
51  Observability
52  Security
53  Threat Intelligence
54  Government
55  Open Data
56  Science
57  Research
58  Healthcare
59  Education
60  Enterprise
61  HR
62  Payroll
63  CRM
64  ERP
65  Supply Chain
66  Gaming
67  IoT
68  Hardware
69  Robotics
70  Blockchain
71  Web3
72  AI
73  LLM
74  Machine Learning
75  Computer Vision
76  Speech
77  Generative AI
78  AI Agents
79  Agent Tools
80  MCP
81  A2A
82  OpenAPI
83  GraphQL
84  gRPC
85  SOAP
86  WebSocket
87  Webhooks
88  AsyncAPI
89  JSON-RPC
90  API Gateways
91  API Management
92  API Analytics
93  API Testing
94  API Security
95  API Monitoring
96  API Discovery
97  API Marketplace
98  SDKs
99  Code Generation
100 API Intelligence
101 API Graph
102 API Lifecycle
103 API Reliability
104 API Provenance
105 API Data Lake
106 API Search
107 API Recommendations
108 API Compatibility
109 API Migration
110 Developer Intelligence
111 Emerging Protocols
112 Experimental APIs`;

const categories = taxonomyRaw.split('\n').map(line => {
  const match = line.match(/^(\d+)\s+(.+)$/);
  if (!match) return null;
  const name = match[2];
  return {
    id: `cat_${match[1].padStart(3, '0')}`,
    name: name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
}).filter(Boolean);

// Ensure the directory exists
const targetDir = path.join(__dirname, '..', 'catalog', 'categories');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(
  path.join(targetDir, 'master.json'),
  JSON.stringify(categories, null, 2)
);

// We should also scaffold the catalog/apis/ shards based on these new slugs
const apiDir = path.join(__dirname, '..', 'catalog', 'apis');
categories.forEach(cat => {
  const shardPath = path.join(apiDir, cat.slug);
  if (!fs.existsSync(shardPath)) {
    fs.mkdirSync(shardPath, { recursive: true });
  }
});

console.log(`✅ Mahi API Verse Taxonomy Updated: ${categories.length} precision categories created.`);
console.log(`✅ 112 Sharding directories created in catalog/apis/`);
