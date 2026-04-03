window.notesData = {
  "Amazon AppStream 2.0": {
    "keywords": [
      "Application streaming",
      "Stream desktop apps",
      "Centralized management",
      "Non-persistent",
      "Any device",
      "Browser-based access",
      "GPU app"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon AppStream 2.0</strong></th>\n<th><strong>Amazon WorkSpaces</strong></th>\n<th><strong>Amazon EC2 Instance</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Stream a Single Application</strong></td>\n<td>Provide a <strong>Full, Persistent Desktop</strong></td>\n<td>Provide a <strong>Raw Virtual Server</strong></td>\n</tr>\n<tr>\n<td><strong>What the User Sees</strong></td>\n<td>Just the application's window.</td>\n<td>A complete Windows/Linux desktop.</td>\n<td>Nothing (until they connect via RDP/SSH).</td>\n</tr>\n<tr>\n<td><strong>Persistence</strong></td>\n<td><strong>Non-persistent</strong> by default.</td>\n<td><strong>Persistent.</strong> User state is saved.</td>\n<td>Persistent (with EBS).</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Netflix for your apps.</td>\n<td>Your corporate desktop in the cloud.</td>\n<td>The raw server in the data center.</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Stream an application\", \"GPU app\"</td>\n<td>\"Virtual desktop\", \"Replace PC\"</td>\n<td>\"Virtual server\", \"Full control\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Athena": {
    "keywords": [
      "Query data in S3",
      "Standard SQL",
      "Serverless",
      "Ad-hoc analysis",
      "Pay-per-query"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Amplify</strong></th>\n<th><strong>AWS AppSync</strong></th>\n<th><strong>Amazon SQS</strong></th>\n<th><strong>Amazon Kinesis</strong></th>\n<th><strong>Amazon Athena</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Build full-stack apps</td>\n<td>Build GraphQL APIs</td>\n<td>Decouple with messaging</td>\n<td>Analyze streaming data</td>\n<td>Query data in S3</td>\n</tr>\n<tr>\n<td><strong>Abstraction Level</strong></td>\n<td>High (Framework)</td>\n<td>High (PaaS)</td>\n<td>High (PaaS)</td>\n<td>High (PaaS)</td>\n<td>High (Serverless)</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Front-end Developer</td>\n<td>App Developer</td>\n<td>Backend Developer</td>\n<td>Data Engineer</td>\n<td>Data Analyst</td>\n</tr>\n<tr>\n<td><strong>Data Flow</strong></td>\n<td>Client &lt;-&gt; Backend</td>\n<td>Client &lt;-&gt; API</td>\n<td>Producer -&gt; Queue -&gt; Consumer</td>\n<td>Producer -&gt; Stream -&gt; Consumers</td>\n<td>User -&gt; S3 Data</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Simplify mobile dev\"</td>\n<td>\"GraphQL\"</td>\n<td>\"Decouple\"</td>\n<td>\"Real-time stream\"</td>\n<td>\"SQL on S3\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Aurora": {
    "keywords": [
      "High-performance",
      "MySQL/PostgreSQL compatible",
      "Cloud-native",
      "Self-healing storage"
    ],
    "detailsHTML": ""
  },
  "Amazon CloudFront": {
    "keywords": [
      "CDN",
      "Content Delivery Network",
      "Edge Location",
      "Cache",
      "Low Latency",
      "Global content delivery",
      "Speed up website"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon VPC</strong></th>\n<th><strong>Amazon EC2</strong></th>\n<th><strong>Amazon RDS</strong></th>\n<th><strong>Amazon Route 53</strong></th>\n<th><strong>Amazon CloudFront</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Networking Foundation</td>\n<td>Virtual Servers</td>\n<td>Managed Databases</td>\n<td>DNS Service</td>\n<td>Content Delivery Network</td>\n</tr>\n<tr>\n<td><strong>Layer</strong></td>\n<td>Network</td>\n<td>Compute (IaaS)</td>\n<td>Database (PaaS)</td>\n<td>DNS / Routing</td>\n<td>Edge / Caching</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Network Admin</td>\n<td>SysAdmin / Developer</td>\n<td>Developer / DBA</td>\n<td>Network Admin</td>\n<td>Web Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Private Network\"</td>\n<td>\"Virtual Server\"</td>\n<td>\"Managed Database\"</td>\n<td>\"Domain Name\"</td>\n<td>\"Speed up website\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon CloudWatch": {
    "keywords": [
      "Metrics",
      "Alarms",
      "Logs",
      "Dashboards",
      "Performance monitoring",
      "Monitor CPU"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudTrail</strong></th>\n<th><strong>Amazon CloudWatch</strong></th>\n<th><strong>AWS X-Ray</strong></th>\n<th><strong>AWS Inspector</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Audit</strong> Account Activity</td>\n<td><strong>Monitor</strong> Resource Performance</td>\n<td><strong>Trace</strong> Application Performance</td>\n<td><strong>Scan</strong> for Software Vulnerabilities</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Records a history of all API calls.</td>\n<td>Collects metrics, logs, and sets alarms.</td>\n<td>Traces requests through microservices.</td>\n<td>Scans EC2/ECR for known CVEs.</td>\n</tr>\n<tr>\n<td><strong>Answers...</strong></td>\n<td>\"Who did what?\"</td>\n<td>\"How is my server running?\"</td>\n<td>\"<strong>Why</strong> is my app slow?\"</td>\n<td>\"Is my server patched?\"</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Security Logbook</td>\n<td>The Car's Dashboard</td>\n<td>The Performance MRI Scan</td>\n<td>The Home Safety Inspector</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"API calls\", \"Audit trail\"</td>\n<td>\"Metrics\", \"Alarms\", \"Logs\"</td>\n<td>\"Bottlenecks\", \"Trace\", \"Debug\"</td>\n<td>\"CVEs\", \"Vulnerability scan\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Comprehend": {
    "keywords": [
      "Natural Language Processing (NLP)",
      "Text analysis",
      "Sentiment analysis",
      "Entity extraction",
      "Key phrase detection",
      "Unstructured text",
      "Analyze customer sentiment"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Rekognition</strong></th>\n<th><strong>Amazon Comprehend</strong></th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon Elastic Transcoder</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Analyze <strong>Images &amp; Video</strong></td>\n<td>Analyze <strong>Text</strong></td>\n<td><strong>Transform Data</strong> (ETL)</td>\n<td><strong>Transform Media</strong> (Video)</td>\n</tr>\n<tr>\n<td><strong>Input</strong></td>\n<td>JPG, PNG, MP4</td>\n<td>Plain Text</td>\n<td>CSV, JSON, RDS Tables</td>\n<td>MOV, AVI, MP4</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>AI / Machine Learning</td>\n<td>AI / Machine Learning</td>\n<td>Analytics / Data Integration</td>\n<td>Media Services</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Application Developer</td>\n<td>Application / Data Scientist</td>\n<td>Data Engineer</td>\n<td>Media Engineer / Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Detect objects in a photo\"</td>\n<td>\"Analyze customer sentiment\"</td>\n<td>\"Prepare data for analytics\"</td>\n<td>\"Convert a video file\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Connect": {
    "keywords": [
      "Cloud contact center",
      "Customer service",
      "Call center",
      "Omnichannel",
      "IVR"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Connect</strong></th>\n<th><strong>AWS Global Accelerator</strong></th>\n<th><strong>Amazon Lightsail</strong></th>\n<th><strong>AWS Storage Gateway</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Cloud Contact Center</td>\n<td>Improve Global Network Performance</td>\n<td>Simple Virtual Private Server (VPS)</td>\n<td><strong>Hybrid Cloud Storage</strong></td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Application (SaaS)</td>\n<td>Networking</td>\n<td>Compute / Platform</td>\n<td>Storage / Hybrid</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Customer Service Manager</td>\n<td>Network Engineer / Architect</td>\n<td>Developer / New User</td>\n<td>IT / Storage Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Call center\", \"IVR\"</td>\n<td>\"Static Anycast IP\", \"Global users\"</td>\n<td>\"Easy VPS\", \"Predictable price\"</td>\n<td>\"On-premises to cloud storage\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon EC2": {
    "keywords": [
      "Virtual Server",
      "IaaS",
      "Compute capacity",
      "Instance",
      "AMI",
      "Security Group"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon VPC</strong></th>\n<th><strong>Amazon EC2</strong></th>\n<th><strong>Amazon RDS</strong></th>\n<th><strong>Amazon Route 53</strong></th>\n<th><strong>Amazon CloudFront</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Networking Foundation</td>\n<td>Virtual Servers</td>\n<td>Managed Databases</td>\n<td>DNS Service</td>\n<td>Content Delivery Network</td>\n</tr>\n<tr>\n<td><strong>Layer</strong></td>\n<td>Network</td>\n<td>Compute (IaaS)</td>\n<td>Database (PaaS)</td>\n<td>DNS / Routing</td>\n<td>Edge / Caching</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Network Admin</td>\n<td>SysAdmin / Developer</td>\n<td>Developer / DBA</td>\n<td>Network Admin</td>\n<td>Web Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Private Network\"</td>\n<td>\"Virtual Server\"</td>\n<td>\"Managed Database\"</td>\n<td>\"Domain Name\"</td>\n<td>\"Speed up website\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Elastic Block Store": {
    "keywords": [
      "Block storage",
      "Volume",
      "Attached to one EC2",
      "Boot disk",
      "Hard drive for EC2"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon EBS</strong></th>\n<th><strong>Amazon EFS</strong></th>\n<th><strong>Amazon FSx for Windows</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Dedicated Disk</strong> for <strong>ONE</strong> Instance</td>\n<td><strong>Shared Files</strong> for <strong>MANY Linux</strong> Instances</td>\n<td><strong>Shared Files</strong> for <strong>MANY Windows</strong> Instances</td>\n</tr>\n<tr>\n<td><strong>Storage Type</strong></td>\n<td>Block</td>\n<td>File</td>\n<td>File</td>\n</tr>\n<tr>\n<td><strong>Access Method</strong></td>\n<td>Attached to 1 EC2</td>\n<td>Mounted via <strong>NFS</strong></td>\n<td>Mapped via <strong>SMB</strong></td>\n</tr>\n<tr>\n<td><strong>Primary OS</strong></td>\n<td>Any (Linux or Windows)</td>\n<td><strong>Linux</strong></td>\n<td><strong>Windows</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Boot drive\", \"Single server\"</td>\n<td>\"Shared storage for Linux\", \"NFS\"</td>\n<td>\"Shared storage for Windows\", \"SMB\", \"Active Directory\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Elastic Container Registry": {
    "keywords": [
      "Container registry",
      "Store Docker images",
      "Repository",
      "docker push/pull",
      "Store images"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>ECS</strong></th>\n<th><strong>EBS</strong></th>\n<th><strong>ECR</strong></th>\n<th><strong>EMR</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run</strong> Containers</td>\n<td><strong>Store</strong> Block Data</td>\n<td><strong>Store</strong> Container Images</td>\n<td><strong>Process</strong> Big Data</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Compute Orchestration</td>\n<td>Storage</td>\n<td>Container Registry</td>\n<td>Big Data / Analytics</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Docker Tasks &amp; Services</td>\n<td>Virtual Hard Drives</td>\n<td>Docker Image Repositories</td>\n<td>Spark/Hadoop Clusters</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Robot Fleet Manager</td>\n<td>Computer's C: Drive</td>\n<td>App Store for Containers</td>\n<td>Pop-up Data Science Lab</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Docker\", \"Orchestrate\"</td>\n<td>\"Boot disk\", \"Volume\"</td>\n<td>\"Store images\", \"Registry\"</td>\n<td><strong>\"Hadoop\"</strong>, <strong>\"Spark\"</strong></td>\n</tr>\n</tbody></table>"
  },
  "Amazon Elastic Container Service": {
    "keywords": [
      "Container orchestration",
      "Docker",
      "Run containers",
      "Microservices",
      "Orchestrate"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>ECS</strong></th>\n<th><strong>EBS</strong></th>\n<th><strong>ECR</strong></th>\n<th><strong>EMR</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run</strong> Containers</td>\n<td><strong>Store</strong> Block Data</td>\n<td><strong>Store</strong> Container Images</td>\n<td><strong>Process</strong> Big Data</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Compute Orchestration</td>\n<td>Storage</td>\n<td>Container Registry</td>\n<td>Big Data / Analytics</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Docker Tasks &amp; Services</td>\n<td>Virtual Hard Drives</td>\n<td>Docker Image Repositories</td>\n<td>Spark/Hadoop Clusters</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Robot Fleet Manager</td>\n<td>Computer's C: Drive</td>\n<td>App Store for Containers</td>\n<td>Pop-up Data Science Lab</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Docker\", \"Orchestrate\"</td>\n<td>\"Boot disk\", \"Volume\"</td>\n<td>\"Store images\", \"Registry\"</td>\n<td><strong>\"Hadoop\"</strong>, <strong>\"Spark\"</strong></td>\n</tr>\n</tbody></table>"
  },
  "Amazon Elastic File System": {
    "keywords": [
      "Shared file system",
      "Linux",
      "NFS protocol",
      "Multiple EC2 instances",
      "Shared storage for Linux"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon EBS</strong></th>\n<th><strong>Amazon EFS</strong></th>\n<th><strong>Amazon FSx for Windows</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Dedicated Disk</strong> for <strong>ONE</strong> Instance</td>\n<td><strong>Shared Files</strong> for <strong>MANY Linux</strong> Instances</td>\n<td><strong>Shared Files</strong> for <strong>MANY Windows</strong> Instances</td>\n</tr>\n<tr>\n<td><strong>Storage Type</strong></td>\n<td>Block</td>\n<td>File</td>\n<td>File</td>\n</tr>\n<tr>\n<td><strong>Access Method</strong></td>\n<td>Attached to 1 EC2</td>\n<td>Mounted via <strong>NFS</strong></td>\n<td>Mapped via <strong>SMB</strong></td>\n</tr>\n<tr>\n<td><strong>Primary OS</strong></td>\n<td>Any (Linux or Windows)</td>\n<td><strong>Linux</strong></td>\n<td><strong>Windows</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Boot drive\", \"Single server\"</td>\n<td>\"Shared storage for Linux\", \"NFS\"</td>\n<td>\"Shared storage for Windows\", \"SMB\", \"Active Directory\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Elastic Transcoder": {
    "keywords": [
      "Media transcoding",
      "Convert video/audio files",
      "Format",
      "Resolution",
      "Presets",
      "MP4"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Rekognition</strong></th>\n<th><strong>Amazon Comprehend</strong></th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon Elastic Transcoder</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Analyze <strong>Images &amp; Video</strong></td>\n<td>Analyze <strong>Text</strong></td>\n<td><strong>Transform Data</strong> (ETL)</td>\n<td><strong>Transform Media</strong> (Video)</td>\n</tr>\n<tr>\n<td><strong>Input</strong></td>\n<td>JPG, PNG, MP4</td>\n<td>Plain Text</td>\n<td>CSV, JSON, RDS Tables</td>\n<td>MOV, AVI, MP4</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>AI / Machine Learning</td>\n<td>AI / Machine Learning</td>\n<td>Analytics / Data Integration</td>\n<td>Media Services</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Application Developer</td>\n<td>Application / Data Scientist</td>\n<td>Data Engineer</td>\n<td>Media Engineer / Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Detect objects in a photo\"</td>\n<td>\"Analyze customer sentiment\"</td>\n<td>\"Prepare data for analytics\"</td>\n<td>\"Convert a video file\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon EMR": {
    "keywords": [
      "Big Data",
      "Hadoop",
      "Spark",
      "Data processing",
      "Cluster",
      "Process Big Data"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>ECS</strong></th>\n<th><strong>EBS</strong></th>\n<th><strong>ECR</strong></th>\n<th><strong>EMR</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run</strong> Containers</td>\n<td><strong>Store</strong> Block Data</td>\n<td><strong>Store</strong> Container Images</td>\n<td><strong>Process</strong> Big Data</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Compute Orchestration</td>\n<td>Storage</td>\n<td>Container Registry</td>\n<td>Big Data / Analytics</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Docker Tasks &amp; Services</td>\n<td>Virtual Hard Drives</td>\n<td>Docker Image Repositories</td>\n<td>Spark/Hadoop Clusters</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Robot Fleet Manager</td>\n<td>Computer's C: Drive</td>\n<td>App Store for Containers</td>\n<td>Pop-up Data Science Lab</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Docker\", \"Orchestrate\"</td>\n<td>\"Boot disk\", \"Volume\"</td>\n<td>\"Store images\", \"Registry\"</td>\n<td><strong>\"Hadoop\"</strong>, <strong>\"Spark\"</strong></td>\n</tr>\n</tbody></table>"
  },
  "Amazon EventBridge": {
    "keywords": [
      "Event bus",
      "Decouple",
      "Event-driven architecture",
      "Source/Target",
      "Rules",
      "SaaS integration",
      "Route Events"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Lambda</strong></th>\n<th><strong>Amazon EventBridge</strong></th>\n<th><strong>AWS Step Functions</strong></th>\n<th><strong>AWS Batch</strong></th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon SWF</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run</strong> Code (Serverless)</td>\n<td><strong>Route</strong> Events</td>\n<td><strong>Orchestrate</strong> a Workflow</td>\n<td><strong>Run</strong> Batch Jobs</td>\n<td><strong>Prepare</strong> Data (ETL)</td>\n<td><strong>Orchestrate</strong> Tasks (Legacy)</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>A single function execution</td>\n<td>The flow of events in a bus</td>\n<td>A multi-step state machine</td>\n<td>A queue of compute jobs</td>\n<td>A data transformation job</td>\n<td>A workflow with human tasks</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Real-time file processing</td>\n<td>Decoupling applications</td>\n<td>Sequencing Lambda functions</td>\n<td>Scientific computing</td>\n<td>Data warehousing prep</td>\n<td>Order processing with manual steps</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>On-call Specialist</td>\n<td>Central Post Office</td>\n<td>Assembly Line Flowchart</td>\n<td>Supercomputing Scheduler</td>\n<td>Automated Data Chef</td>\n<td>Factory Floor Manager</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Event-driven code\"</td>\n<td>\"Event bus\", \"SaaS\"</td>\n<td>\"Orchestrate workflow\"</td>\n<td>\"Long-running jobs\"</td>\n<td>\"ETL\", \"Crawler\"</td>\n<td>\"Human intervention\" (Likely a distractor)</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Forecast": {
    "keywords": [
      "Forecasting",
      "Time-series",
      "Predict demand",
      "Inventory planning",
      "Financial planning",
      "Resource planning"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Textract</strong></th>\n<th><strong>Amazon Lex</strong></th>\n<th><strong>Amazon Forecast</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Extract</strong> Data from Documents</td>\n<td><strong>Build</strong> Conversational Bots</td>\n<td><strong>Predict</strong> Future Outcomes</td>\n</tr>\n<tr>\n<td><strong>Input Data</strong></td>\n<td>Scanned Docs (PDF, JPG)</td>\n<td>User Utterances (Voice/Text)</td>\n<td>Historical Time-Series Data</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>Structured Data (JSON)</td>\n<td>An intent and slots</td>\n<td>A future-dated forecast</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Automated data entry.</td>\n<td>Automated conversations.</td>\n<td>Business and resource planning.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Intelligent Document Scanner</td>\n<td>The Build-A-Bot Workshop</td>\n<td>The AI-Powered Business Forecaster</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Forms\", \"Tables\", \"OCR\"</td>\n<td>\"Chatbot\", \"Voice\", \"Intent\"</td>\n<td>\"Forecast\", \"Predict demand\", \"Time-series\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon FSx for Windows File Server": {
    "keywords": [
      "Shared file system",
      "Windows",
      "SMB protocol",
      "Active Directory",
      "Shared storage for Windows"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon EBS</strong></th>\n<th><strong>Amazon EFS</strong></th>\n<th><strong>Amazon FSx for Windows</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Dedicated Disk</strong> for <strong>ONE</strong> Instance</td>\n<td><strong>Shared Files</strong> for <strong>MANY Linux</strong> Instances</td>\n<td><strong>Shared Files</strong> for <strong>MANY Windows</strong> Instances</td>\n</tr>\n<tr>\n<td><strong>Storage Type</strong></td>\n<td>Block</td>\n<td>File</td>\n<td>File</td>\n</tr>\n<tr>\n<td><strong>Access Method</strong></td>\n<td>Attached to 1 EC2</td>\n<td>Mounted via <strong>NFS</strong></td>\n<td>Mapped via <strong>SMB</strong></td>\n</tr>\n<tr>\n<td><strong>Primary OS</strong></td>\n<td>Any (Linux or Windows)</td>\n<td><strong>Linux</strong></td>\n<td><strong>Windows</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Boot drive\", \"Single server\"</td>\n<td>\"Shared storage for Linux\", \"NFS\"</td>\n<td>\"Shared storage for Windows\", \"SMB\", \"Active Directory\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon GuardDuty": {
    "keywords": [
      "Threat detection",
      "Malicious activity",
      "Anomalous behavior",
      "Machine Learning",
      "Analyzes logs",
      "Detect threats in my account"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS WAF</strong></th>\n<th><strong>AWS Shield</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Filter Malicious <strong>Content</strong></td>\n<td>Block Malicious <strong>Volume</strong></td>\n<td>Detect Malicious <strong>Activity</strong></td>\n</tr>\n<tr>\n<td><strong>Layer of Operation</strong></td>\n<td><strong>Layer 7 (Application)</strong></td>\n<td><strong>Layer 3/4 (Network/Transport)</strong></td>\n<td><strong>Account / Log Analysis</strong></td>\n</tr>\n<tr>\n<td><strong>Protects Against</strong></td>\n<td>SQL Injection, XSS</td>\n<td>DDoS Attacks</td>\n<td>Compromised credentials, Malware</td>\n</tr>\n<tr>\n<td><strong>Mechanism</strong></td>\n<td>Rule-based content inspection</td>\n<td>Traffic scrubbing &amp; absorption</td>\n<td><strong>Intelligent log analysis (ML)</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Protect my web application\"</td>\n<td>\"Protect against DDoS\"</td>\n<td>\"Detect threats in my account\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Inspector": {
    "keywords": [
      "Vulnerability scanning",
      "CVE",
      "Patch management",
      "EC2 instances",
      "Scan for CVEs",
      "Patching"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Inspector</strong></th>\n<th><strong>Cost Allocation Tags</strong></th>\n<th><strong>Key Pairs</strong></th>\n<th><strong>AWS Trusted Advisor</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Vulnerability Scanning</td>\n<td>Cost Tracking &amp; Organization</td>\n<td>EC2 Instance Authentication</td>\n<td>Best Practice Recommendations</td>\n</tr>\n<tr>\n<td><strong>Scope</strong></td>\n<td>Inside EC2 / Containers</td>\n<td>Metadata on any resource</td>\n<td>A single EC2 instance</td>\n<td>Entire AWS Account</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Security Engineer</td>\n<td>Finance / Cloud Admin</td>\n<td>System Administrator</td>\n<td>Cloud Admin / Manager</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Scan for CVEs\"</td>\n<td>\"Group costs by project\"</td>\n<td>\"SSH into Linux instance\"</td>\n<td>\"Optimize my account\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Kendra": {
    "keywords": [
      "Enterprise search",
      "Natural Language Questions",
      "Find answers",
      "Unstructured data",
      "Document search",
      "Search my documents with questions"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Kendra</strong></th>\n<th><strong>Amazon Polly</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Intelligent Search</strong> (Find Answers)</td>\n<td><strong>Text-to-Speech</strong> (Create Voice)</td>\n</tr>\n<tr>\n<td><strong>Input</strong></td>\n<td>Documents, Webpages, Databases (for indexing)</td>\n<td>Text (to be synthesized)</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>An answer to a question</td>\n<td>An audio file or stream (MP3, Ogg)</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Inefficient knowledge discovery</td>\n<td>Lack of audible interfaces</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Hyper-Intelligent Corporate Librarian</td>\n<td>Professional Voice Actor in the Cloud</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Search my documents with questions\"</td>\n<td>\"Convert this article to audio\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Kinesis": {
    "keywords": [
      "Real-time streaming data",
      "IoT",
      "Clickstreams",
      "Big Data",
      "Data ingestion",
      "Real-time stream"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Amplify</strong></th>\n<th><strong>AWS AppSync</strong></th>\n<th><strong>Amazon SQS</strong></th>\n<th><strong>Amazon Kinesis</strong></th>\n<th><strong>Amazon Athena</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Build full-stack apps</td>\n<td>Build GraphQL APIs</td>\n<td>Decouple with messaging</td>\n<td>Analyze streaming data</td>\n<td>Query data in S3</td>\n</tr>\n<tr>\n<td><strong>Abstraction Level</strong></td>\n<td>High (Framework)</td>\n<td>High (PaaS)</td>\n<td>High (PaaS)</td>\n<td>High (PaaS)</td>\n<td>High (Serverless)</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Front-end Developer</td>\n<td>App Developer</td>\n<td>Backend Developer</td>\n<td>Data Engineer</td>\n<td>Data Analyst</td>\n</tr>\n<tr>\n<td><strong>Data Flow</strong></td>\n<td>Client &lt;-&gt; Backend</td>\n<td>Client &lt;-&gt; API</td>\n<td>Producer -&gt; Queue -&gt; Consumer</td>\n<td>Producer -&gt; Stream -&gt; Consumers</td>\n<td>User -&gt; S3 Data</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Simplify mobile dev\"</td>\n<td>\"GraphQL\"</td>\n<td>\"Decouple\"</td>\n<td>\"Real-time stream\"</td>\n<td>\"SQL on S3\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Lex": {
    "keywords": [
      "Conversational interfaces",
      "Chatbot",
      "Voice",
      "Natural Language Understanding (NLU)",
      "Intent",
      "Slot",
      "Utterance",
      "Alexa"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Textract</strong></th>\n<th><strong>Amazon Lex</strong></th>\n<th><strong>Amazon Forecast</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Extract</strong> Data from Documents</td>\n<td><strong>Build</strong> Conversational Bots</td>\n<td><strong>Predict</strong> Future Outcomes</td>\n</tr>\n<tr>\n<td><strong>Input Data</strong></td>\n<td>Scanned Docs (PDF, JPG)</td>\n<td>User Utterances (Voice/Text)</td>\n<td>Historical Time-Series Data</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>Structured Data (JSON)</td>\n<td>An intent and slots</td>\n<td>A future-dated forecast</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Automated data entry.</td>\n<td>Automated conversations.</td>\n<td>Business and resource planning.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Intelligent Document Scanner</td>\n<td>The Build-A-Bot Workshop</td>\n<td>The AI-Powered Business Forecaster</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Forms\", \"Tables\", \"OCR\"</td>\n<td>\"Chatbot\", \"Voice\", \"Intent\"</td>\n<td>\"Forecast\", \"Predict demand\", \"Time-series\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Lightsail": {
    "keywords": [
      "Easy to use",
      "Simple",
      "Virtual Private Server (VPS)",
      "predictable monthly price",
      "Bundled resources",
      "Easy VPS"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Connect</strong></th>\n<th><strong>AWS Global Accelerator</strong></th>\n<th><strong>Amazon Lightsail</strong></th>\n<th><strong>AWS Storage Gateway</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Cloud Contact Center</td>\n<td>Improve Global Network Performance</td>\n<td>Simple Virtual Private Server (VPS)</td>\n<td><strong>Hybrid Cloud Storage</strong></td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Application (SaaS)</td>\n<td>Networking</td>\n<td>Compute / Platform</td>\n<td>Storage / Hybrid</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Customer Service Manager</td>\n<td>Network Engineer / Architect</td>\n<td>Developer / New User</td>\n<td>IT / Storage Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Call center\", \"IVR\"</td>\n<td>\"Static Anycast IP\", \"Global users\"</td>\n<td>\"Easy VPS\", \"Predictable price\"</td>\n<td>\"On-premises to cloud storage\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Macie": {
    "keywords": [
      "Sensitive data discovery",
      "PII",
      "PHI",
      "Amazon S3",
      "Data privacy",
      "Classification",
      "Is my data exposed?"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Inspector</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n<th><strong>Amazon Macie</strong></th>\n<th><strong>AWS Shield</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Proactive</strong> Vulnerability Scanning</td>\n<td><strong>Reactive</strong> Threat Detection</td>\n<td><strong>Sensitive Data</strong> Discovery</td>\n<td><strong>DDoS</strong> Protection</td>\n</tr>\n<tr>\n<td><strong>What it Scans/Monitors</strong></td>\n<td>Software in EC2 &amp; Containers</td>\n<td><strong>Logs</strong> (CloudTrail, VPC, DNS)</td>\n<td><strong>Data in S3</strong></td>\n<td>Network Traffic Volume</td>\n</tr>\n<tr>\n<td><strong>Answers...</strong></td>\n<td>\"Am I vulnerable?\"</td>\n<td>\"Am I being attacked?\"</td>\n<td>\"Is my data exposed?\"</td>\n<td>\"Can I handle a flood?\"</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Building Safety Inspector</td>\n<td>Intelligent Security Cameras</td>\n<td>Compliance Auditor for Files</td>\n<td>Riot Control Squad</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"CVEs\", \"Patching\"</td>\n<td>\"Malicious activity\", \"Anomalous\"</td>\n<td>\"PII\", \"Sensitive Data\", \"S3\"</td>\n<td>\"DDoS\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Personalize": {
    "keywords": [
      "Recommendations",
      "Personalization",
      "Individualized",
      "User behavior",
      "Real-time recommendations",
      "Machine Learning",
      "Recommend products"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Personalize</strong></th>\n<th><strong>Amazon Comprehend</strong></th>\n<th><strong>Amazon SageMaker</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Generate Recommendations</strong></td>\n<td><strong>Analyze Text</strong></td>\n<td><strong>Build/Train/Deploy ANY ML Model</strong></td>\n</tr>\n<tr>\n<td><strong>Input Data</strong></td>\n<td>User behavior, Item catalogs</td>\n<td>Unstructured text</td>\n<td>Any labeled training data</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>A ranked list of recommended items</td>\n<td>Sentiment, entities, key phrases</td>\n<td>A trained ML model endpoint</td>\n</tr>\n<tr>\n<td><strong>Required Expertise</strong></td>\n<td>Low (Application Developer)</td>\n<td>Low (Application Developer)</td>\n<td><strong>High (Data Scientist)</strong></td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Expert Personal Shopper</td>\n<td>Fast Research Assistant</td>\n<td>A complete ML workshop and factory</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Recommend products\"</td>\n<td>\"Analyze sentiment\"</td>\n<td>\"Build a custom ML model\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Polly": {
    "keywords": [
      "Text-to-Speech (TTS)",
      "Lifelike speech",
      "Voice",
      "Audio stream",
      "Synthesize speech",
      "Convert this article to audio"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Kendra</strong></th>\n<th><strong>Amazon Polly</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Intelligent Search</strong> (Find Answers)</td>\n<td><strong>Text-to-Speech</strong> (Create Voice)</td>\n</tr>\n<tr>\n<td><strong>Input</strong></td>\n<td>Documents, Webpages, Databases (for indexing)</td>\n<td>Text (to be synthesized)</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>An answer to a question</td>\n<td>An audio file or stream (MP3, Ogg)</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Inefficient knowledge discovery</td>\n<td>Lack of audible interfaces</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Hyper-Intelligent Corporate Librarian</td>\n<td>Professional Voice Actor in the Cloud</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Search my documents with questions\"</td>\n<td>\"Convert this article to audio\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Rekognition": {
    "keywords": [
      "Image analysis",
      "Video analysis",
      "Object detection",
      "Facial recognition",
      "Content moderation",
      "Detect objects in a photo"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Rekognition</strong></th>\n<th><strong>Amazon Comprehend</strong></th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon Elastic Transcoder</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Analyze <strong>Images &amp; Video</strong></td>\n<td>Analyze <strong>Text</strong></td>\n<td><strong>Transform Data</strong> (ETL)</td>\n<td><strong>Transform Media</strong> (Video)</td>\n</tr>\n<tr>\n<td><strong>Input</strong></td>\n<td>JPG, PNG, MP4</td>\n<td>Plain Text</td>\n<td>CSV, JSON, RDS Tables</td>\n<td>MOV, AVI, MP4</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>AI / Machine Learning</td>\n<td>AI / Machine Learning</td>\n<td>Analytics / Data Integration</td>\n<td>Media Services</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Application Developer</td>\n<td>Application / Data Scientist</td>\n<td>Data Engineer</td>\n<td>Media Engineer / Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Detect objects in a photo\"</td>\n<td>\"Analyze customer sentiment\"</td>\n<td>\"Prepare data for analytics\"</td>\n<td>\"Convert a video file\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Relational Database Service": {
    "keywords": [
      "Managed Relational Database",
      "PaaS",
      "MySQL",
      "PostgreSQL",
      "Aurora",
      "Automated backups",
      "Patching",
      "Managed Database"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon VPC</strong></th>\n<th><strong>Amazon EC2</strong></th>\n<th><strong>Amazon RDS</strong></th>\n<th><strong>Amazon Route 53</strong></th>\n<th><strong>Amazon CloudFront</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Networking Foundation</td>\n<td>Virtual Servers</td>\n<td>Managed Databases</td>\n<td>DNS Service</td>\n<td>Content Delivery Network</td>\n</tr>\n<tr>\n<td><strong>Layer</strong></td>\n<td>Network</td>\n<td>Compute (IaaS)</td>\n<td>Database (PaaS)</td>\n<td>DNS / Routing</td>\n<td>Edge / Caching</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Network Admin</td>\n<td>SysAdmin / Developer</td>\n<td>Developer / DBA</td>\n<td>Network Admin</td>\n<td>Web Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Private Network\"</td>\n<td>\"Virtual Server\"</td>\n<td>\"Managed Database\"</td>\n<td>\"Domain Name\"</td>\n<td>\"Speed up website\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Route 53": {
    "keywords": [
      "DNS",
      "Domain Name",
      "IP Address",
      "Routing policies",
      "Health checks"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Network Firewall</strong></th>\n<th><strong>Amazon Route 53</strong></th>\n<th><strong>AWS Shield Advanced</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Prevent</strong> unwanted network traffic.</td>\n<td><strong>Resolve</strong> DNS queries &amp; route users.</td>\n<td><strong>Prevent</strong> large-scale DDoS attacks.</td>\n<td><strong>Detect</strong> malicious account activity.</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Networking / Security</td>\n<td>Networking / DNS</td>\n<td>Security</td>\n<td>Security</td>\n</tr>\n<tr>\n<td><strong>Mechanism</strong></td>\n<td>Stateful firewall with IPS &amp; web filtering.</td>\n<td>DNS resolution with smart routing policies.</td>\n<td>Volumetric traffic scrubbing at the edge.</td>\n<td><strong>Intelligent log analysis (ML)</strong></td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Central Security Checkpoint</td>\n<td>Smart GPS System</td>\n<td>Elite Private Security Firm</td>\n<td>AI-Powered SOC</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"VPC firewall\", \"IPS\"</td>\n<td>\"DNS\", \"Domain name\"</td>\n<td>\"Advanced DDoS\", \"DRT\"</td>\n<td>\"Threat detection\", \"Anomalous\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Simple Queue Service": {
    "keywords": [
      "Decouple",
      "Message queue",
      "Asynchronous communication",
      "Microservices",
      "Buffer",
      "Decouple components"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudWatch</strong></th>\n<th><strong>VPC Flow logs</strong></th>\n<th><strong>S3 Bucket Logs</strong></th>\n<th><strong>Amazon SQS</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Monitoring Service</strong></td>\n<td><strong>Network Log Source</strong></td>\n<td><strong>Object Log Source</strong></td>\n<td><strong>Message Queue Service</strong></td>\n</tr>\n<tr>\n<td><strong>What it Holds/Records</strong></td>\n<td>Metrics, Events, Logs</td>\n<td>IP Traffic Metadata</td>\n<td>S3 Request Details</td>\n<td>Messages</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Performance Monitoring &amp; Alerting</td>\n<td>Network Troubleshooting</td>\n<td>S3 Access Auditing</td>\n<td><strong>Application Decoupling</strong></td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Ops Engineer / Developer</td>\n<td>Network Admin / Security</td>\n<td>Security / Data Analyst</td>\n<td>Application Architect / Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Monitor CPU\", \"Set Alarm\"</td>\n<td>\"Troubleshoot network\"</td>\n<td>\"Audit S3 requests\"</td>\n<td>\"Decouple components\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Simple Storage Service": {
    "keywords": [
      "Object storage",
      "Bucket",
      "Frequently accessed",
      "High durability",
      "Store files",
      "Backups",
      "Archives",
      "Static Content"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>S3 Standard</strong></th>\n<th><strong>S3 Glacier</strong></th>\n<th><strong>EBS Volume</strong></th>\n<th><strong>EBS Snapshot</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Primary Object Storage</td>\n<td><strong>Archive</strong> Object Storage</td>\n<td><strong>Primary</strong> Block Storage</td>\n<td><strong>Backup</strong> of Block Storage</td>\n</tr>\n<tr>\n<td><strong>Storage Type</strong></td>\n<td>Object</td>\n<td>Object</td>\n<td>Block</td>\n<td>Block (Backup)</td>\n</tr>\n<tr>\n<td><strong>Access Speed</strong></td>\n<td>Milliseconds</td>\n<td><strong>Minutes to Hours</strong></td>\n<td>Milliseconds</td>\n<td>Slow (Must restore to a volume first)</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Active files, website assets</td>\n<td>Compliance archives</td>\n<td>EC2 boot/data disks</td>\n<td>Backups, Disaster Recovery</td>\n</tr>\n<tr>\n<td><strong>Relationship</strong></td>\n<td>N/A</td>\n<td>A colder tier of S3</td>\n<td>The live, running disk</td>\n<td>The point-in-time copy of a volume, <strong>stored in S3</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Store files\"</td>\n<td>\"Archive files\"</td>\n<td>\"Hard drive for EC2\"</td>\n<td>\"Backup my EC2 disk\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon Textract": {
    "keywords": [
      "Extract text and data",
      "OCR",
      "Forms",
      "Tables",
      "Scanned documents",
      "Handwriting"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Textract</strong></th>\n<th><strong>Amazon Lex</strong></th>\n<th><strong>Amazon Forecast</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Extract</strong> Data from Documents</td>\n<td><strong>Build</strong> Conversational Bots</td>\n<td><strong>Predict</strong> Future Outcomes</td>\n</tr>\n<tr>\n<td><strong>Input Data</strong></td>\n<td>Scanned Docs (PDF, JPG)</td>\n<td>User Utterances (Voice/Text)</td>\n<td>Historical Time-Series Data</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>Structured Data (JSON)</td>\n<td>An intent and slots</td>\n<td>A future-dated forecast</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Automated data entry.</td>\n<td>Automated conversations.</td>\n<td>Business and resource planning.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Intelligent Document Scanner</td>\n<td>The Build-A-Bot Workshop</td>\n<td>The AI-Powered Business Forecaster</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Forms\", \"Tables\", \"OCR\"</td>\n<td>\"Chatbot\", \"Voice\", \"Intent\"</td>\n<td>\"Forecast\", \"Predict demand\", \"Time-series\"</td>\n</tr>\n</tbody></table>"
  },
  "Amazon VPC": {
    "keywords": [
      "Logical isolation",
      "Subnet",
      "Private IP",
      "CIDR",
      "Route Table",
      "Networking foundation"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Component</th>\n<th>Level of Operation</th>\n<th>Role / Purpose</th>\n<th>Analogy</th>\n</tr>\n<tr>\n<td><strong>VPC</strong></td>\n<td>Regional Container</td>\n<td>Your private network in the cloud</td>\n<td>Your entire plot of private land</td>\n</tr>\n<tr>\n<td><strong>Subnet</strong></td>\n<td>Availability Zone</td>\n<td>A network segment within your VPC</td>\n<td>A fenced-off yard on your property</td>\n</tr>\n<tr>\n<td><strong>Internet Gateway</strong></td>\n<td>VPC</td>\n<td>Enables public internet access</td>\n<td>The main gate to the public highway</td>\n</tr>\n<tr>\n<td><strong>NAT Gateway</strong></td>\n<td>Public Subnet</td>\n<td>Enables outbound-only internet for private subnets</td>\n<td>A one-way delivery gate for the backyard</td>\n</tr>\n<tr>\n<td><strong>Network ACL</strong></td>\n<td>Subnet</td>\n<td>Stateless firewall for the subnet</td>\n<td>The guard at the neighborhood gate</td>\n</tr>\n<tr>\n<td><strong>Security Group</strong></td>\n<td>EC2 Instance (ENI)</td>\n<td>Stateful firewall for the instance</td>\n<td>The guard at the front door of a house</td>\n</tr>\n</tbody></table>"
  },
  "AWS Amplify": {
    "keywords": [
      "Framework",
      "Front-end developers",
      "Full-stack",
      "Accelerate development",
      "CLI",
      "Hosting",
      "React/iOS/Android"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Amplify</strong></th>\n<th><strong>AWS Elastic Beanstalk</strong></th>\n<th><strong>AWS AppSync</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Front-end Framework</strong> to build full-stack apps</td>\n<td><strong>PaaS</strong> to host web applications</td>\n<td><strong>Managed Service</strong> to build GraphQL APIs</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td><strong>Orchestrates</strong> other services (Cognito, AppSync) via a CLI and provides hosting.</td>\n<td><strong>Manages</strong> the infrastructure (EC2, ELB, ASG) for your code.</td>\n<td>Provides a <strong>GraphQL endpoint</strong> for your data.</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td><strong>Front-end Developer</strong></td>\n<td>Backend / Full-stack Developer</td>\n<td>Application Developer</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Prefab Smart-Home Kit</td>\n<td>The All-in-One Caterer</td>\n<td>The Ultra-Efficient Personal Shopper</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Framework for React/iOS\", \"CLI\"</td>\n<td>\"Easy to deploy web app\"</td>\n<td><strong>\"GraphQL\"</strong></td>\n</tr>\n</tbody></table>"
  },
  "AWS App Runner": {
    "keywords": [
      "Easiest deployment",
      "Containerized web applications",
      "Source code or container image",
      "Fully managed",
      "Automatic scaling"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS App Runner</strong></th>\n<th><strong>AWS Systems Manager</strong></th>\n<th><strong>AWS Compute Optimizer</strong></th>\n<th><strong>AWS Pricing Calculator</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Deploy</strong> Containerized Web Apps</td>\n<td><strong>Manage</strong> a Fleet of Servers</td>\n<td><strong>Recommend</strong> Right-Sized Resources</td>\n<td><strong>Estimate</strong> Future Costs</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Application / PaaS</td>\n<td>Operations / Management</td>\n<td>Cost Optimization</td>\n<td>Cost Management</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Simplicity and speed of deployment.</td>\n<td>Operational efficiency at scale.</td>\n<td>Cost savings and performance improvement.</td>\n<td>Financial planning and budgeting.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Automated App Vending Machine</td>\n<td>Central Command Center</td>\n<td>AI-Powered Efficiency Consultant</td>\n<td>Contractor's Building Estimate</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Easiest way to deploy a container\"</td>\n<td>\"Patch/manage my server fleet\"</td>\n<td>\"Right-sizing recommendations\"</td>\n<td>\"Estimate costs for a new project\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS AppSync": {
    "keywords": [
      "GraphQL",
      "API",
      "Real-time data",
      "Offline data synchronization",
      "Modern API",
      "Mobile and web apps"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS AppSync</strong></th>\n<th><strong>AWS Config</strong></th>\n<th><strong>AWS Service Catalog</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Build</strong> a GraphQL API</td>\n<td><strong>Audit</strong> Resource Configuration</td>\n<td><strong>Govern</strong> Resource Provisioning</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>The GraphQL endpoint and its data sources.</td>\n<td>The state, history, and compliance of resources.</td>\n<td>A catalog of approved products.</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Flexible, real-time data access for apps.</td>\n<td>Compliance, auditing, and change tracking.</td>\n<td>Standardization and self-service.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Ultra-Efficient Personal Shopper</td>\n<td>The City Planning Historian</td>\n<td>The Curated Company Vending Machine</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td><strong>\"GraphQL\"</strong>, \"Modern API\"</td>\n<td>\"Track changes\", \"Compliance rules\"</td>\n<td>\"Approved products\", \"Self-service\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Artifact": {
    "keywords": [
      "Compliance reports",
      "Certifications",
      "Audit documents",
      "SOC, PCI, ISO, HIPAA",
      "Get AWS's SOC report"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Service</th>\n<th>The Question It Answers</th>\n<th>Scope</th>\n<th>Primary Output</th>\n</tr>\n<tr>\n<td><strong>AWS CloudTrail</strong></td>\n<td>\"Who did what, when, and where?\"</td>\n<td>API activity in your account</td>\n<td>A log file of events</td>\n</tr>\n<tr>\n<td><strong>Amazon Inspector</strong></td>\n<td>\"Is my software vulnerable?\"</td>\n<td>Software inside EC2 / Containers</td>\n<td>A report of vulnerabilities (CVEs)</td>\n</tr>\n<tr>\n<td><strong>AWS Trusted Advisor</strong></td>\n<td>\"Am I following best practices?\"</td>\n<td>Your entire AWS account</td>\n<td>A dashboard of recommendations</td>\n</tr>\n<tr>\n<td><strong>AWS Artifact</strong></td>\n<td>\"Is <strong>AWS</strong> compliant?\"</td>\n<td>The AWS global infrastructure</td>\n<td>Downloadable compliance reports</td>\n</tr>\n</tbody></table>"
  },
  "AWS Batch": {
    "keywords": [
      "Batch processing",
      "Long-running jobs",
      "Compute-intensive",
      "Run Batch Jobs"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Lambda</strong></th>\n<th><strong>Amazon EventBridge</strong></th>\n<th><strong>AWS Step Functions</strong></th>\n<th><strong>AWS Batch</strong></th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon SWF</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run</strong> Code (Serverless)</td>\n<td><strong>Route</strong> Events</td>\n<td><strong>Orchestrate</strong> a Workflow</td>\n<td><strong>Run</strong> Batch Jobs</td>\n<td><strong>Prepare</strong> Data (ETL)</td>\n<td><strong>Orchestrate</strong> Tasks (Legacy)</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>A single function execution</td>\n<td>The flow of events in a bus</td>\n<td>A multi-step state machine</td>\n<td>A queue of compute jobs</td>\n<td>A data transformation job</td>\n<td>A workflow with human tasks</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Real-time file processing</td>\n<td>Decoupling applications</td>\n<td>Sequencing Lambda functions</td>\n<td>Scientific computing</td>\n<td>Data warehousing prep</td>\n<td>Order processing with manual steps</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>On-call Specialist</td>\n<td>Central Post Office</td>\n<td>Assembly Line Flowchart</td>\n<td>Supercomputing Scheduler</td>\n<td>Automated Data Chef</td>\n<td>Factory Floor Manager</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Event-driven code\"</td>\n<td>\"Event bus\", \"SaaS\"</td>\n<td>\"Orchestrate workflow\"</td>\n<td>\"Long-running jobs\"</td>\n<td>\"ETL\", \"Crawler\"</td>\n<td>\"Human intervention\" (Likely a distractor)</td>\n</tr>\n</tbody></table>"
  },
  "AWS Budgets": {
    "keywords": [
      "Alerts",
      "Notifications",
      "Budget",
      "Forecasted costs",
      "Threshold",
      "Cost control",
      "Alert me if I overspend"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Pricing Calculator</strong></th>\n<th><strong>AWS Cost Explorer</strong></th>\n<th><strong>AWS Budgets</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Estimate</strong> Future Costs</td>\n<td><strong>Analyze</strong> Past Costs</td>\n<td><strong>Alert</strong> on Current/Future Costs</td>\n</tr>\n<tr>\n<td><strong>Data Timeframe</strong></td>\n<td><strong>Future</strong> (Before deployment)</td>\n<td><strong>Past</strong> (Retrospective)</td>\n<td><strong>Present &amp; Future</strong> (Real-time &amp; Forecasted)</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Provides a quote for a hypothetical workload.</td>\n<td>Creates graphs of historical spend.</td>\n<td>Sends notifications based on a threshold.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Contractor's Building Estimate</td>\n<td>Interactive Credit Card Statement</td>\n<td>Low-Balance Bank Alert</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"What <strong>will</strong> it cost?\"</td>\n<td>\"What <strong>did</strong> it cost?\"</td>\n<td>\"Am I <strong>about to</strong> overspend?\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Certificate Manager": {
    "keywords": [
      "SSL/TLS certificates",
      "HTTPS",
      "Encryption in transit",
      "Automatic renewal",
      "Free public certificates"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Firewall Manager</strong></th>\n<th><strong>License Manager</strong></th>\n<th><strong>Data Lifecycle Manager</strong></th>\n<th><strong>Certificate Manager</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Central Firewall Mgmt</strong></td>\n<td><strong>Central License Mgmt</strong></td>\n<td><strong>Automated EBS Backup Mgmt</strong></td>\n<td><strong>Central SSL/TLS Cert Mgmt</strong></td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>WAF, Shield, Network Firewall Rules</td>\n<td>Software Licenses (e.g., Microsoft, Oracle)</td>\n<td>EBS Snapshots &amp; AMIs</td>\n<td>SSL/TLS Certificates</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Consistent security across accounts</td>\n<td>License compliance &amp; cost control</td>\n<td>Backup automation &amp; retention</td>\n<td>HTTPS deployment &amp; renewal</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Across my Organization\"</td>\n<td>\"BYOL\", \"Track licenses\"</td>\n<td>\"Automate snapshots\"</td>\n<td>\"HTTPS\", \"SSL\", \"Auto-renewal\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Cloud9": {
    "keywords": [
      "Cloud IDE",
      "Web browser",
      "Code editor",
      "Debugger",
      "Terminal",
      "Pre-configured with AWS tools"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon SDK</strong></th>\n<th><strong>AWS Cloud9</strong></th>\n<th><strong>AWS CodeCommit</strong></th>\n<th><strong>AWS CodeDeploy</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Programmatic Access</strong> (in code)</td>\n<td><strong>Develop Code</strong> (IDE)</td>\n<td><strong>Store Code</strong> (Repo)</td>\n<td><strong>Deploy Code</strong> (Automation)</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Library / Tool</td>\n<td>IDE / Platform</td>\n<td>Source Control</td>\n<td>Deployment Service</td>\n</tr>\n<tr>\n<td><strong>Where it's Used</strong></td>\n<td>Inside your application</td>\n<td>In a web browser</td>\n<td>On a developer's machine (Git CLI)</td>\n<td>In a CI/CD pipeline</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Application Developer</td>\n<td>Application Developer</td>\n<td>Application Developer</td>\n<td>DevOps Engineer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Call AWS from my code\"</td>\n<td>\"IDE in the browser\"</td>\n<td>\"Private Git repo\"</td>\n<td>\"Automate deployment\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS CloudFormation": {
    "keywords": [
      "Infrastructure as Code (IaC)",
      "Templates",
      "Provisioning",
      "Stacks",
      "Repeatable deployment",
      "Standardize environments"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudFormation</strong></th>\n<th><strong>Amazon CloudWatch</strong></th>\n<th><strong>AWS CloudTrail</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Provision</strong> Infrastructure (IaC)</td>\n<td><strong>Monitor</strong> Resource Performance</td>\n<td><strong>Audit</strong> Account Activity</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Builds, updates, and deletes resources from a template.</td>\n<td>Collects metrics, logs, and events; sets alarms.</td>\n<td>Records a history of all API calls.</td>\n</tr>\n<tr>\n<td><strong>Answers...</strong></td>\n<td>\"How do I build it?\"</td>\n<td>\"How is it running?\"</td>\n<td>\"Who did what?\"</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Master Blueprint</td>\n<td>The Car's Dashboard</td>\n<td>The Security Logbook</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Template\", \"IaC\"</td>\n<td>\"Metrics\", \"Alarms\", \"Logs\"</td>\n<td>\"API calls\", \"Audit trail\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS CloudHSM": {
    "keywords": [
      "Hardware Security Module (HSM)",
      "Single-tenant",
      "Dedicated hardware",
      "Compliance",
      "FIPS 140-2 Level 3",
      "Manage your own keys"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudHSM</strong></th>\n<th><strong>AWS Artifact</strong></th>\n<th><strong>Amazon Cognito</strong></th>\n<th><strong>AWS Directory Service</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Hardware</strong> Key Management</td>\n<td><strong>AWS</strong> Compliance Documents</td>\n<td><strong>Customer</strong> Identity Mgmt</td>\n<td><strong>Workforce</strong> Identity Mgmt</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Security</td>\n<td>Compliance</td>\n<td>Security / Application</td>\n<td>Security / Identity</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Dedicated HSMs for keys</td>\n<td>PDF/JSON compliance reports</td>\n<td>User pools for your app's customers</td>\n<td>Microsoft Active Directory for employees</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Compliance/Security Officer</td>\n<td>Auditor / Compliance Officer</td>\n<td>Application Developer</td>\n<td>IT / Systems Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Single-tenant HSM\"</td>\n<td>\"Get AWS's SOC report\"</td>\n<td>\"Mobile app user login\"</td>\n<td>\"Microsoft AD for employees\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS CloudTrail": {
    "keywords": [
      "Audit trail",
      "API call logging",
      "Who did what, when",
      "Governance",
      "Compliance",
      "Event history"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudFormation</strong></th>\n<th><strong>Amazon CloudWatch</strong></th>\n<th><strong>AWS CloudTrail</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Provision</strong> Infrastructure (IaC)</td>\n<td><strong>Monitor</strong> Resource Performance</td>\n<td><strong>Audit</strong> Account Activity</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Builds, updates, and deletes resources from a template.</td>\n<td>Collects metrics, logs, and events; sets alarms.</td>\n<td>Records a history of all API calls.</td>\n</tr>\n<tr>\n<td><strong>Answers...</strong></td>\n<td>\"How do I build it?\"</td>\n<td>\"How is it running?\"</td>\n<td>\"Who did what?\"</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Master Blueprint</td>\n<td>The Car's Dashboard</td>\n<td>The Security Logbook</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Template\", \"IaC\"</td>\n<td>\"Metrics\", \"Alarms\", \"Logs\"</td>\n<td>\"API calls\", \"Audit trail\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS CodeCommit": {
    "keywords": [
      "Source control",
      "Private Git repository",
      "Version control",
      "Store code"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon SDK</strong></th>\n<th><strong>AWS Cloud9</strong></th>\n<th><strong>AWS CodeCommit</strong></th>\n<th><strong>AWS CodeDeploy</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Programmatic Access</strong> (in code)</td>\n<td><strong>Develop Code</strong> (IDE)</td>\n<td><strong>Store Code</strong> (Repo)</td>\n<td><strong>Deploy Code</strong> (Automation)</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Library / Tool</td>\n<td>IDE / Platform</td>\n<td>Source Control</td>\n<td>Deployment Service</td>\n</tr>\n<tr>\n<td><strong>Where it's Used</strong></td>\n<td>Inside your application</td>\n<td>In a web browser</td>\n<td>On a developer's machine (Git CLI)</td>\n<td>In a CI/CD pipeline</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Application Developer</td>\n<td>Application Developer</td>\n<td>Application Developer</td>\n<td>DevOps Engineer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Call AWS from my code\"</td>\n<td>\"IDE in the browser\"</td>\n<td>\"Private Git repo\"</td>\n<td>\"Automate deployment\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS CodeDeploy": {
    "keywords": [
      "Automate deployments",
      "EC2 instances",
      "On-premises servers",
      "Lambda",
      "Fargate",
      "Minimize downtime"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon SDK</strong></th>\n<th><strong>AWS Cloud9</strong></th>\n<th><strong>AWS CodeCommit</strong></th>\n<th><strong>AWS CodeDeploy</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Programmatic Access</strong> (in code)</td>\n<td><strong>Develop Code</strong> (IDE)</td>\n<td><strong>Store Code</strong> (Repo)</td>\n<td><strong>Deploy Code</strong> (Automation)</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Library / Tool</td>\n<td>IDE / Platform</td>\n<td>Source Control</td>\n<td>Deployment Service</td>\n</tr>\n<tr>\n<td><strong>Where it's Used</strong></td>\n<td>Inside your application</td>\n<td>In a web browser</td>\n<td>On a developer's machine (Git CLI)</td>\n<td>In a CI/CD pipeline</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Application Developer</td>\n<td>Application Developer</td>\n<td>Application Developer</td>\n<td>DevOps Engineer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Call AWS from my code\"</td>\n<td>\"IDE in the browser\"</td>\n<td>\"Private Git repo\"</td>\n<td>\"Automate deployment\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS CodePipeline": {
    "keywords": [
      "CI/CD",
      "Orchestration",
      "Automate release process",
      "Workflow",
      "Source/Build/Test/Deploy stages"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CodeCommit</strong></th>\n<th><strong>AWS CodePipeline</strong></th>\n<th><strong>AWS CodeDeploy</strong></th>\n<th><strong>AWS DataSync</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Store</strong> Source Code</td>\n<td><strong>Orchestrate</strong> Release Workflow</td>\n<td><strong>Deploy</strong> Application Code</td>\n<td><strong>Transfer</strong> Bulk Data</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Git Repositories</td>\n<td>CI/CD Pipelines</td>\n<td>Application Deployments</td>\n<td>Data Transfer Tasks</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Version Control</td>\n<td>CI/CD Automation</td>\n<td>Application Release</td>\n<td><strong>Data Migration</strong></td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Developer</td>\n<td>DevOps Engineer</td>\n<td>DevOps Engineer</td>\n<td>IT / Storage Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Git repo\"</td>\n<td>\"CI/CD\", \"Orchestrate\"</td>\n<td>\"Automate deployment\"</td>\n<td>\"Move data from on-prem\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Compute Optimizer": {
    "keywords": [
      "Right-sizing",
      "Recommendations",
      "Over-provisioned",
      "Under-provisioned",
      "Improve performance",
      "Lower costs"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS App Runner</strong></th>\n<th><strong>AWS Systems Manager</strong></th>\n<th><strong>AWS Compute Optimizer</strong></th>\n<th><strong>AWS Pricing Calculator</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Deploy</strong> Containerized Web Apps</td>\n<td><strong>Manage</strong> a Fleet of Servers</td>\n<td><strong>Recommend</strong> Right-Sized Resources</td>\n<td><strong>Estimate</strong> Future Costs</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Application / PaaS</td>\n<td>Operations / Management</td>\n<td>Cost Optimization</td>\n<td>Cost Management</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Simplicity and speed of deployment.</td>\n<td>Operational efficiency at scale.</td>\n<td>Cost savings and performance improvement.</td>\n<td>Financial planning and budgeting.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Automated App Vending Machine</td>\n<td>Central Command Center</td>\n<td>AI-Powered Efficiency Consultant</td>\n<td>Contractor's Building Estimate</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Easiest way to deploy a container\"</td>\n<td>\"Patch/manage my server fleet\"</td>\n<td>\"Right-sizing recommendations\"</td>\n<td>\"Estimate costs for a new project\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Config": {
    "keywords": [
      "Resource inventory",
      "Configuration history",
      "Change management",
      "Compliance auditing",
      "Track changes"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Config</strong></th>\n<th><strong>AWS Service Catalog</strong></th>\n<th><strong>AWS OpsWorks</strong></th>\n<th><strong>AWS CodeDeploy</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Audit &amp; Record</strong> Configuration</td>\n<td><strong>Govern &amp; Provision</strong> Services</td>\n<td><strong>Enforce &amp; Manage</strong> Server State</td>\n<td><strong>Automate &amp; Manage</strong> Deployments</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>The state of existing resources</td>\n<td>A catalog of approved products</td>\n<td>Server configuration via Chef/Puppet</td>\n<td>The application release process</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Auditor / Security Engineer</td>\n<td>Cloud Admin / End-user</td>\n<td>DevOps Engineer / SysAdmin</td>\n<td>DevOps Engineer / Release Manager</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Track changes\", \"Compliance\"</td>\n<td>\"Approved products\", \"Self-service\"</td>\n<td><strong>\"Chef\"</strong>, <strong>\"Puppet\"</strong></td>\n<td>\"Minimize downtime\", \"Deploy\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Cost Explorer": {
    "keywords": [
      "Visualize costs",
      "Analyze spending",
      "Reports and graphs",
      "Retrospective",
      "Visualize my bill"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Cost Explorer</strong></th>\n<th><strong>AWS Budgets</strong></th>\n<th><strong>AWS Trusted Advisor</strong></th>\n<th><strong>Amazon QuickSight</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Analyze</strong> Past Costs</td>\n<td><strong>Alert</strong> on Future Costs</td>\n<td><strong>Recommend</strong> Optimizations</td>\n<td><strong>Visualize</strong> Any Data</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Creates graphs of historical spend.</td>\n<td>Sends notifications based on thresholds.</td>\n<td>Checks account against best practices.</td>\n<td>Creates interactive BI dashboards.</td>\n</tr>\n<tr>\n<td><strong>Scope</strong></td>\n<td>AWS Cost &amp; Usage Data Only</td>\n<td>AWS Cost &amp; Usage Data Only</td>\n<td><strong>Entire AWS Account</strong> (5 Pillars)</td>\n<td><strong>Any Data Source</strong> (AWS, On-Prem, etc.)</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Interactive Credit Card Statement</td>\n<td>Low-Balance Bank Alert</td>\n<td>Expert Home Inspector</td>\n<td>Professional Graphic Design Studio</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Visualize my bill\"</td>\n<td>\"Alert me if I overspend\"</td>\n<td>\"Give me recommendations\"</td>\n<td>\"Create a BI dashboard\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS DataSync": {
    "keywords": [
      "Data transfer",
      "On-premises to AWS",
      "Accelerate",
      "Automate",
      "Move data from on-prem"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CodeCommit</strong></th>\n<th><strong>AWS CodePipeline</strong></th>\n<th><strong>AWS CodeDeploy</strong></th>\n<th><strong>AWS DataSync</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Store</strong> Source Code</td>\n<td><strong>Orchestrate</strong> Release Workflow</td>\n<td><strong>Deploy</strong> Application Code</td>\n<td><strong>Transfer</strong> Bulk Data</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Git Repositories</td>\n<td>CI/CD Pipelines</td>\n<td>Application Deployments</td>\n<td>Data Transfer Tasks</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Version Control</td>\n<td>CI/CD Automation</td>\n<td>Application Release</td>\n<td><strong>Data Migration</strong></td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Developer</td>\n<td>DevOps Engineer</td>\n<td>DevOps Engineer</td>\n<td>IT / Storage Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Git repo\"</td>\n<td>\"CI/CD\", \"Orchestrate\"</td>\n<td>\"Automate deployment\"</td>\n<td>\"Move data from on-prem\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Database Migration Service": {
    "keywords": [
      "Migrate databases",
      "Minimal downtime",
      "Change Data Capture (CDC)",
      "Replication",
      "Heterogeneous migration",
      "AWS Schema Conversion Tool (SCT)"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Database Migration Service (DMS)</strong></th>\n<th><strong>AWS Schema Conversion Tool (SCT)</strong></th>\n<th><strong>AWS Application Migration Service (MGN)</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Migrate &amp; Replicate Data</strong></td>\n<td><strong>Convert Database Schema</strong></td>\n<td><strong>Migrate Servers (VMs)</strong></td>\n</tr>\n<tr>\n<td><strong>What it Moves</strong></td>\n<td>The <strong>data</strong> inside the tables.</td>\n<td>The <strong>structure</strong> of the tables, views, procedures.</td>\n<td>The entire virtual machine (OS, apps, data).</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Minimal downtime database migration.</td>\n<td>A required pre-requisite for heterogeneous migrations.</td>\n<td>\"Lift-and-shift\" server migration.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Intelligent Data Moving Company</td>\n<td>The Document Language Translator</td>\n<td>The Magical Server Cloning Machine</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Migrate a database\"</td>\n<td>\"Convert Oracle to PostgreSQL\"</td>\n<td>\"Migrate a VMware virtual machine\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Device Farm": {
    "keywords": [
      "Test mobile apps",
      "Real physical devices",
      "iOS, Android",
      "Improve app quality"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Fargate</strong></th>\n<th><strong>AWS Outposts</strong></th>\n<th><strong>AWS Ground Station</strong></th>\n<th><strong>AWS Device Farm</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run Containers</strong> (Serverless)</td>\n<td><strong>Run AWS</strong> (On-Premises)</td>\n<td><strong>Communicate with Satellites</strong></td>\n<td><strong>Test Mobile Apps</strong></td>\n</tr>\n<tr>\n<td><strong>Domain</strong></td>\n<td>Compute</td>\n<td>Hybrid Cloud</td>\n<td>Satellite Communications</td>\n<td>Application Testing</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>The servers for your containers.</td>\n<td>AWS hardware in your data center.</td>\n<td>A global network of antennas.</td>\n<td>A fleet of physical phones/tablets.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Valet Parking for Containers</td>\n<td>AWS Embassy in Your Data Center</td>\n<td>Global Satellite Dish Network for Rent</td>\n<td>The Ultimate Phone Testing Lab</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Serverless containers\"</td>\n<td>\"Run AWS on-premises\"</td>\n<td><strong>\"Satellite\"</strong></td>\n<td><strong>\"Test mobile apps\"</strong>, \"Real devices\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Direct Connect": {
    "keywords": [
      "Private connection",
      "Dedicated",
      "Physical fiber",
      "High bandwidth",
      "Consistent performance",
      "Bypass public internet"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Direct Connect</strong></th>\n<th><strong>AWS Site-to-Site VPN</strong></th>\n<th><strong>AWS VPC Endpoint</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Connect On-Premises to VPC</td>\n<td>Connect On-Premises to VPC</td>\n<td>Connect VPC to <strong>AWS Services</strong></td>\n</tr>\n<tr>\n<td><strong>Connection Path</strong></td>\n<td><strong>Private Physical Fiber</strong></td>\n<td><strong>Encrypted over Public Internet</strong></td>\n<td><strong>Private within AWS Network</strong></td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>High-bandwidth, consistent link</td>\n<td>Secure, cost-effective link</td>\n<td>Secure access from private subnets</td>\n</tr>\n<tr>\n<td><strong>Performance</strong></td>\n<td>Consistent, High</td>\n<td>Variable (depends on internet)</td>\n<td>Consistent, High</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Dedicated, private link\"</td>\n<td>\"Encrypted tunnel over internet\"</td>\n<td>\"Private access to S3/DynamoDB\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Directory Service": {
    "keywords": [
      "Microsoft Active Directory (AD)",
      "Workforce identities",
      "Corporate login",
      "Windows servers",
      "Microsoft AD for employees"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudHSM</strong></th>\n<th><strong>AWS Artifact</strong></th>\n<th><strong>Amazon Cognito</strong></th>\n<th><strong>AWS Directory Service</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Hardware</strong> Key Management</td>\n<td><strong>AWS</strong> Compliance Documents</td>\n<td><strong>Customer</strong> Identity Mgmt</td>\n<td><strong>Workforce</strong> Identity Mgmt</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Security</td>\n<td>Compliance</td>\n<td>Security / Application</td>\n<td>Security / Identity</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Dedicated HSMs for keys</td>\n<td>PDF/JSON compliance reports</td>\n<td>User pools for your app's customers</td>\n<td>Microsoft Active Directory for employees</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Compliance/Security Officer</td>\n<td>Auditor / Compliance Officer</td>\n<td>Application Developer</td>\n<td>IT / Systems Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Single-tenant HSM\"</td>\n<td>\"Get AWS's SOC report\"</td>\n<td>\"Mobile app user login\"</td>\n<td>\"Microsoft AD for employees\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Elastic Beanstalk": {
    "keywords": [
      "PaaS",
      "Deploy web applications",
      "Upload your code",
      "Orchestration",
      "Easy to deploy web app"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Elastic Beanstalk</strong></th>\n<th><strong>AWS CloudFormation</strong></th>\n<th><strong>AWS App Runner</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Deploy &amp; Manage</strong> Web Apps (PaaS)</td>\n<td><strong>Provision</strong> Infrastructure (IaC)</td>\n<td><strong>Deploy</strong> Containerized Web Apps</td>\n</tr>\n<tr>\n<td><strong>What You Manage</strong></td>\n<td><strong>Your Application Code</strong></td>\n<td><strong>Your Infrastructure Template</strong></td>\n<td>Your Source Code or Container Image</td>\n</tr>\n<tr>\n<td><strong>Control vs. Simplicity</strong></td>\n<td>Balanced (Easy, with some control)</td>\n<td><strong>Maximum Control</strong></td>\n<td><strong>Maximum Simplicity</strong></td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The All-in-One Caterer</td>\n<td>The Master Blueprint for the House</td>\n<td>The Automated App Vending Machine</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Easy to deploy web app\"</td>\n<td>\"Template\", \"IaC\", \"Provision\"</td>\n<td>\"Easiest way to deploy a container\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Fargate": {
    "keywords": [
      "Serverless for containers",
      "Run containers without managing servers",
      "No EC2 instances",
      "Task-level resource definition"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>ECS on EC2 Launch Type</strong></th>\n<th><strong>ECS on Fargate Launch Type</strong></th>\n</tr>\n<tr>\n<td><strong>Underlying Servers</strong></td>\n<td><strong>You provision and manage</strong> a cluster of EC2 instances.</td>\n<td><strong>There are no servers for you to manage.</strong> AWS manages them completely.</td>\n</tr>\n<tr>\n<td><strong>Control</strong></td>\n<td><strong>High.</strong> You can choose the instance type, OS, use specific GPUs, and have detailed host-level control.</td>\n<td><strong>Low.</strong> You give up host-level control in exchange for operational simplicity.</td>\n</tr>\n<tr>\n<td><strong>Responsibility</strong></td>\n<td>You are responsible for patching and securing the OS on your EC2 instances (part of the Shared Responsibility Model).</td>\n<td>AWS is responsible for patching and securing the entire underlying infrastructure.</td>\n</tr>\n<tr>\n<td><strong>Billing Model</strong></td>\n<td>You pay for the EC2 instances for as long as they are running, regardless of whether they have containers on them.</td>\n<td>You pay only for the <strong>vCPU and memory</strong> consumed by your container, for the exact duration that it runs.</td>\n</tr>\n</tbody></table>"
  },
  "AWS Firewall Manager": {
    "keywords": [
      "Central management",
      "AWS Organizations",
      "Multiple accounts",
      "Consistent security policy",
      "Across my Organization"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Firewall Manager</strong></th>\n<th><strong>License Manager</strong></th>\n<th><strong>Data Lifecycle Manager</strong></th>\n<th><strong>Certificate Manager</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Central Firewall Mgmt</strong></td>\n<td><strong>Central License Mgmt</strong></td>\n<td><strong>Automated EBS Backup Mgmt</strong></td>\n<td><strong>Central SSL/TLS Cert Mgmt</strong></td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>WAF, Shield, Network Firewall Rules</td>\n<td>Software Licenses (e.g., Microsoft, Oracle)</td>\n<td>EBS Snapshots &amp; AMIs</td>\n<td>SSL/TLS Certificates</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Consistent security across accounts</td>\n<td>License compliance &amp; cost control</td>\n<td>Backup automation &amp; retention</td>\n<td>HTTPS deployment &amp; renewal</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Across my Organization\"</td>\n<td>\"BYOL\", \"Track licenses\"</td>\n<td>\"Automate snapshots\"</td>\n<td>\"HTTPS\", \"SSL\", \"Auto-renewal\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Global Accelerator": {
    "keywords": [
      "Improve performance",
      "Improve availability",
      "Global users",
      "Static Anycast IP",
      "TCP/UDP traffic"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Global Accelerator</strong></th>\n<th><strong>Amazon Connect</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Improve Network Performance</strong></td>\n<td><strong>Provide a Cloud Contact Center</strong></td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Networking</td>\n<td>Business Application (SaaS)</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>The network path for user traffic.</td>\n<td>The entire customer service experience.</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Latency and availability for global applications.</td>\n<td>The complexity and cost of running a call center.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Internet's VIP Private Highway</td>\n<td>The Instant, Pay-as-you-go Call Center</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Static Anycast IP\", \"Global users\", \"TCP/UDP\"</td>\n<td>\"Call center\", \"IVR\", \"Customer service\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Glue": {
    "keywords": [
      "ETL",
      "Serverless",
      "Data Catalog",
      "Crawler",
      "Data preparation",
      "Prepare data for analytics"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon EMR</strong></th>\n<th><strong>Amazon Kinesis</strong></th>\n<th><strong>Amazon Athena</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Prepare &amp; Transform Data (ETL)</strong></td>\n<td><strong>Process &amp; Analyze Big Data</strong></td>\n<td><strong>Ingest &amp; Process Streaming Data</strong></td>\n<td><strong>Interactively Query Data in S3</strong></td>\n</tr>\n<tr>\n<td><strong>Compute Model</strong></td>\n<td><strong>Serverless</strong></td>\n<td><strong>Provisioned Cluster</strong></td>\n<td>Serverless Stream</td>\n<td><strong>Serverless</strong></td>\n</tr>\n<tr>\n<td><strong>Core Function</strong></td>\n<td>Data Cataloging, Schema Discovery, Data Transformation</td>\n<td>Running Spark/Hadoop jobs on a cluster</td>\n<td>Real-time data ingestion and processing</td>\n<td>Ad-hoc SQL querying</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Automated Data Chef &amp; Librarian</td>\n<td>Rentable Data Science Lab</td>\n<td>Real-time Conveyor Belt</td>\n<td>SQL-speaking Drone</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"ETL\", \"Crawler\", \"Data Catalog\"</td>\n<td>\"Hadoop\", \"Spark\", \"Cluster\"</td>\n<td>\"Real-time stream\", \"IoT\"</td>\n<td>\"SQL on S3\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Ground Station": {
    "keywords": [
      "Satellite",
      "Ground station",
      "Antennas",
      "Downlink data",
      "Space"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Fargate</strong></th>\n<th><strong>AWS Outposts</strong></th>\n<th><strong>AWS Ground Station</strong></th>\n<th><strong>AWS Device Farm</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run Containers</strong> (Serverless)</td>\n<td><strong>Run AWS</strong> (On-Premises)</td>\n<td><strong>Communicate with Satellites</strong></td>\n<td><strong>Test Mobile Apps</strong></td>\n</tr>\n<tr>\n<td><strong>Domain</strong></td>\n<td>Compute</td>\n<td>Hybrid Cloud</td>\n<td>Satellite Communications</td>\n<td>Application Testing</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>The servers for your containers.</td>\n<td>AWS hardware in your data center.</td>\n<td>A global network of antennas.</td>\n<td>A fleet of physical phones/tablets.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Valet Parking for Containers</td>\n<td>AWS Embassy in Your Data Center</td>\n<td>Global Satellite Dish Network for Rent</td>\n<td>The Ultimate Phone Testing Lab</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Serverless containers\"</td>\n<td>\"Run AWS on-premises\"</td>\n<td><strong>\"Satellite\"</strong></td>\n<td><strong>\"Test mobile apps\"</strong>, \"Real devices\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS IAM Identity Center": {
    "keywords": [
      "Single Sign-On (SSO)",
      "Centralized access",
      "Multiple accounts",
      "Workforce",
      "User portal",
      "SSO"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Organizations</strong></th>\n<th><strong>AWS Directory Service</strong></th>\n<th><strong>AWS IAM Roles</strong></th>\n<th><strong>IAM Identity Center (SSO)</strong></th>\n<th><strong>Amazon Cognito</strong></th>\n<th><strong>AWS Storage Gateway</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Govern</strong> Multiple Accounts</td>\n<td><strong>Manage</strong> Workforce Identity (AD)</td>\n<td><strong>Delegate</strong> Temporary Access</td>\n<td><strong>Provide SSO</strong> for Workforce</td>\n<td><strong>Manage</strong> Customer Identity</td>\n<td><strong>Connect</strong> On-Prem to Cloud Storage</td>\n</tr>\n<tr>\n<td><strong>Who it's for</strong></td>\n<td>Central Cloud Team</td>\n<td>IT Admins / <strong>Employees</strong></td>\n<td><strong>Applications</strong> &amp; Trusted Principals</td>\n<td><strong>Employees</strong></td>\n<td><strong>Customers</strong></td>\n<td>IT / Storage Admins</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Corporate HQ &amp; Org Chart</td>\n<td>Employee ID Card System</td>\n<td>Temporary Visitor's Pass</td>\n<td>\"Mission Control\" Login Portal</td>\n<td>Nightclub Guest Registration</td>\n<td>Magical Storage Portal</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Multi-account\", \"SCP\"</td>\n<td>\"Active Directory\", \"Employees\"</td>\n<td>\"Temporary access\", \"EC2 -&gt; S3\"</td>\n<td>\"SSO\", \"Multiple accounts\"</td>\n<td>\"Mobile app login\", \"Social\"</td>\n<td>\"Hybrid storage\", \"On-premises\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Identity and Access Management": {
    "keywords": [
      "Authentication",
      "Authorization",
      "Users",
      "Groups",
      "Roles",
      "Policies",
      "Permissions",
      "Least Privilege"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Component</th>\n<th><strong>What it is</strong></th>\n<th><strong>Primary Purpose</strong></th>\n<th><strong>Analogy</strong></th>\n</tr>\n<tr>\n<td><strong>IAM User</strong></td>\n<td>An identity for a person or service</td>\n<td>To provide long-term credentials for a principal.</td>\n<td>An employee's ID badge.</td>\n</tr>\n<tr>\n<td><strong>IAM Group</strong></td>\n<td>A collection of users</td>\n<td>To simplify permission management for many users.</td>\n<td>The \"Engineering Dept\" label on a badge.</td>\n</tr>\n<tr>\n<td><strong>IAM Policy</strong></td>\n<td>A JSON document of permissions</td>\n<td>To explicitly define <em>what</em> actions are allowed or denied.</td>\n<td>The rules programmed into the door scanners.</td>\n</tr>\n<tr>\n<td><strong>IAM Role</strong></td>\n<td>An identity to be assumed</td>\n<td>To provide <strong>secure, temporary, delegated</strong> access.</td>\n<td>A temporary \"Visitor's Pass.\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Key Management Service": {
    "keywords": [
      "Encryption",
      "Cryptographic Keys",
      "Customer Master Key (CMK)",
      "Encrypt data at rest",
      "Envelope Encryption",
      "Encryption keys"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CLI</strong></th>\n<th><strong>AWS KMS</strong></th>\n<th><strong>AWS Secrets Manager</strong></th>\n<th><strong>AWS Mgmt Console</strong></th>\n<th><strong>AWS RAM</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Automate</strong> via Command Line</td>\n<td><strong>Manage</strong> Encryption Keys</td>\n<td><strong>Manage &amp; Rotate</strong> Secrets</td>\n<td><strong>Manage</strong> via a GUI</td>\n<td><strong>Share</strong> Resources Across Accounts</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Management Tool</td>\n<td>Security</td>\n<td>Security</td>\n<td>Management Tool</td>\n<td>Management &amp; Governance</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Mechanic's Command Terminal</td>\n<td>Bank's Safe Deposit Box Service</td>\n<td>Automated Password Manager</td>\n<td>Master Control Panel</td>\n<td>Inter-Office Library Card</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Scripting\"</td>\n<td>\"Encryption keys\", \"CMK\"</td>\n<td><strong>\"Rotate database passwords\"</strong></td>\n<td>\"Web browser\", \"GUI\"</td>\n<td><strong>\"Share resources\"</strong>, \"Cross-account\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Lambda": {
    "keywords": [
      "Serverless",
      "Event-driven",
      "Function as a Service (FaaS)",
      "Run code without servers",
      "Pay per execution/duration",
      "Short-running",
      "Stateless"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Lambda</strong></th>\n<th><strong>Amazon EC2</strong></th>\n<th><strong>AWS Fargate</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Serverless Function</strong> Execution</td>\n<td><strong>Virtual Servers</strong> (IaaS)</td>\n<td><strong>Serverless Container</strong> Execution</td>\n</tr>\n<tr>\n<td><strong>Unit of Work</strong></td>\n<td><strong>Code Function</strong></td>\n<td>Full Virtual Machine (OS)</td>\n<td>Docker Container</td>\n</tr>\n<tr>\n<td><strong>Management</strong></td>\n<td><strong>AWS manages everything</strong></td>\n<td><strong>You manage OS</strong> and application</td>\n<td><strong>AWS manages underlying host</strong></td>\n</tr>\n<tr>\n<td><strong>Billing Model</strong></td>\n<td><strong>Pay per execution &amp; duration (ms)</strong></td>\n<td>Pay per second for running instance</td>\n<td>Pay per second for container vCPU/memory</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The on-call specialist surgeon</td>\n<td>The full-time staff doctor</td>\n<td>The valet parking for containers</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Event-driven\", \"Serverless code\"</td>\n<td>\"Virtual server\", \"Full control\"</td>\n<td>\"Serverless containers\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS License Manager": {
    "keywords": [
      "Software licenses",
      "BYOL",
      "Compliance",
      "Track usage",
      "Prevent overages",
      "Central management",
      "Track licenses"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Firewall Manager</strong></th>\n<th><strong>License Manager</strong></th>\n<th><strong>Data Lifecycle Manager</strong></th>\n<th><strong>Certificate Manager</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Central Firewall Mgmt</strong></td>\n<td><strong>Central License Mgmt</strong></td>\n<td><strong>Automated EBS Backup Mgmt</strong></td>\n<td><strong>Central SSL/TLS Cert Mgmt</strong></td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>WAF, Shield, Network Firewall Rules</td>\n<td>Software Licenses (e.g., Microsoft, Oracle)</td>\n<td>EBS Snapshots &amp; AMIs</td>\n<td>SSL/TLS Certificates</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Consistent security across accounts</td>\n<td>License compliance &amp; cost control</td>\n<td>Backup automation &amp; retention</td>\n<td>HTTPS deployment &amp; renewal</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Across my Organization\"</td>\n<td>\"BYOL\", \"Track licenses\"</td>\n<td>\"Automate snapshots\"</td>\n<td>\"HTTPS\", \"SSL\", \"Auto-renewal\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Network Firewall": {
    "keywords": [
      "Managed network firewall",
      "VPC protection",
      "Stateful inspection",
      "Intrusion Prevention System (IPS)",
      "Web filtering",
      "VPC firewall"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Network Firewall</strong></th>\n<th><strong>Amazon Route 53</strong></th>\n<th><strong>AWS Shield Advanced</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Prevent</strong> unwanted network traffic.</td>\n<td><strong>Resolve</strong> DNS queries &amp; route users.</td>\n<td><strong>Prevent</strong> large-scale DDoS attacks.</td>\n<td><strong>Detect</strong> malicious account activity.</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Networking / Security</td>\n<td>Networking / DNS</td>\n<td>Security</td>\n<td>Security</td>\n</tr>\n<tr>\n<td><strong>Mechanism</strong></td>\n<td>Stateful firewall with IPS &amp; web filtering.</td>\n<td>DNS resolution with smart routing policies.</td>\n<td>Volumetric traffic scrubbing at the edge.</td>\n<td><strong>Intelligent log analysis (ML)</strong></td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Central Security Checkpoint</td>\n<td>Smart GPS System</td>\n<td>Elite Private Security Firm</td>\n<td>AI-Powered SOC</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"VPC firewall\", \"IPS\"</td>\n<td>\"DNS\", \"Domain name\"</td>\n<td>\"Advanced DDoS\", \"DRT\"</td>\n<td>\"Threat detection\", \"Anomalous\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Organizations": {
    "keywords": [
      "Multi-account management",
      "Central governance",
      "Consolidated Billing",
      "Organizational Unit (OU)",
      "Service Control Policy (SCP)"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Budgets</strong></th>\n<th><strong>AWS Organizations</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Cost &amp; Usage Alerting</strong></td>\n<td><strong>Central Account Governance &amp; Management</strong></td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Budget thresholds and notifications.</td>\n<td>The structure and policies for multiple AWS accounts.</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Preventing cost overruns.</td>\n<td>Scalable governance, consolidated billing, and security guardrails.</td>\n</tr>\n<tr>\n<td><strong>Key Component(s)</strong></td>\n<td>Budgets, Alerts, Actions</td>\n<td>Management/Member Accounts, OUs, SCPs</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Credit Card Alert System</td>\n<td>Corporate Headquarters &amp; Org Chart</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Alert me if I overspend\"</td>\n<td>\"Manage all my company's accounts\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Outposts": {
    "keywords": [
      "Hybrid cloud",
      "On-premises",
      "Low latency",
      "Local data processing",
      "Run AWS in our own data center"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Region</strong></th>\n<th><strong>Availability Zone (AZ)</strong></th>\n<th><strong>Edge Location</strong></th>\n<th><strong>AWS Outposts</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Data Sovereignty / Geographic Presence</td>\n<td>High Availability / Fault Tolerance</td>\n<td>Low-Latency Content Delivery</td>\n<td>Hybrid Cloud / On-Premises</td>\n</tr>\n<tr>\n<td><strong>Location</strong></td>\n<td>Geographic area (e.g., a country)</td>\n<td>A data center within a Region</td>\n<td>A small POP in a major city</td>\n<td><strong>At the customer's site</strong></td>\n</tr>\n<tr>\n<td><strong>Can you run EC2?</strong></td>\n<td><strong>Yes</strong></td>\n<td><strong>Yes</strong></td>\n<td>No</td>\n<td><strong>Yes</strong></td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Architect choosing where to build</td>\n<td>Architect building resilient apps</td>\n<td>Web developer speeding up a site</td>\n<td>Architect solving a hybrid problem</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Keep data in Germany\"</td>\n<td>\"Withstand a DC failure\"</td>\n<td>\"Speed up website for global users\"</td>\n<td>\"Run AWS in our own data center\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS PrivateLink": {
    "keywords": [
      "Private connectivity",
      "Securely expose a service",
      "VPC Endpoint Service",
      "One-way connection",
      "No internet",
      "Privately consume a service"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS PrivateLink (via Interface Endpoint)</strong></th>\n<th><strong>VPC Peering</strong></th>\n<th><strong>NAT Gateway</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Private, one-way access to a specific service.</strong></td>\n<td><strong>Private, two-way access between two full VPCs.</strong></td>\n<td><strong>Public, one-way access from a private subnet to the internet.</strong></td>\n</tr>\n<tr>\n<td><strong>Traffic Path</strong></td>\n<td><strong>Stays on the AWS private network.</strong></td>\n<td>Stays on the AWS private network.</td>\n<td><strong>Goes to the public internet.</strong></td>\n</tr>\n<tr>\n<td><strong>Overlapping IPs?</strong></td>\n<td><strong>No problem.</strong></td>\n<td><strong>Not allowed.</strong> This is a major limitation.</td>\n<td>Not applicable.</td>\n</tr>\n<tr>\n<td><strong>Security</strong></td>\n<td><strong>High.</strong> Unidirectional, no network exposure.</td>\n<td><strong>Medium.</strong> Bi-directional, exposes networks to each other.</td>\n<td><strong>Medium.</strong> Protects from inbound connections.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Secure Pneumatic Tube</td>\n<td>Private Bridge Between Castles</td>\n<td>Office Mailroom PO Box</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Privately consume a service\"</td>\n<td>\"Connect two VPCs\"</td>\n<td>\"Private subnet needs internet access\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Secrets Manager": {
    "keywords": [
      "Secrets",
      "Database credentials",
      "API keys",
      "Automatic rotation",
      "Rotate database passwords"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CLI</strong></th>\n<th><strong>AWS KMS</strong></th>\n<th><strong>AWS Secrets Manager</strong></th>\n<th><strong>AWS Mgmt Console</strong></th>\n<th><strong>AWS RAM</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Automate</strong> via Command Line</td>\n<td><strong>Manage</strong> Encryption Keys</td>\n<td><strong>Manage &amp; Rotate</strong> Secrets</td>\n<td><strong>Manage</strong> via a GUI</td>\n<td><strong>Share</strong> Resources Across Accounts</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Management Tool</td>\n<td>Security</td>\n<td>Security</td>\n<td>Management Tool</td>\n<td>Management &amp; Governance</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Mechanic's Command Terminal</td>\n<td>Bank's Safe Deposit Box Service</td>\n<td>Automated Password Manager</td>\n<td>Master Control Panel</td>\n<td>Inter-Office Library Card</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Scripting\"</td>\n<td>\"Encryption keys\", \"CMK\"</td>\n<td><strong>\"Rotate database passwords\"</strong></td>\n<td>\"Web browser\", \"GUI\"</td>\n<td><strong>\"Share resources\"</strong>, \"Cross-account\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Security Hub": {
    "keywords": [
      "Single pane of glass",
      "Aggregate findings",
      "Centralize security alerts",
      "Security posture management (CSPM)",
      "Compliance checks"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Shield</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n<th><strong>Amazon Detective</strong></th>\n<th><strong>AWS Security Hub</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Prevent</strong> DDoS Attacks</td>\n<td><strong>Detect</strong> Active Threats</td>\n<td><strong>Investigate</strong> Threat Root Cause</td>\n<td><strong>Aggregate &amp; Manage</strong> Security Posture</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Blocks volumetric traffic</td>\n<td>Analyzes logs to find threats</td>\n<td>Visualizes log data for investigation</td>\n<td>Centralizes findings &amp; runs compliance checks</td>\n</tr>\n<tr>\n<td><strong>Input</strong></td>\n<td>Network Traffic</td>\n<td><strong>Logs</strong> (CloudTrail, VPC, DNS)</td>\n<td><strong>GuardDuty Findings</strong> &amp; Logs</td>\n<td><strong>Findings</strong> from GuardDuty, Inspector, Macie, etc.</td>\n</tr>\n<tr>\n<td><strong>Output</strong></td>\n<td>Attack Mitigation</td>\n<td><strong>Findings</strong> (Alerts)</td>\n<td>An interactive graph/dashboard</td>\n<td>A prioritized list of findings</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Riot Control Squad</td>\n<td>AI-powered Security Cameras</td>\n<td>Forensic Investigation Kit</td>\n<td>Central Command Center Dashboard</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"DDoS\"</td>\n<td>\"Detect anomalous activity\"</td>\n<td>\"Investigate a finding\"</td>\n<td>\"Single pane of glass\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Service Catalog": {
    "keywords": [
      "Governance",
      "Standardization",
      "Approved services",
      "Catalog",
      "Portfolio",
      "Products",
      "Self-service"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Service Catalog</strong></th>\n<th><strong>AWS Budgets</strong></th>\n<th><strong>AWS Config</strong></th>\n<th><strong>Service Quotas</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Govern</strong> what users can launch.</td>\n<td><strong>Alert</strong> on cost &amp; usage.</td>\n<td><strong>Audit</strong> what users have launched.</td>\n<td><strong>Limit</strong> how many resources can be launched.</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>A portfolio of approved products.</td>\n<td>Budget thresholds and notifications.</td>\n<td>The configuration state of resources.</td>\n<td>The maximum number of resources.</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Standardization &amp; Self-service.</td>\n<td>Cost Control &amp; Awareness.</td>\n<td>Compliance &amp; Change Tracking.</td>\n<td>Operational Boundaries.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Company App Store</td>\n<td>Credit Card Alert System</td>\n<td>City Planning Historian</td>\n<td>Bank Account Withdrawal Limit</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Approved products\"</td>\n<td>\"Alert me if I overspend\"</td>\n<td>\"Track changes\"</td>\n<td>\"Request a limit increase\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Shield": {
    "keywords": [
      "DDoS protection",
      "Traffic flood",
      "Availability",
      "Shield Standard",
      "Shield Advanced",
      "Protect against DDoS"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS WAF</strong></th>\n<th><strong>AWS Shield</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Filter Malicious <strong>Content</strong></td>\n<td>Block Malicious <strong>Volume</strong></td>\n<td>Detect Malicious <strong>Activity</strong></td>\n</tr>\n<tr>\n<td><strong>Layer of Operation</strong></td>\n<td><strong>Layer 7 (Application)</strong></td>\n<td><strong>Layer 3/4 (Network/Transport)</strong></td>\n<td><strong>Account / Log Analysis</strong></td>\n</tr>\n<tr>\n<td><strong>Protects Against</strong></td>\n<td>SQL Injection, XSS</td>\n<td>DDoS Attacks</td>\n<td>Compromised credentials, Malware</td>\n</tr>\n<tr>\n<td><strong>Mechanism</strong></td>\n<td>Rule-based content inspection</td>\n<td>Traffic scrubbing &amp; absorption</td>\n<td><strong>Intelligent log analysis (ML)</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Protect my web application\"</td>\n<td>\"Protect against DDoS\"</td>\n<td>\"Detect threats in my account\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Snowball Edge": {
    "keywords": [
      "Offline data transfer",
      "Petabyte-scale",
      "Edge compute",
      "Disconnected environment",
      "Rugged",
      "Physical device"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Snowcone</strong></th>\n<th><strong>AWS Snowball Edge</strong></th>\n<th><strong>AWS Snowmobile</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Small-scale Edge Compute &amp; Data Transfer</td>\n<td>Large-scale Edge Compute &amp; Data Transfer</td>\n<td><strong>Massive-scale</strong> Data Transfer Only</td>\n</tr>\n<tr>\n<td><strong>Data Scale</strong></td>\n<td>Up to <strong>~8 TB</strong></td>\n<td>Up to <strong>~210 TB</strong></td>\n<td>Up to <strong>100 PB</strong> (Petabytes)</td>\n</tr>\n<tr>\n<td><strong>Physical Size</strong></td>\n<td>Small box (fits in a backpack)</td>\n<td>Large suitcase (~50 lbs)</td>\n<td><strong>45-foot shipping container</strong></td>\n</tr>\n<tr>\n<td><strong>Compute?</strong></td>\n<td>Yes (basic)</td>\n<td>Yes (powerful, optional GPU)</td>\n<td><strong>No</strong></td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Rugged portable drive with a PC</td>\n<td>Portable data center in a suitcase</td>\n<td>Data center on a truck</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Portable\", \"Drone\", \"Small data\"</td>\n<td>\"Terabytes\", \"Disconnected compute\"</td>\n<td><strong>\"Petabytes\"</strong>, <strong>\"Exabytes\"</strong></td>\n</tr>\n</tbody></table>"
  },
  "AWS Step Functions": {
    "keywords": [
      "Orchestration",
      "Workflow",
      "State machine",
      "Visual workflow",
      "Sequence Lambda functions",
      "Orchestrate workflow"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Lambda</strong></th>\n<th><strong>Amazon EventBridge</strong></th>\n<th><strong>AWS Step Functions</strong></th>\n<th><strong>AWS Batch</strong></th>\n<th><strong>AWS Glue</strong></th>\n<th><strong>Amazon SWF</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Run</strong> Code (Serverless)</td>\n<td><strong>Route</strong> Events</td>\n<td><strong>Orchestrate</strong> a Workflow</td>\n<td><strong>Run</strong> Batch Jobs</td>\n<td><strong>Prepare</strong> Data (ETL)</td>\n<td><strong>Orchestrate</strong> Tasks (Legacy)</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>A single function execution</td>\n<td>The flow of events in a bus</td>\n<td>A multi-step state machine</td>\n<td>A queue of compute jobs</td>\n<td>A data transformation job</td>\n<td>A workflow with human tasks</td>\n</tr>\n<tr>\n<td><strong>Use Case</strong></td>\n<td>Real-time file processing</td>\n<td>Decoupling applications</td>\n<td>Sequencing Lambda functions</td>\n<td>Scientific computing</td>\n<td>Data warehousing prep</td>\n<td>Order processing with manual steps</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>On-call Specialist</td>\n<td>Central Post Office</td>\n<td>Assembly Line Flowchart</td>\n<td>Supercomputing Scheduler</td>\n<td>Automated Data Chef</td>\n<td>Factory Floor Manager</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Event-driven code\"</td>\n<td>\"Event bus\", \"SaaS\"</td>\n<td>\"Orchestrate workflow\"</td>\n<td>\"Long-running jobs\"</td>\n<td>\"ETL\", \"Crawler\"</td>\n<td>\"Human intervention\" (Likely a distractor)</td>\n</tr>\n</tbody></table>"
  },
  "AWS Storage Gateway": {
    "keywords": [
      "Hybrid cloud storage",
      "Connect on-premises to cloud storage",
      "File Gateway (NFS/SMB)",
      "Volume Gateway (iSCSI)",
      "Tape Gateway"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Amazon Connect</strong></th>\n<th><strong>AWS Global Accelerator</strong></th>\n<th><strong>Amazon Lightsail</strong></th>\n<th><strong>AWS Storage Gateway</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Cloud Contact Center</td>\n<td>Improve Global Network Performance</td>\n<td>Simple Virtual Private Server (VPS)</td>\n<td><strong>Hybrid Cloud Storage</strong></td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Application (SaaS)</td>\n<td>Networking</td>\n<td>Compute / Platform</td>\n<td>Storage / Hybrid</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>Customer Service Manager</td>\n<td>Network Engineer / Architect</td>\n<td>Developer / New User</td>\n<td>IT / Storage Administrator</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Call center\", \"IVR\"</td>\n<td>\"Static Anycast IP\", \"Global users\"</td>\n<td>\"Easy VPS\", \"Predictable price\"</td>\n<td>\"On-premises to cloud storage\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Systems Manager": {
    "keywords": [
      "Operational management",
      "Patch management",
      "Run Command",
      "Inventory",
      "Session Manager",
      "Parameter Store",
      "Patch/manage my server fleet"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS App Runner</strong></th>\n<th><strong>AWS Systems Manager</strong></th>\n<th><strong>AWS Compute Optimizer</strong></th>\n<th><strong>AWS Pricing Calculator</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Deploy</strong> Containerized Web Apps</td>\n<td><strong>Manage</strong> a Fleet of Servers</td>\n<td><strong>Recommend</strong> Right-Sized Resources</td>\n<td><strong>Estimate</strong> Future Costs</td>\n</tr>\n<tr>\n<td><strong>Category</strong></td>\n<td>Application / PaaS</td>\n<td>Operations / Management</td>\n<td>Cost Optimization</td>\n<td>Cost Management</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Simplicity and speed of deployment.</td>\n<td>Operational efficiency at scale.</td>\n<td>Cost savings and performance improvement.</td>\n<td>Financial planning and budgeting.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Automated App Vending Machine</td>\n<td>Central Command Center</td>\n<td>AI-Powered Efficiency Consultant</td>\n<td>Contractor's Building Estimate</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Easiest way to deploy a container\"</td>\n<td>\"Patch/manage my server fleet\"</td>\n<td>\"Right-sizing recommendations\"</td>\n<td>\"Estimate costs for a new project\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Transit Gateway": {
    "keywords": [
      "Hub and spoke",
      "Simplify network topology",
      "Scale connectivity",
      "Regional network router",
      "Transitive routing",
      "Connect many VPCs"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Transit Gateway</strong></th>\n<th><strong>VPC Peering</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Central Network Hub</strong> (Cloud Router)</td>\n<td><strong>1-to-1</strong> VPC Connection</td>\n</tr>\n<tr>\n<td><strong>Topology</strong></td>\n<td><strong>Hub and Spoke</strong></td>\n<td><strong>Point-to-Point Mesh</strong></td>\n</tr>\n<tr>\n<td><strong>Scalability</strong></td>\n<td><strong>High.</strong> Scales easily to thousands of VPCs.</td>\n<td><strong>Low.</strong> Becomes exponentially complex to manage.</td>\n</tr>\n<tr>\n<td><strong>Routing</strong></td>\n<td><strong>Transitive.</strong> (A -&gt; TGW -&gt; B)</td>\n<td><strong>Non-Transitive.</strong> (A -&gt; B -&gt; C is not possible)</td>\n</tr>\n<tr>\n<td><strong>On-Prem Connection</strong></td>\n<td>Attaches <strong>once</strong> to the hub.</td>\n<td>Must attach to each VPC individually.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Central Airport Hub</td>\n<td>Direct Point-to-Point Train Lines</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Connect many VPCs\", \"Simplify topology\"</td>\n<td>\"Connect two VPCs\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Trusted Advisor": {
    "keywords": [
      "Best practices",
      "Recommendations",
      "Optimization",
      "5 Pillars",
      "Cost Optimization",
      "Security",
      "Performance",
      "Fault Tolerance",
      "Service Limits",
      "Give me recommendations"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Cost Explorer</strong></th>\n<th><strong>AWS Budgets</strong></th>\n<th><strong>AWS Trusted Advisor</strong></th>\n<th><strong>Amazon QuickSight</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Analyze</strong> Past Costs</td>\n<td><strong>Alert</strong> on Future Costs</td>\n<td><strong>Recommend</strong> Optimizations</td>\n<td><strong>Visualize</strong> Any Data</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Creates graphs of historical spend.</td>\n<td>Sends notifications based on a threshold.</td>\n<td>Checks account against best practices.</td>\n<td>Creates interactive BI dashboards.</td>\n</tr>\n<tr>\n<td><strong>Scope</strong></td>\n<td>AWS Cost &amp; Usage Data Only</td>\n<td>AWS Cost &amp; Usage Data Only</td>\n<td><strong>Entire AWS Account</strong> (5 Pillars)</td>\n<td><strong>Any Data Source</strong> (AWS, On-Prem, etc.)</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Interactive Credit Card Statement</td>\n<td>Low-Balance Bank Alert</td>\n<td>Expert Home Inspector</td>\n<td>Professional Graphic Design Studio</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Visualize my bill\"</td>\n<td>\"Alert me if I overspend\"</td>\n<td>\"Give me recommendations\"</td>\n<td>\"Create a BI dashboard\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS WAF": {
    "keywords": [
      "Web Application Firewall",
      "Layer 7",
      "HTTP/HTTPS",
      "SQL Injection",
      "Cross-Site Scripting (XSS)",
      "Protect my web application"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS WAF</strong></th>\n<th><strong>AWS Shield</strong></th>\n<th><strong>Amazon GuardDuty</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Filter Malicious <strong>Content</strong></td>\n<td>Block Malicious <strong>Volume</strong></td>\n<td>Detect Malicious <strong>Activity</strong></td>\n</tr>\n<tr>\n<td><strong>Layer of Operation</strong></td>\n<td><strong>Layer 7 (Application)</strong></td>\n<td><strong>Layer 3/4 (Network/Transport)</strong></td>\n<td><strong>Account / Log Analysis</strong></td>\n</tr>\n<tr>\n<td><strong>Protects Against</strong></td>\n<td>SQL Injection, XSS</td>\n<td>DDoS Attacks</td>\n<td>Compromised credentials, Malware</td>\n</tr>\n<tr>\n<td><strong>Mechanism</strong></td>\n<td>Rule-based content inspection</td>\n<td>Traffic scrubbing &amp; absorption</td>\n<td><strong>Intelligent log analysis (ML)</strong></td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Protect my web application\"</td>\n<td>\"Protect against DDoS\"</td>\n<td>\"Detect threats in my account\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS Wavelength": {
    "keywords": [
      "5G Networks",
      "Mobile devices",
      "Ultra-low latency",
      "Edge of the telecommunications network",
      "Telco"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Wavelength</strong></th>\n<th><strong>AWS Local Zone</strong></th>\n<th><strong>AWS Outposts</strong></th>\n<th><strong>Standard AWS Region</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td>Ultra-Low Latency for <strong>5G Mobile</strong></td>\n<td>Low-Latency for a <strong>Metro Area</strong></td>\n<td>Run AWS <strong>On-Premises</strong></td>\n<td>Core Cloud Infrastructure</td>\n</tr>\n<tr>\n<td><strong>Physical Location</strong></td>\n<td><strong>Inside a Telco's 5G Network</strong></td>\n<td>In an AWS-owned site near a city</td>\n<td><strong>In Your Data Center</strong></td>\n<td>A large, AWS-owned geographic area</td>\n</tr>\n<tr>\n<td><strong>Connectivity Model</strong></td>\n<td>Always Connected</td>\n<td>Always Connected</td>\n<td>Always Connected</td>\n<td>Always Connected</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>Mobile AR/VR, Connected Vehicles</td>\n<td>Real-time gaming, video editing</td>\n<td>Factory automation, local data processing</td>\n<td>Data sovereignty, General HA</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Mini-AWS server in the cell tower</td>\n<td>Downtown Branch Office</td>\n<td>AWS Embassy in Your Building</td>\n<td>The Main Country/Headquarters</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td><strong>\"5G\"</strong>, <strong>\"Mobile devices\"</strong></td>\n<td>\"Low latency for a city\"</td>\n<td>\"Run AWS in my data center\"</td>\n<td>\"Data sovereignty\", \"HA\"</td>\n</tr>\n</tbody></table>"
  },
  "AWS X-Ray": {
    "keywords": [
      "Trace",
      "Debug",
      "Analyze distributed applications",
      "Performance bottlenecks",
      "Service map",
      "Latency analysis",
      "Microservices"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS CloudTrail</strong></th>\n<th><strong>Amazon CloudWatch</strong></th>\n<th><strong>AWS X-Ray</strong></th>\n<th><strong>AWS Inspector</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Audit</strong> Account Activity</td>\n<td><strong>Monitor</strong> Resource Performance</td>\n<td><strong>Trace</strong> Application Performance</td>\n<td><strong>Scan</strong> for Software Vulnerabilities</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Records a history of all API calls.</td>\n<td>Collects metrics, logs, and sets alarms.</td>\n<td>Traces requests through microservices.</td>\n<td>Scans EC2/ECR for known CVEs.</td>\n</tr>\n<tr>\n<td><strong>Answers...</strong></td>\n<td>\"Who did what?\"</td>\n<td>\"How is my server running?\"</td>\n<td>\"<strong>Why</strong> is my app slow?\"</td>\n<td>\"Is my server patched?\"</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>The Security Logbook</td>\n<td>The Car's Dashboard</td>\n<td>The Performance MRI Scan</td>\n<td>The Home Safety Inspector</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"API calls\", \"Audit trail\"</td>\n<td>\"Metrics\", \"Alarms\", \"Logs\"</td>\n<td>\"Bottlenecks\", \"Trace\", \"Debug\"</td>\n<td>\"CVEs\", \"Vulnerability scan\"</td>\n</tr>\n</tbody></table>"
  },
  "Elastic Load Balancing": {
    "keywords": [
      "Distribute traffic",
      "High Availability",
      "Fault Tolerance",
      "Health Checks",
      "Multiple EC2 instances / targets",
      "Distribute load"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>Elastic Load Balancing (ELB)</strong></th>\n<th><strong>EC2 Auto Scaling</strong></th>\n<th><strong>Amazon ECS</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Distribute Traffic</strong></td>\n<td><strong>Add/Remove Instances</strong></td>\n<td><strong>Run &amp; Manage Containers</strong></td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>Incoming user requests</td>\n<td>The number of EC2 instances</td>\n<td>Docker containers &amp; tasks</td>\n</tr>\n<tr>\n<td><strong>Solves for...</strong></td>\n<td>High Availability &amp; Fault Tolerance</td>\n<td>Elasticity &amp; Cost Savings</td>\n<td>Container Orchestration</td>\n</tr>\n<tr>\n<td><strong>Works with...</strong></td>\n<td>A group of targets (EC2, ECS tasks)</td>\n<td>A group of EC2 instances</td>\n<td>A cluster of EC2 instances or Fargate</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Distribute load\"</td>\n<td>\"Scale based on demand\"</td>\n<td>\"Run Docker containers\"</td>\n</tr>\n</tbody></table>"
  },
  "OpsWorks": {
    "keywords": [
      "Configuration Management",
      "Chef",
      "Puppet",
      "Desired state",
      "Automate server configuration",
      "Cookbooks",
      "Manifests"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS OpsWorks</strong></th>\n<th><strong>AWS CloudFormation</strong></th>\n<th><strong>AWS Elastic Beanstalk</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Configure</strong> Software (with Chef/Puppet)</td>\n<td><strong>Provision</strong> Infrastructure (IaC)</td>\n<td><strong>Deploy &amp; Manage</strong> Web Apps (PaaS)</td>\n</tr>\n<tr>\n<td><strong>What it Manages</strong></td>\n<td>The entire state of the server OS and software.</td>\n<td>The AWS resources themselves (VPC, EC2, S3).</td>\n<td>The entire application platform.</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Automated Interior Designer &amp; Maintenance Crew</td>\n<td>The Master Blueprint for the House</td>\n<td>The All-in-One Caterer</td>\n</tr>\n<tr>\n<td><strong>Target User</strong></td>\n<td>DevOps Engineer (with Chef/Puppet skills)</td>\n<td>DevOps Engineer / Cloud Architect</td>\n<td>Application Developer</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td><strong>\"Chef\"</strong>, <strong>\"Puppet\"</strong></td>\n<td>\"Template\", \"IaC\", \"Provision\"</td>\n<td>\"Easy to deploy web app\"</td>\n</tr>\n</tbody></table>"
  },
  "QuickSight": {
    "keywords": [
      "Business Intelligence (BI)",
      "Dashboards",
      "Visualizations",
      "Any data source",
      "Interactive",
      "Create a BI dashboard"
    ],
    "detailsHTML": "<table>\n<tbody><tr>\n<th>Feature</th>\n<th><strong>AWS Cost Explorer</strong></th>\n<th><strong>AWS Budgets</strong></th>\n<th><strong>AWS Trusted Advisor</strong></th>\n<th><strong>Amazon QuickSight</strong></th>\n</tr>\n<tr>\n<td><strong>Primary Role</strong></td>\n<td><strong>Analyze</strong> Past Costs</td>\n<td><strong>Alert</strong> on Future Costs</td>\n<td><strong>Recommend</strong> Optimizations</td>\n<td><strong>Visualize</strong> Any Data</td>\n</tr>\n<tr>\n<td><strong>What it Does</strong></td>\n<td>Creates graphs of historical spend.</td>\n<td>Sends notifications based on a threshold.</td>\n<td>Checks account against best practices.</td>\n<td>Creates interactive BI dashboards.</td>\n</tr>\n<tr>\n<td><strong>Scope</strong></td>\n<td>AWS Cost &amp; Usage Data Only</td>\n<td>AWS Cost &amp; Usage Data Only</td>\n<td><strong>Entire AWS Account</strong> (5 Pillars)</td>\n<td><strong>Any Data Source</strong> (AWS, On-Prem, etc.)</td>\n</tr>\n<tr>\n<td><strong>Analogy</strong></td>\n<td>Interactive Credit Card Statement</td>\n<td>Low-Balance Bank Alert</td>\n<td>Expert Home Inspector</td>\n<td>Professional Graphic Design Studio</td>\n</tr>\n<tr>\n<td><strong>Key Identifier</strong></td>\n<td>\"Visualize my bill\"</td>\n<td>\"Alert me if I overspend\"</td>\n<td>\"Give me recommendations\"</td>\n<td>\"Create a BI dashboard\"</td>\n</tr>\n</tbody></table>"
  },
  "Supervised Learning": {
    "keywords": [
      "Labeled data",
      "Classification",
      "Regression",
      "Training data",
      "Input-output pairs",
      "Prediction"
    ],
    "detailsHTML": ""
  },
  "Unsupervised Learning": {
    "keywords": [
      "Unlabeled data",
      "Clustering",
      "Dimensionality reduction",
      "Anomaly detection",
      "Pattern discovery",
      "K-means"
    ],
    "detailsHTML": ""
  },
  "Reinforcement Learning": {
    "keywords": [
      "Agent",
      "Environment",
      "Reward",
      "Policy",
      "Actions",
      "Exploration",
      "Exploitation",
      "DeepRacer"
    ],
    "detailsHTML": ""
  },
  "Neural Networks & Deep Learning": {
    "keywords": [
      "Layers",
      "Neurons",
      "Weights",
      "Activation function",
      "Backpropagation",
      "CNN",
      "RNN",
      "Deep learning"
    ],
    "detailsHTML": ""
  },
  "Large Language Models (LLMs)": {
    "keywords": [
      "Text generation",
      "Natural language",
      "GPT",
      "Claude",
      "Titan",
      "Chatbot",
      "Foundation model",
      "Pre-trained"
    ],
    "detailsHTML": ""
  },
  "Foundation Models (FMs)": {
    "keywords": [
      "Pre-trained",
      "General purpose",
      "Fine-tuning",
      "Bedrock",
      "Titan",
      "Adapt",
      "Broad dataset",
      "Base model"
    ],
    "detailsHTML": ""
  },
  "Transfer Learning": {
    "keywords": [
      "Pre-trained model",
      "Reuse",
      "Adapt",
      "New task",
      "Feature extraction",
      "Domain adaptation"
    ],
    "detailsHTML": ""
  },
  "Fine-Tuning": {
    "keywords": [
      "Customize",
      "Domain-specific",
      "Task-specific",
      "Training data",
      "Adapt model",
      "Custom model",
      "Bedrock"
    ],
    "detailsHTML": ""
  },
  "Inference": {
    "keywords": [
      "Prediction",
      "Deploy",
      "Endpoint",
      "Real-time",
      "Batch",
      "Model serving",
      "Production"
    ],
    "detailsHTML": ""
  },
  "Overfitting & Underfitting": {
    "keywords": [
      "Generalization",
      "Training error",
      "Validation",
      "Regularization",
      "Model complexity",
      "Bias-variance tradeoff"
    ],
    "detailsHTML": ""
  },
  "Bias & Fairness in AI": {
    "keywords": [
      "Discrimination",
      "Ethical AI",
      "Fairness metrics",
      "SageMaker Clarify",
      "Protected attributes",
      "Disparate impact"
    ],
    "detailsHTML": ""
  },
  "Hallucinations (AI)": {
    "keywords": [
      "Fabricated",
      "Incorrect output",
      "Grounding",
      "RAG",
      "Guardrails",
      "Factual accuracy",
      "Mitigation"
    ],
    "detailsHTML": ""
  },
  "Prompt Engineering": {
    "keywords": [
      "Zero-shot",
      "Few-shot",
      "Chain-of-thought",
      "System prompt",
      "Context window",
      "Instructions",
      "Examples"
    ],
    "detailsHTML": ""
  },
  "Retrieval Augmented Generation (RAG)": {
    "keywords": [
      "Knowledge base",
      "External data",
      "Grounding",
      "Reduce hallucinations",
      "Vector search",
      "Embeddings",
      "Bedrock Knowledge Bases"
    ],
    "detailsHTML": ""
  },
  "Responsible AI": {
    "keywords": [
      "Fairness",
      "Transparency",
      "Explainability",
      "Privacy",
      "Safety",
      "Governance",
      "Guardrails",
      "Ethics"
    ],
    "detailsHTML": ""
  },
  "Tokens & Tokenization": {
    "keywords": [
      "Words",
      "Subwords",
      "Context window",
      "Token limit",
      "Cost per token",
      "Input tokens",
      "Output tokens"
    ],
    "detailsHTML": ""
  },
  "Embeddings": {
    "keywords": [
      "Vector",
      "Semantic similarity",
      "Vector database",
      "Semantic search",
      "Representation",
      "Titan Embeddings"
    ],
    "detailsHTML": ""
  },
  "Temperature (GenAI)": {
    "keywords": [
      "Randomness",
      "Creativity",
      "Deterministic",
      "Top-p",
      "Sampling",
      "Model parameters"
    ],
    "detailsHTML": ""
  },
  "Generative AI": {
    "keywords": [
      "Create content",
      "Text generation",
      "Image generation",
      "Code generation",
      "Foundation models",
      "LLM",
      "Bedrock"
    ],
    "detailsHTML": ""
  },
  "Diffusion Models": {
    "keywords": [
      "Image generation",
      "Noise",
      "Denoising",
      "Stable Diffusion",
      "Titan Image Generator",
      "Art"
    ],
    "detailsHTML": ""
  },
  "Transformers": {
    "keywords": [
      "Self-attention",
      "Parallel processing",
      "Architecture",
      "GPT",
      "BERT",
      "Encoder",
      "Decoder"
    ],
    "detailsHTML": ""
  },
  "Amazon Bedrock Knowledge Bases": {
    "keywords": [
      "RAG",
      "Retrieval Augmented Generation",
      "Data sources",
      "S3",
      "Vector store",
      "Grounding",
      "Enterprise data"
    ],
    "detailsHTML": ""
  },
  "Amazon Bedrock Agents": {
    "keywords": [
      "Multi-step tasks",
      "Orchestration",
      "API calls",
      "Action groups",
      "Planning",
      "Autonomous"
    ],
    "detailsHTML": ""
  },
  "Amazon Bedrock Guardrails": {
    "keywords": [
      "Content filtering",
      "Denied topics",
      "PII redaction",
      "Safety",
      "Responsible AI",
      "Word filters"
    ],
    "detailsHTML": ""
  },
  "Amazon Titan Models": {
    "keywords": [
      "AWS foundation model",
      "Titan Text",
      "Titan Embeddings",
      "Titan Image",
      "Multimodal",
      "Bedrock"
    ],
    "detailsHTML": ""
  },
  "Amazon SageMaker Canvas": {
    "keywords": [
      "No-code ML",
      "Visual",
      "Business analyst",
      "AutoML",
      "Predictions",
      "Point and click"
    ],
    "detailsHTML": ""
  },
  "Amazon SageMaker JumpStart": {
    "keywords": [
      "Pre-trained models",
      "One-click deploy",
      "Open source",
      "Llama",
      "Stable Diffusion",
      "Solution templates"
    ],
    "detailsHTML": ""
  },
  "Amazon SageMaker Ground Truth": {
    "keywords": [
      "Data labeling",
      "Training data",
      "Human labelers",
      "Annotation",
      "Active learning",
      "Crowdsourcing"
    ],
    "detailsHTML": ""
  },
  "Amazon SageMaker Clarify": {
    "keywords": [
      "Bias detection",
      "Explainability",
      "SHAP values",
      "Fairness",
      "Model interpretability",
      "Feature importance"
    ],
    "detailsHTML": ""
  },
  "Amazon SageMaker Pipelines": {
    "keywords": [
      "ML workflow",
      "CI/CD for ML",
      "Automation",
      "MLOps",
      "Training pipeline",
      "Model registry"
    ],
    "detailsHTML": ""
  },
  "AWS Well-Architected Framework": {
    "keywords": [
      "Six pillars",
      "Best practices",
      "Operational Excellence",
      "Security",
      "Reliability",
      "Performance Efficiency",
      "Cost Optimization",
      "Sustainability"
    ],
    "detailsHTML": ""
  },
  "High Availability vs Fault Tolerance": {
    "keywords": [
      "Redundancy",
      "Multi-AZ",
      "Zero downtime",
      "Failover",
      "Recovery",
      "Uptime",
      "SLA"
    ],
    "detailsHTML": ""
  },
  "Disaster Recovery Strategies": {
    "keywords": [
      "Backup and Restore",
      "Pilot Light",
      "Warm Standby",
      "Multi-Site",
      "Active-Active",
      "RTO",
      "RPO",
      "Cost vs speed"
    ],
    "detailsHTML": ""
  },
  "RPO & RTO": {
    "keywords": [
      "Recovery Point Objective",
      "Recovery Time Objective",
      "Data loss",
      "Downtime",
      "Business continuity",
      "DR strategy"
    ],
    "detailsHTML": ""
  },
  "Horizontal vs Vertical Scaling": {
    "keywords": [
      "Scale out",
      "Scale up",
      "Add instances",
      "Add resources",
      "Auto Scaling",
      "Elasticity",
      "Cloud-native"
    ],
    "detailsHTML": ""
  },
  "Loose Coupling": {
    "keywords": [
      "Decoupling",
      "SQS",
      "SNS",
      "EventBridge",
      "API Gateway",
      "Resilience",
      "Independent components",
      "Queue"
    ],
    "detailsHTML": ""
  },
  "Serverless Architecture": {
    "keywords": [
      "Lambda",
      "API Gateway",
      "DynamoDB",
      "S3",
      "No servers",
      "Pay per use",
      "Auto-scaling",
      "Step Functions"
    ],
    "detailsHTML": ""
  },
  "Event-Driven Architecture": {
    "keywords": [
      "Events",
      "Producers",
      "Consumers",
      "EventBridge",
      "SNS",
      "Decoupling",
      "Async",
      "Reactive"
    ],
    "detailsHTML": ""
  },
  "S3 Storage Classes": {
    "keywords": [
      "Standard",
      "Standard-IA",
      "One Zone-IA",
      "Intelligent-Tiering",
      "Glacier Instant",
      "Glacier Flexible",
      "Deep Archive",
      "Lifecycle"
    ],
    "detailsHTML": ""
  },
  "EC2 Purchasing Options": {
    "keywords": [
      "On-Demand",
      "Reserved Instance",
      "Savings Plans",
      "Spot Instance",
      "Dedicated Host",
      "Dedicated Instance",
      "Capacity Reservation"
    ],
    "detailsHTML": ""
  },
  "EC2 Placement Groups": {
    "keywords": [
      "Cluster",
      "Spread",
      "Partition",
      "Low latency",
      "High throughput",
      "Fault isolation",
      "Single AZ",
      "HPC"
    ],
    "detailsHTML": ""
  },
  "EBS Volume Types": {
    "keywords": [
      "gp3",
      "gp2",
      "io2",
      "io1",
      "st1",
      "sc1",
      "IOPS",
      "Throughput",
      "SSD",
      "HDD",
      "Boot volume"
    ],
    "detailsHTML": ""
  },
  "ELB Types (ALB/NLB/GLB)": {
    "keywords": [
      "Application Load Balancer",
      "Network Load Balancer",
      "Gateway Load Balancer",
      "Layer 7",
      "Layer 4",
      "Layer 3",
      "Path-based routing"
    ],
    "detailsHTML": ""
  },
  "DynamoDB Accelerator (DAX)": {
    "keywords": [
      "In-memory cache",
      "Microsecond latency",
      "Read performance",
      "DynamoDB",
      "API-compatible",
      "Write-through"
    ],
    "detailsHTML": ""
  },
  "Aurora Serverless": {
    "keywords": [
      "Auto-scaling",
      "On-demand",
      "ACU",
      "Intermittent workloads",
      "Pay per use",
      "Start and stop",
      "Unpredictable"
    ],
    "detailsHTML": ""
  },
  "Aurora Global Database": {
    "keywords": [
      "Cross-region",
      "Replication",
      "Sub-second lag",
      "Disaster recovery",
      "Fast failover",
      "RTO under 1 minute",
      "5 regions"
    ],
    "detailsHTML": ""
  },
  "S3 Replication (CRR/SRR)": {
    "keywords": [
      "Cross-Region Replication",
      "Same-Region Replication",
      "Versioning",
      "Compliance",
      "Latency",
      "Backup"
    ],
    "detailsHTML": ""
  },
  "VPC Peering": {
    "keywords": [
      "Connect VPCs",
      "Non-transitive",
      "Private IP",
      "No overlapping CIDR",
      "Cross-account",
      "Cross-region"
    ],
    "detailsHTML": ""
  },
  "VPC Endpoints": {
    "keywords": [
      "Interface Endpoint",
      "Gateway Endpoint",
      "PrivateLink",
      "S3",
      "DynamoDB",
      "Private access",
      "No internet"
    ],
    "detailsHTML": ""
  },
  "NAT Gateway": {
    "keywords": [
      "Private subnet",
      "Outbound internet",
      "One-way",
      "Public subnet",
      "Managed",
      "High availability",
      "No inbound"
    ],
    "detailsHTML": ""
  },
  "Internet Gateway": {
    "keywords": [
      "Public internet",
      "VPC",
      "IPv4",
      "IPv6",
      "Horizontal scaling",
      "Redundant",
      "Public subnet"
    ],
    "detailsHTML": ""
  },
  "Route 53 Routing Policies": {
    "keywords": [
      "Simple",
      "Weighted",
      "Latency",
      "Failover",
      "Geolocation",
      "Geoproximity",
      "Multi-value",
      "Health checks"
    ],
    "detailsHTML": ""
  },
  "AWS Security Token Service (STS)": {
    "keywords": [
      "Temporary credentials",
      "AssumeRole",
      "Federation",
      "Cross-account",
      "Identity provider",
      "Short-lived"
    ],
    "detailsHTML": ""
  },
  "Amazon Data Lifecycle Manager": {
    "keywords": [
      "Automate snapshots",
      "EBS backup",
      "Retention",
      "Lifecycle policy",
      "Schedule",
      "AMI management"
    ],
    "detailsHTML": ""
  },
  "AWS Pricing Calculator": {
    "keywords": [
      "Cost estimate",
      "Planning",
      "What will it cost",
      "Budget",
      "Free tool",
      "Before deployment"
    ],
    "detailsHTML": ""
  }
};
