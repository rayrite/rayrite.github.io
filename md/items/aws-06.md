# [BRAIN] AWS Exam Master Reference Guide
### Covering: AIF-C01 (AI Practitioner) . SAA-C03 (Solutions Architect Associate) . CLF-C02 (Cloud Practitioner)

> **How to use this guide:** Each section is a self-contained study unit. Read top-to-bottom for full coverage, or jump to any section using the Table of Contents. Decision matrices are especially valuable for exam scenario questions -- they tell you *which service to pick and why*.

---

## [CLIPBOARD] Table of Contents

1. [Exam Blueprints & Scoring](#1-exam-blueprints--scoring)
2. [Question Types & Strategy](#2-question-types--strategy)
3. [Compute Services](#3-compute-services)
4. [Storage Services](#4-storage-services)
5. [Database Services](#5-database-services)
6. [Networking & Content Delivery](#6-networking--content-delivery)
7. [Security, Identity & Compliance](#7-security-identity--compliance)
8. [Access & User Management](#8-access--user-management)
9. [Analytics Services](#9-analytics-services)
10. [AI & Machine Learning Services](#10-ai--machine-learning-services)
11. [Generative AI & Foundation Models](#11-generative-ai--foundation-models)
12. [ML Techniques & Concepts](#12-ml-techniques--concepts)
13. [Responsible AI -- The GRIPE Framework](#13-responsible-ai--the-gripe-framework)
14. [Disaster Recovery & High Availability](#14-disaster-recovery--high-availability)
15. [Cost Management & Pricing Models](#15-cost-management--pricing-models)
16. [Migration & Transfer Services](#16-migration--transfer-services)
17. [Developer Tools & DevOps](#17-developer-tools--devops)
18. [Management & Governance](#18-management--governance)
19. [Application Integration & Messaging](#19-application-integration--messaging)
20. [Well-Architected Framework -- 6 Pillars](#20-well-architected-framework--6-pillars)
21. [AWS Cloud Adoption Framework (CAF)](#21-aws-cloud-adoption-framework-caf)
22. [Ordering Questions Collections](#22-ordering-questions-collections)
23. [Critical Differentiators & Exam Traps](#23-critical-differentiators--exam-traps)
24. [Mnemonic Memory Aids](#24-mnemonic-memory-aids)

---

## 1. Exam Blueprints & Scoring

### AIF-C01 -- AWS Certified AI Practitioner

| Domain | Topic | Weight |
|--------|-------|--------|
| Domain 1 | Fundamentals of AI and ML | 20% |
| Domain 2 | Fundamentals of Generative AI | 24% |
| **Domain 3** | **Applications of Foundation Models** | **28%** <- Highest |
| Domain 4 | Guidelines for Responsible AI | 14% |
| Domain 5 | Security, Compliance & Governance for AI | 14% |

> [TARGET] **Mentor Tip:** Domains 2 + 3 together = **52% of your score**. Master Generative AI and Foundation Model Applications first.

**Exam Mechanics:**
- Score range: 100-1,000 | Passing score: **700**
- 65 questions (50 scored + 15 unscored pilot questions)
- Time: 90 minutes
- No penalty for guessing -- **answer every question**

---

### SAA-C03 -- AWS Solutions Architect Associate

| Domain | Topic | Weight |
|--------|-------|--------|
| Domain 1 | Design Secure Architectures | 30% |
| Domain 2 | Design Resilient Architectures | 26% |
| Domain 3 | Design High-Performing Architectures | 24% |
| Domain 4 | Design Cost-Optimized Architectures | 20% |

> [TARGET] **Mentor Tip:** Security is the #1 domain. Every architecture decision has a security lens. Know IAM, VPC, encryption, and KMS deeply.

---

### CLF-C02 -- AWS Cloud Practitioner

| Domain | Topic | Weight |
|--------|-------|--------|
| Domain 1 | Cloud Concepts | 24% |
| Domain 2 | Security and Compliance | 30% |
| Domain 3 | Cloud Technology and Services | 34% <- Highest |
| Domain 4 | Billing, Pricing and Support | 12% |

---

## 2. Question Types & Strategy

### The 5 Question Formats

| Format | What It Looks Like | Strategy |
|--------|--------------------|----------|
| **Multiple Choice** | 1 correct out of 4 options | Eliminate 2 obvious wrongs, choose best fit |
| **Multiple Response** | 2+ correct out of 5+ options (told how many) | Treat as separate true/false for each option |
| **Ordering** | Arrange steps in correct sequence | Anchor on the first and last step first |
| **Matching** | Connect services to descriptions | Start with the ones you know with certainty |
| **Case Study** | Multi-paragraph scenario -> multiple questions | Read questions FIRST, then the scenario |

### The 7-Step Scenario Strategy

```
1. IDENTIFY THE GOAL      -> What outcome does the customer need?
2. IDENTIFY THE DOMAIN    -> Security? Performance? Cost? Reliability?
3. EXTRACT KEYWORDS       -> "serverless", "relational", "real-time", "managed"
4. DETERMINE CONSTRAINTS  -> Budget limit? Existing database? On-premises?
5. MAP THE PATTERN        -> Match keywords to the service pattern you've studied
6. ELIMINATE WRONG ANSWERS -> Rule out services that don't fit the domain
7. SELECT THE BEST FIT    -> Of remaining options, which is most specific/managed?
```

> [TARGET] **Exam Pro Tip:** If two answers seem correct, the *more managed* or *more specific* service is usually right. AWS loves recommending its purpose-built services over general-purpose ones.

---

## 3. Compute Services

### Decision Matrix: Which Compute to Use?

| Scenario Keyword | Service to Choose | Why |
|-----------------|-------------------|-----|
| Full control, custom OS, legacy app | **EC2** | Virtual machine -- full OS access |
| Event-driven, short tasks, no server management | **Lambda** | Serverless -- runs code on triggers |
| Docker containers, managed cluster | **ECS** | AWS-native container orchestration |
| Kubernetes, open-source, container | **EKS** | Managed Kubernetes |
| Containers WITHOUT managing servers | **Fargate** | Serverless containers |
| Deploy app without caring about infrastructure | **Elastic Beanstalk** | PaaS -- auto-handles EC2, scaling, LB |
| Batch processing, HPC jobs | **AWS Batch** | Managed batch computing |
| Run code at edge/CDN locations | **Lambda@Edge** | Lambda running inside CloudFront |

### EC2 Instance Types (Memory Aid: **MCGBF**)

| Family | Optimized For | Mnemonic |
|--------|--------------|---------|
| **M** - General Purpose | Balanced CPU/RAM | **M**oderate everything |
| **C** - Compute Optimized | High CPU, scientific | **C**runching numbers |
| **G/P** - GPU Instances | ML training, graphics | **G**raphics/GPU |
| **R/X** - Memory Optimized | In-memory databases | **R**AM-heavy |
| **I/D** - Storage Optimized | Fast local NVMe disk | **I**O intensive |

### EC2 Pricing Models

| Model | Best For | Savings vs. On-Demand |
|-------|---------|----------------------|
| **On-Demand** | Short-term, unpredictable | Baseline (0%) |
| **Reserved Instances (1-3 yr)** | Steady-state predictable workloads | Up to 72% |
| **Savings Plans** | Flexible reserved (any instance type) | Up to 66% |
| **Spot Instances** | Fault-tolerant, interruptible workloads | Up to 90% |
| **Dedicated Hosts** | Compliance, BYOL (Bring Your Own License) | Varies |

> [TARGET] **Exam Trap:** "Batch job that can be interrupted" -> **Spot**. "Web server that must stay up" -> **Reserved**. "One-time script tonight" -> **On-Demand**.

---

## 4. Storage Services

### Decision Matrix: Which Storage to Use?

| Scenario Keyword | Service | Storage Type |
|-----------------|---------|-------------|
| Files, photos, backups, websites | **S3** | Object |
| Boot volume for an EC2 instance | **EBS** | Block |
| Shared file system across multiple EC2s (Linux) | **EFS** | File (NFS) |
| Shared file system for Windows servers | **FSx for Windows** | File (SMB) |
| High-performance HPC file system | **FSx for Lustre** | File (Lustre) |
| Long-term archive, rarely accessed | **S3 Glacier** | Archive/Object |
| Physical data transfer (petabytes) | **Snowball / Snowmobile** | Physical Transfer |
| Hybrid -- on-prem to cloud NFS/SMB | **Storage Gateway** | Hybrid |

### S3 Storage Classes (Hot -> Cold)

```
STANDARD         -> Frequently accessed, millisecond retrieval
INTELLIGENT-TIERING -> Unknown access pattern; auto-moves between tiers
STANDARD-IA      -> Infrequent access but instant retrieval
ONE ZONE-IA      -> Same as IA but single AZ (cheaper, less resilient)
GLACIER INSTANT  -> Archive but instant (milliseconds) retrieval
GLACIER FLEXIBLE -> Archive, retrieval in minutes to hours
DEEP ARCHIVE     -> Coldest/cheapest, retrieval in 12-48 hours
```

> [TARGET] **Memory Aid:** Think of temperature -- **Standard = Hot**, **Deep Archive = Frozen**. Each tier trades retrieval speed for cost savings.

### S3 Key Features for SAA-C03

| Feature | Purpose |
|---------|---------|
| **Versioning** | Keep multiple versions; recover deleted objects |
| **MFA Delete** | Require MFA to delete object versions |
| **Replication (CRR/SRR)** | Copy objects across regions or within a region |
| **S3 Transfer Acceleration** | Speed up uploads using CloudFront edge locations |
| **Object Lock / WORM** | Write Once Read Many -- compliance requirement |
| **Lifecycle Policies** | Auto-transition objects to cheaper storage tiers |
| **Server-Side Encryption** | SSE-S3, SSE-KMS, SSE-C (customer key) |

---

## 5. Database Services

### Decision Matrix: Which Database to Use?

| Scenario Keyword | Service | Type |
|-----------------|---------|------|
| SQL, relational, MySQL/PostgreSQL/Oracle | **RDS** | Relational |
| Relational but needs high performance & auto-scaling | **Aurora** | Relational (AWS-native) |
| Key-value, single-digit ms, massive scale, NoSQL | **DynamoDB** | NoSQL |
| Caching layer, speed up database reads | **ElastiCache** (Redis/Memcached) | In-Memory |
| Analytics, data warehouse, SQL at petabyte scale | **Redshift** | Data Warehouse |
| Social network, fraud detection, graph relationships | **Neptune** | Graph |
| Financial records, immutable audit log | **QLDB** | Ledger |
| IoT metrics, time-series data | **Timestream** | Time-Series |
| MongoDB-compatible, document database | **DocumentDB** | Document |

### RDS vs. Aurora vs. DynamoDB (Critical Comparison)

| Feature | RDS | Aurora | DynamoDB |
|---------|-----|--------|----------|
| **Type** | Relational | Relational | NoSQL |
| **Scaling** | Manual | Auto | Auto |
| **Performance** | Standard | 5x MySQL, 3x PostgreSQL | Single-digit ms |
| **Multi-AZ** | Yes (standby) | Yes (6 copies across 3 AZs) | Built-in |
| **Cost** | Moderate | Higher than RDS | Pay-per-request |
| **Best For** | Existing SQL apps | High-perf relational | Global, serverless apps |

---

## 6. Networking & Content Delivery

### Core Networking Services

| Service | What It Does | Analogy |
|---------|-------------|---------|
| **VPC** | Your private isolated network in AWS | A fenced property in AWS's city |
| **Subnet** | Segment of a VPC (public or private) | Rooms inside your property |
| **Internet Gateway (IGW)** | Allows public internet traffic into VPC | Front door of the property |
| **NAT Gateway** | Allows private subnets to reach internet (not vice versa) | One-way exit door |
| **Security Group** | Instance-level firewall (stateful) | Bodyguard for each EC2 |
| **NACL** | Subnet-level firewall (stateless) | Security checkpoint at subnet border |
| **Route 53** | DNS service + health checks + routing policies | Global phone directory + GPS |
| **CloudFront** | CDN -- cache content at edge locations | Warehouse near your customers |
| **API Gateway** | Managed REST/WebSocket API front door | Receptionist for microservices |
| **ELB/ALB/NLB** | Load balancer -- distribute traffic | Traffic cop |

### Connectivity Options: On-Premises to AWS

| Need | Service | Key Difference |
|------|---------|---------------|
| Encrypted tunnel over public internet | **VPN (Site-to-Site)** | Fast to set up, internet-dependent |
| Dedicated private fiber connection | **Direct Connect** | Consistent, no internet, expensive |
| Private access to AWS services (no internet) | **PrivateLink** | Service-level private connection |
| Connect multiple VPCs & on-prem networks | **Transit Gateway** | Hub-and-spoke network architecture |

### Route 53 Routing Policies (SAA-C03 Favorite)

| Policy | Use Case |
|--------|---------|
| **Simple** | Single resource, no health checks |
| **Weighted** | A/B testing, gradual traffic shifts |
| **Latency-Based** | Route to region with lowest latency |
| **Failover** | Active/passive DR configuration |
| **Geolocation** | Route based on user's country/region |
| **Geoproximity** | Route based on geographic distance (with bias) |
| **Multi-Value Answer** | Multiple healthy endpoints returned |

---

## 7. Security, Identity & Compliance

### Security Services Decision Matrix

| Security Question | Service |
|-------------------|---------|
| "Am I vulnerable?" -- scan for CVEs | **Amazon Inspector** |
| "Am I being attacked?" -- threat detection | **Amazon GuardDuty** |
| "Is my sensitive data (PII) exposed in S3?" | **Amazon Macie** |
| "Protect from DDoS attacks" | **AWS Shield** (Standard/Advanced) |
| "Web application firewall -- block SQL injection, XSS" | **AWS WAF** |
| "Who did what, when?" -- API audit trail | **AWS CloudTrail** |
| "Centralize security findings across accounts" | **AWS Security Hub** |
| "Manage encryption keys" | **AWS KMS** (Key Management Service) |
| "Store secrets: DB passwords, API keys" | **AWS Secrets Manager** |
| "Store config parameters (not secrets)" | **SSM Parameter Store** |
| "Check for compliance against best practices" | **AWS Trusted Advisor** |
| "Automate security response" | **AWS Security Hub + EventBridge** |

### Security Service Comparison Table

| Feature | Inspector | GuardDuty | Macie | Shield |
|---------|-----------|-----------|-------|--------|
| **Primary Role** | Vulnerability Scanning | Threat Detection | Sensitive Data Discovery | DDoS Protection |
| **What It Watches** | EC2/Container software | Logs (CloudTrail, VPC, DNS) | S3 data | Network traffic |
| **Answers...** | "Am I vulnerable?" | "Am I being attacked?" | "Is my data exposed?" | "Can I handle a flood?" |
| **Keyword Trigger** | CVE, Patching | Malicious activity, Anomalous | PII, Sensitive Data, S3 | DDoS |

### Encryption in AWS

| Where | Encryption Type | Who Manages Keys |
|-------|----------------|-----------------|
| S3 at rest | SSE-S3 | AWS |
| S3 at rest | SSE-KMS | You (via KMS) |
| S3 at rest | SSE-C | Customer-provided key |
| In transit | SSL/TLS | AWS Certificate Manager (ACM) |
| EBS volumes | KMS | You (via KMS) |
| RDS | KMS | You (via KMS) |

### Shared Responsibility Model

```
AWS RESPONSIBLE FOR:               YOU RESPONSIBLE FOR:
-------------------------          -------------------------
Physical datacenters               Your data
Hardware (servers, networking)     IAM users & permissions
Hypervisor                         OS patching (EC2)
Managed service availability       Application security
Global infrastructure              Encryption configuration
                                   Network/firewall rules
```

> [TARGET] **Rule of thumb:** "Security OF the cloud" = AWS. "Security IN the cloud" = You.

---

## 8. Access & User Management

### IAM Core Concepts

| Concept | Definition | Analogy |
|---------|-----------|---------|
| **IAM User** | A person with permanent credentials | An employee badge |
| **IAM Group** | Collection of users sharing permissions | A department |
| **IAM Role** | Temporary credentials assumed by a service or user | A visitor pass |
| **IAM Policy** | JSON document defining permissions | A rulebook |
| **MFA** | Multi-Factor Authentication | Lock + key + fingerprint |

### IAM Policy Types

| Policy Type | Attached To | Purpose |
|------------|-------------|---------|
| **Identity-based** | Users, Groups, Roles | What can this identity do? |
| **Resource-based** | S3 buckets, KMS keys, etc. | Who can access this resource? |
| **Permission Boundary** | Users or Roles | Maximum permission ceiling |
| **SCP (Service Control Policy)** | AWS Organizations OUs | Org-wide guardrails |

### User Management Services

| Service | Purpose | When to Use |
|---------|---------|------------|
| **IAM** | AWS account access control | Always -- foundational |
| **AWS Organizations** | Multi-account management | Enterprises with many AWS accounts |
| **AWS SSO / IAM Identity Center** | Single sign-on for employees | Corporate directory -> AWS access |
| **Amazon Cognito** | User auth for your *application's* end users | Web/mobile app login |
| **AWS Directory Service** | Managed Microsoft Active Directory | On-prem AD integration |
| **AWS STS** | Temporary security credentials | Cross-account role assumption |

> [TARGET] **Key Differentiator:** **IAM** = AWS console/API access. **Cognito** = your app's login system for customers.

---

## 9. Analytics Services

### Analytics Decision Matrix

| Scenario | Service | Key Trait |
|---------|---------|-----------|
| Query S3 data with SQL, no ETL | **Athena** | Serverless SQL on S3 |
| Data warehouse, petabyte SQL analytics | **Redshift** | Columnar, OLAP |
| Visual dashboards, BI reporting | **QuickSight** | Business Intelligence tool |
| Streaming real-time data (clickstreams, IoT) | **Kinesis Data Streams** | Real-time ingestion |
| Transform and load streaming data to S3/Redshift | **Kinesis Data Firehose** | Near-real-time ETL |
| Managed Apache Spark/Hadoop | **EMR** (Elastic MapReduce) | Big data processing |
| Managed Apache Kafka | **MSK** (Managed Streaming for Kafka) | Event streaming |
| Data catalog and ETL orchestration | **AWS Glue** | Serverless ETL |
| Search and log analytics (Elasticsearch) | **OpenSearch Service** | Text search, log analysis |
| Tag and search media assets | **Amazon Rekognition + S3** | Media AI analytics |

### Kinesis Family (Real-Time Streaming)

```
Kinesis Data Streams   -> Raw real-time streaming; you manage consumers
Kinesis Data Firehose  -> Auto-loads to S3, Redshift, OpenSearch (no code)
Kinesis Data Analytics -> Run SQL queries on streams in real-time
Kinesis Video Streams  -> Ingest and analyze video streams
```

---

## 10. AI & Machine Learning Services

### AWS AI/ML Services Decision Matrix

| Scenario Keyword | Service | What It Does |
|-----------------|---------|-------------|
| Chatbot, voice assistant | **Amazon Lex** | NLU + speech -> conversational AI |
| Extract text from documents, forms, tables | **Amazon Textract** | OCR + document structure extraction |
| Analyze text sentiment, entities, language | **Amazon Comprehend** | Natural Language Processing (NLP) |
| Detect objects, faces, labels in images/video | **Amazon Rekognition** | Computer vision |
| Speech-to-text transcription | **Amazon Transcribe** | Audio -> text |
| Text-to-speech | **Amazon Polly** | Text -> lifelike speech |
| Translate languages | **Amazon Translate** | Neural machine translation |
| Product/content recommendations | **Amazon Personalize** | ML-powered recommendations |
| Search documents with natural language | **Amazon Kendra** | Intelligent enterprise search |
| Detect fraud in transactions | **Amazon Fraud Detector** | ML fraud detection |
| Forecast future values (time-series) | **Amazon Forecast** | ML-based time-series prediction |
| Build, train, deploy ANY ML model | **Amazon SageMaker** | Full ML platform |
| Human review of ML predictions | **Amazon Augmented AI (A2I)** | Human-in-the-loop |
| Code review and performance recommendations | **Amazon CodeGuru** | ML-powered code quality |

### Critical Differentiator: Textract vs. Comprehend

| | Textract | Comprehend |
|--|---------|-----------|
| **Input** | Images, PDFs (scanned documents) | Plain text |
| **Output** | Extracted text + structure (tables, forms) | Sentiment, entities, key phrases, language |
| **Analogy** | Scanner that reads and structures a document | Analyst who interprets the text's meaning |
| **Keyword Trigger** | "Extract from form", "OCR", "invoice", "table" | "Sentiment", "analyze text", "PII detection", "NLP" |

### Critical Differentiator: SageMaker vs. Bedrock

| | SageMaker | Bedrock |
|--|-----------|---------|
| **Who uses it** | Data scientists, ML engineers | Developers building AI apps |
| **What you build** | Custom ML models from scratch | Apps on top of Foundation Models |
| **Skill required** | High -- know ML, training, tuning | Lower -- API calls to pre-built models |
| **Underlying models** | You bring or train your own | Pre-trained FMs (Claude, Titan, etc.) |
| **Analogy** | ML workshop where you build the engine | App store where you choose an engine |
| **Keyword Trigger** | "Train", "custom model", "data scientist" | "Generative AI", "foundation model", "LLM" |

---

## 11. Generative AI & Foundation Models

### Key Generative AI Terms

| Term | Definition | Plain English |
|------|-----------|---------------|
| **Foundation Model (FM)** | Large pre-trained model usable for many tasks | A Swiss Army knife AI |
| **Large Language Model (LLM)** | FM specialized for text | A super-smart text writer/reader |
| **Prompt** | Input text you give the model | Your question or instruction |
| **Inference** | Running the model to get output | Model "thinking" and responding |
| **Token** | A chunk of text (~4 characters or 1 word) | Unit of text the model processes |
| **Context Window** | Max tokens the model can process at once | The model's working memory |
| **Embedding** | Numeric vector representing meaning of text | Converting words into math |
| **Vector Database** | Stores and searches embeddings | Library organized by meaning, not keywords |
| **RAG** | Retrieval-Augmented Generation | Give the model real-time context from your data |
| **Fine-Tuning** | Re-training a model on your domain data | Teaching the model your specific language |
| **RLHF** | Reinforcement Learning from Human Feedback | Humans rate outputs to improve the model |
| **Hallucination** | Model generates confident but false information | The AI making things up |

### RAG vs. Fine-Tuning Decision Framework

| Situation | Use RAG | Use Fine-Tuning |
|-----------|---------|----------------|
| Data changes frequently | [OK] Yes | [X] No (re-training is expensive) |
| Need to cite sources | [OK] Yes | [X] No |
| Need the model to *behave* differently | [X] No | [OK] Yes |
| Domain-specific terminology/tone | [X] Sometimes | [OK] Yes |
| Quick to implement | [OK] Yes | [X] No (requires training data + compute) |
| Reduce hallucinations with real data | [OK] Yes | Partially |

> [TARGET] **Exam Rule:** "Company needs AI to answer questions from their internal documents" -> **RAG**. "Company wants the AI to respond like their brand voice" -> **Fine-Tuning**.

### Model Inference Parameters

| Parameter | Effect | Low Value | High Value |
|-----------|--------|-----------|------------|
| **Temperature** | Creativity/randomness | Deterministic, factual | Creative, unpredictable |
| **Top-K** | Limits token candidates | Focused | More varied |
| **Top-P** (nucleus sampling) | Probability threshold | Precise | More diverse |
| **Max Tokens** | Output length limit | Short answers | Long answers |

### Amazon Bedrock -- Key Features

| Feature | What It Does |
|---------|-------------|
| **Model Catalog** | Access FMs from Anthropic (Claude), AI21, Cohere, Meta, Mistral, Amazon Titan |
| **Knowledge Bases** | Connect your data to FMs -> enables RAG automatically |
| **Agents** | Give FMs the ability to call APIs and take actions |
| **Guardrails** | Filter harmful content, block PII, enforce topic restrictions |
| **Model Evaluation** | Compare and evaluate FM performance on your use case |
| **Provisioned Throughput** | Reserve capacity for consistent FM performance |

### Prompt Engineering Techniques (AIF-C01)

| Technique | Description | Example |
|-----------|-------------|---------|
| **Zero-Shot** | No examples given, just instruction | "Translate this to French:" |
| **One-Shot** | One example provided | "Positive review: Great! -> Negative review: Terrible! -> This review:" |
| **Few-Shot** | Multiple examples provided | 3-5 examples before the actual prompt |
| **Chain-of-Thought** | Ask model to reason step-by-step | "Think step by step..." |
| **Role Prompting** | Give the model a persona | "You are an expert AWS architect..." |
| **Instruction Tuning** | Structure prompt with clear task/format | "Summarize in 3 bullet points:" |

---

## 12. ML Techniques & Concepts

### Types of Machine Learning

| Type | Definition | Example Use Case | AWS Service |
|------|-----------|-----------------|-------------|
| **Supervised Learning** | Labeled training data (input -> known output) | Email spam detection, exam score prediction | SageMaker |
| **Unsupervised Learning** | Unlabeled data, find hidden patterns | Customer segmentation, anomaly detection | SageMaker |
| **Reinforcement Learning** | Agent learns by trial, error, and rewards | Game playing, robotics, RLHF | SageMaker + RLHF |
| **Semi-Supervised** | Mix of labeled and unlabeled data | Medical imaging with few labeled scans | SageMaker |
| **Self-Supervised** | Model creates its own labels | LLM pre-training (predict next word) | Foundation Models |

### ML Problem Types

| Problem Type | Output | Example | Algorithm |
|-------------|--------|---------|-----------|
| **Classification** | Category label | Spam/not spam | Logistic Regression, XGBoost |
| **Regression** | Continuous number | House price, exam score | Linear Regression |
| **Clustering** | Groups with no labels | Customer segments | K-Means |
| **Recommendation** | Ranked list of items | Product suggestions | Collaborative Filtering |
| **Anomaly Detection** | Flag outliers | Fraud, equipment failure | Isolation Forest |
| **Object Detection** | Bounding boxes + labels in images | Self-driving cars | CNN, YOLO |
| **NLP / Text** | Translated/summarized/analyzed text | Chatbots, search | Transformers, BERT |

### The ML Pipeline (Ordering Question Favorite)

```
Step 1: DATA COLLECTION       -> Gather raw data from sources
Step 2: DATA CLEANING         -> Remove nulls, duplicates, fix errors
Step 3: FEATURE ENGINEERING   -> Create/select the input variables (features)
Step 4: MODEL TRAINING        -> Feed labeled data to the algorithm
Step 5: MODEL EVALUATION      -> Measure accuracy, precision, recall, F1
Step 6: HYPERPARAMETER TUNING -> Optimize model settings (not learned, set by you)
Step 7: DEPLOYMENT            -> Serve predictions to real users
Step 8: MONITORING            -> Watch for drift, degradation, bias
```

### Model Evaluation Metrics

| Metric | Measures | Best For |
|--------|---------|----------|
| **Accuracy** | % correct predictions | Balanced datasets |
| **Precision** | Of predicted positives, how many are right? | Spam detection (avoid false alarms) |
| **Recall** | Of actual positives, how many did we catch? | Disease detection (catch all cases) |
| **F1 Score** | Harmonic mean of precision + recall | Imbalanced datasets |
| **AUC-ROC** | Model's ability to separate classes | Binary classification |
| **RMSE** | Root Mean Squared Error -- regression error | Regression problems |

### Types of Model Bias

| Bias Type | Definition |
|-----------|-----------|
| **Sampling Bias** | Training data doesn't represent the real population |
| **Label Bias** | Incorrect or subjective labels in training data |
| **Historical Bias** | Patterns in historical data reflect past unfairness |
| **Confirmation Bias** | Model reinforces existing assumptions in the data |
| **Measurement Bias** | Data collected inconsistently across groups |
| **Algorithmic Bias** | The model design itself amplifies disparities |
| **Exclusion Bias** | Important groups are left out of the training data |

### AI/ML Security Threats

| Threat | What It Means |
|--------|--------------|
| **Prompt Injection** | Malicious input manipulates model behavior |
| **Data Poisoning** | Attacker corrupts training data to break the model |
| **Model Inversion** | Reverse-engineer training data from model outputs |
| **Membership Inference** | Determine if specific data was in the training set |
| **Adversarial Attacks** | Subtle input changes fool the model (e.g., stop sign with sticker) |
| **Data Leakage** | Model inadvertently exposes private training data |

---

## 13. Responsible AI -- The GRIPE Framework

> [TARGET] **Mnemonic:** **G.R.I.P.E.** -- Governance, Robustness, Interpretability/Explainability, Privacy & Security, Equity/Fairness

### The 5 Dimensions Explained

| Dimension | What It Means | AWS Tools | Exam Keywords |
|-----------|--------------|-----------|---------------|
| **G -- Governance** | Policies, oversight, accountability for AI decisions | CloudTrail, AWS Config, AWS Organizations, Model Cards | "Audit", "compliance", "accountability", "policy" |
| **R -- Robustness** | Model performs reliably under varied/adversarial conditions | SageMaker Model Monitor, A2I (human review) | "Drift", "reliability", "adversarial", "consistent" |
| **I -- Interpretability / Explainability** | Humans can understand why the model made a decision | SageMaker Clarify, SageMaker Debugger | "Why did it decide", "black box", "explain", "transparent" |
| **P -- Privacy & Security** | Protect data used in AI systems | Macie, KMS, VPC, IAM, Secrets Manager | "PII", "data protection", "encryption", "access control" |
| **E -- Equity / Fairness** | Model doesn't discriminate against protected groups | SageMaker Clarify (bias detection) | "Bias", "fairness", "demographic", "discrimination" |

### GRIPE AWS Tool Mapping

| AWS Tool | GRIPE Dimension(s) |
|----------|-------------------|
| **SageMaker Clarify** | Equity (bias) + Interpretability |
| **SageMaker Model Monitor** | Robustness (drift detection) |
| **Amazon A2I (Augmented AI)** | Robustness (human review loop) |
| **AWS CloudTrail** | Governance (audit log of all API calls) |
| **AWS Config** | Governance (resource configuration compliance) |
| **Amazon Macie** | Privacy (PII detection in S3) |
| **AWS KMS** | Privacy (encryption key management) |
| **Bedrock Guardrails** | Governance + Equity (content filtering) |
| **IAM + SCPs** | Governance + Privacy |

> [TARGET] **Exam Pro Tip:** GRIPE dimensions often *overlap* in a single scenario. A question about "detecting unfair outcomes in a loan approval model" touches **Equity (E)** AND **Interpretability (I)** AND **Governance (G)**. Identify the PRIMARY dimension the question emphasizes.

### Responsible AI -- Hiring Analogy

```
Imagine hiring for a company:
G -- Governance:       HR policies, documentation, who's responsible for decisions
R -- Robustness:       Ensure the hiring process works even under unusual conditions
I -- Interpretability: Being able to explain WHY a candidate was selected
P -- Privacy:          Keeping candidate data confidential and secure
E -- Equity:           No discrimination based on gender, race, age, etc.
```

---

## 14. Disaster Recovery & High Availability

### DR Strategies (Ordered from cheapest to most expensive)

```
1. BACKUP & RESTORE        -> Cheapest. Backup data to S3/Glacier. Restore when needed.
                              RTO: Hours | RPO: Hours
                              
2. PILOT LIGHT             -> Core services running minimally in DR region (DB replication only).
                              RTO: Minutes-Hours | RPO: Minutes
                              
3. WARM STANDBY            -> Scaled-down full copy running in DR region.
                              RTO: Minutes | RPO: Seconds-Minutes
                              
4. MULTI-SITE / HOT STANDBY -> Full active-active setup in multiple regions.
                              RTO: Near-zero | RPO: Near-zero
                              Most expensive
```

> [TARGET] **Key Terms:**
> - **RTO** (Recovery Time Objective) = How long can you be down? (Time to recover)
> - **RPO** (Recovery Point Objective) = How much data can you lose? (Data age at recovery)

### High Availability Services

| Service | HA Mechanism |
|---------|-------------|
| **RDS Multi-AZ** | Synchronous standby in another AZ; auto-failover |
| **Aurora** | 6 copies across 3 AZs; auto-failover in <30 seconds |
| **DynamoDB** | Built-in multi-AZ + Global Tables (multi-region) |
| **S3** | 11 nines durability; replicated across AZs automatically |
| **ELB + ASG** | Distribute traffic + auto-replace failed instances |
| **Route 53 Failover** | DNS-level failover to healthy endpoint |
| **CloudFront** | Edge caching for static content resilience |

### AWS Global Infrastructure

| Term | Definition |
|------|-----------|
| **Region** | Geographic cluster of data centers (e.g., us-east-1) |
| **Availability Zone (AZ)** | One or more isolated data centers within a Region |
| **Edge Location** | CloudFront CDN cache point -- closer to users |
| **Local Zone** | AWS infrastructure closer to large metros |
| **Outposts** | AWS hardware in YOUR data center |
| **Wavelength** | AWS at the 5G network edge |

---

## 15. Cost Management & Pricing Models

### Cost Management Tools

| Tool | Purpose |
|------|---------|
| **AWS Cost Explorer** | Visualize, analyze, and forecast spending |
| **AWS Budgets** | Set cost/usage alerts, trigger actions |
| **AWS Cost and Usage Report (CUR)** | Detailed billing data, most granular |
| **AWS Trusted Advisor** | Cost optimization recommendations + security checks |
| **AWS Compute Optimizer** | Rightsize EC2, Lambda, EBS for cost + performance |
| **AWS Savings Plans** | Commit to consistent usage -> savings |
| **Reserved Instances** | 1 or 3-year commitment -> up to 72% off |
| **Spot Instances** | Bid on unused capacity -> up to 90% off |

### The 4 Pricing Principles

```
1. PAY AS YOU GO       -> No upfront, no long-term contracts (On-Demand)
2. SAVE WHEN YOU RESERVE -> Commit for 1-3 years, save up to 72%
3. PAY LESS FOR MORE   -> Volume discounts (S3 data transfer tiers)
4. AWS PASSES SAVINGS  -> As AWS grows, prices drop over time
```

### Cost Optimization Architecture Patterns

| Pattern | How to Achieve |
|---------|---------------|
| **Rightsize** | Use Compute Optimizer; don't over-provision |
| **Elasticity** | Auto Scaling -- scale down when demand drops |
| **Spot for Batch** | Use Spot Instances for non-critical batch jobs |
| **S3 Lifecycle** | Auto-move data to cheaper tiers over time |
| **Data Transfer** | Keep traffic within the same region; use CloudFront |
| **Managed Services** | Use managed RDS/DynamoDB vs. self-managed EC2+DB |

---

## 16. Migration & Transfer Services

### Migration Services Decision Matrix

| Scenario | Service |
|---------|---------|
| Move a server (physical/VM) to EC2 | **AWS Application Migration Service (MGN)** |
| Move a database to RDS/Aurora | **AWS Database Migration Service (DMS)** |
| Move an Oracle/SQL Server to cloud | **AWS Schema Conversion Tool (SCT)** + DMS |
| Migrate large amounts of data physically | **AWS Snowball / Snowball Edge** |
| Migrate petabytes, entire data centers | **AWS Snowmobile** |
| Track all migrations in one place | **AWS Migration Hub** |
| Discover on-prem servers before migrating | **AWS Application Discovery Service** |
| Continuous data replication to AWS | **AWS DataSync** |

> [TARGET] **Exam Trap:** "Migrate Linux server running Oracle DB to EC2" -> **Application Migration Service** (MGN), NOT DMS. Because the target is EC2 (a server), not RDS (a database service).

---

## 17. Developer Tools & DevOps

### CI/CD Pipeline Services

```
CODE           -> CodeCommit (Git repository) or GitHub
BUILD          -> CodeBuild (compile, test, package)
DEPLOY         -> CodeDeploy (deploy to EC2, Lambda, ECS)
PIPELINE       -> CodePipeline (orchestrate all stages)
ALL-IN-ONE     -> CodeStar (full project setup) or CodeCatalyst
```

### Infrastructure as Code (IaC)

| Service | Language | Purpose |
|---------|---------|---------|
| **CloudFormation** | JSON/YAML | AWS-native IaC; deploy entire stacks |
| **CDK (Cloud Dev Kit)** | Python, TypeScript, Java | Write CloudFormation in real code |
| **Elastic Beanstalk** | Config files | PaaS -- abstracts IaC for you |
| **Terraform** (3rd-party) | HCL | Multi-cloud IaC |
| **AWS SAM** | YAML | Serverless application model |

### Monitoring & Observability

| Service | Monitors | Output |
|---------|---------|--------|
| **CloudWatch** | Metrics, logs, events | Dashboards, alarms, log groups |
| **CloudTrail** | API calls (who did what) | Audit trail, compliance |
| **AWS Config** | Resource configuration history | Compliance rules, drift detection |
| **X-Ray** | Distributed tracing | Request flow visualization |
| **Health Dashboard** | AWS service health | Status page for AWS services |

---

## 18. Management & Governance

### AWS Organizations

| Feature | Purpose |
|---------|---------|
| **Management Account** | Root account that owns the org |
| **Member Accounts** | Workload accounts (dev, prod, etc.) |
| **Organizational Unit (OU)** | Group accounts by team/environment |
| **SCP (Service Control Policy)** | Deny specific services org-wide |
| **Consolidated Billing** | One bill for all accounts; volume discounts |

### Support Plans

| Plan | Price | Features |
|------|-------|---------|
| **Basic** | Free | Documentation, forums, health checks |
| **Developer** | ~$29/mo | Business hours email, 1 contact |
| **Business** | ~$100/mo | 24/7 phone/chat, Trusted Advisor full, API |
| **Enterprise On-Ramp** | ~$5,500/mo | Pool of TAMs, concierge support |
| **Enterprise** | ~$15,000/mo | Dedicated TAM, concierge, white-glove |

### Cloud Adoption Framework (CAF) -- 6 Perspectives

```
BUSINESS    -> ROI, business outcomes, stakeholder alignment
PEOPLE      -> HR, training, change management, culture
GOVERNANCE  -> Risk, compliance, program management
PLATFORM    -> Architecture, infrastructure, cloud standards
SECURITY    -> Data protection, IAM, incident response
OPERATIONS  -> Monitoring, ITSM, incident/change management
```

> [TARGET] **Memory Aid:** **B-P-G-P-S-O** -> "**B**ig **P**rojects **G**enerally **P**roduce **S**trong **O**utcomes"

---

## 19. Application Integration & Messaging

### Messaging Services Decision Matrix

| Scenario | Service | Key Trait |
|---------|---------|-----------|
| Decouple microservices; one consumer | **SQS** | Queue (pull-based, one consumer) |
| Fan-out to multiple subscribers | **SNS** | Pub/Sub (push-based, many subscribers) |
| Complex workflows, multi-step orchestration | **Step Functions** | Visual workflow state machine |
| Event bus, route events between services | **EventBridge** | Event-driven routing |
| Real-time streaming, high throughput | **Kinesis** | Data streams |
| Managed Apache Kafka | **MSK** | Enterprise streaming |
| API routing | **API Gateway** | HTTP/WebSocket APIs |

### SQS vs. SNS (Critical Differentiator)

| | SQS | SNS |
|--|-----|-----|
| **Pattern** | Queue (point-to-point) | Topic (publish-subscribe) |
| **Consumers** | One consumer pulls messages | Many subscribers pushed to |
| **Message Retention** | Up to 14 days | Not stored |
| **Use Case** | Order processing queue | Alert broadcast, fan-out |
| **Analogy** | Mailbox | Megaphone broadcast |

---

## 20. Well-Architected Framework -- 6 Pillars

> [TARGET] **Mnemonic:** **OSRPCS** -> "**O**ur **S**ystem **R**uns **P**erfectly **C**ost-**S**mart"

### The 6 Pillars

| Pillar | Core Question | Key Services |
|--------|--------------|-------------|
| **1. Operational Excellence** | Are we running and improving operations? | CloudWatch, CloudTrail, X-Ray, Config |
| **2. Security** | Are we protecting data and systems? | IAM, KMS, Shield, WAF, GuardDuty |
| **3. Reliability** | Will our system recover from failures? | Route 53 failover, Multi-AZ, ASG, Backup |
| **4. Performance Efficiency** | Are we using resources efficiently? | Auto Scaling, CloudFront, ElastiCache |
| **5. Cost Optimization** | Are we spending only what we need? | Cost Explorer, Savings Plans, Spot |
| **6. Sustainability** | Are we minimizing environmental impact? | Graviton, Managed Services, right-sizing |

### Well-Architected Design Principles

| Pillar | Key Design Principles |
|--------|----------------------|
| **Operational Excellence** | IaC, frequent small changes, anticipate failure, learn from events |
| **Security** | Least privilege, enable traceability, protect data in transit + at rest |
| **Reliability** | Auto recover, test recovery procedures, scale horizontally |
| **Performance Efficiency** | Use serverless, experiment often, go global in minutes |
| **Cost Optimization** | Adopt consumption model, measure efficiency, stop guessing capacity |
| **Sustainability** | Minimize waste, use managed services, reduce footprint |

---

## 21. AWS Cloud Adoption Framework (CAF)

### CAF Transformation Phases

```
Phase 1: ENVISION  -> Identify transformation opportunities; build the business case
Phase 2: ALIGN     -> Map to 6 CAF perspectives; identify gaps; create action plan
Phase 3: LAUNCH    -> Build and deliver pilot initiatives in production
Phase 4: SCALE     -> Expand pilots to full production; realize business benefits
```

### CAF Transformation Domains

| Domain | Focus Area |
|--------|-----------|
| **Technology** | Migrate and modernize legacy infrastructure |
| **Process** | Digitize, automate, and optimize business operations |
| **Organization** | Reorganize teams around products; adopt agile |
| **Product** | Create new value propositions and revenue models |

---

## 22. Ordering Questions Collections

> Ordering questions ask you to arrange steps in the correct sequence. Anchor on the **first** and **last** step first, then fill in the middle.

### Collection A: The ML Pipeline (AIF-C01)
```
1. Define the business problem
2. Collect and gather data
3. Clean and pre-process data
4. Feature engineering (create/select inputs)
5. Choose and train a model
6. Evaluate model performance
7. Tune hyperparameters
8. Deploy model to production
9. Monitor for drift and degradation
```

### Collection B: Deploying a Secure Web App on AWS (SAA-C03)
```
1. Create a VPC with public and private subnets
2. Launch EC2 instances in private subnets
3. Set up an Application Load Balancer in public subnets
4. Configure Security Groups and NACLs
5. Set up RDS in private subnet with Multi-AZ
6. Configure Auto Scaling Group for EC2
7. Attach CloudFront in front of the ALB
8. Enable CloudTrail and CloudWatch monitoring
9. Set up AWS WAF rules on CloudFront/ALB
```

### Collection C: RAG (Retrieval-Augmented Generation) Workflow (AIF-C01)
```
1. Prepare and chunk your source documents
2. Generate embeddings for each chunk
3. Store embeddings in a vector database
4. User submits a query/prompt
5. Generate embedding for the user query
6. Search vector DB for semantically similar chunks
7. Retrieve top-K relevant chunks
8. Augment the original prompt with retrieved context
9. Send augmented prompt to the Foundation Model
10. Return generated response to user
```

### Collection D: AWS Migration Process
```
1. Discover: Inventory on-prem servers (Application Discovery Service)
2. Assess: Evaluate dependencies, risks, and migration strategy
3. Plan: Choose migration pattern (Rehost, Replatform, Refactor, etc.)
4. Migrate: Move workloads (MGN for servers, DMS for databases)
5. Validate: Test migrated workloads in AWS
6. Optimize: Rightsize, use managed services, cut costs
7. Operate: Monitor with CloudWatch, CloudTrail
```

### Collection E: Incident Response on AWS
```
1. Detect: CloudWatch Alarm or GuardDuty finding triggers
2. Notify: SNS notification sent to security team
3. Isolate: Modify Security Group to block malicious traffic
4. Investigate: Review CloudTrail logs and VPC Flow Logs
5. Eradicate: Terminate compromised instances; rotate credentials
6. Recover: Restore from backup or launch clean instance
7. Post-mortem: Document and update runbooks
```

### Collection F: Setting Up Multi-Account AWS Organization
```
1. Create AWS Management (Root) Account
2. Enable AWS Organizations
3. Define Organizational Unit (OU) structure
4. Create Member Accounts for each OU
5. Apply Service Control Policies (SCPs) to OUs
6. Enable consolidated billing
7. Set up AWS SSO (IAM Identity Center) for access
8. Deploy guardrails with AWS Control Tower
```

---

## 23. Critical Differentiators & Exam Traps

### The Big 10 Differentiators (Most Tested)

| Pair | Use LEFT when... | Use RIGHT when... |
|------|-----------------|------------------|
| **SageMaker vs. Bedrock** | Training custom models | Using pre-built Foundation Models |
| **Textract vs. Comprehend** | Extracting from documents/images | Analyzing text meaning/sentiment |
| **SQS vs. SNS** | One consumer pulls messages | Broadcasting to many subscribers |
| **IAM vs. Cognito** | AWS console/API access | Your app's end-user authentication |
| **CloudTrail vs. CloudWatch** | Audit who did what (API log) | Monitor performance metrics |
| **Inspector vs. GuardDuty** | Proactive vulnerability scan | Reactive threat detection |
| **RDS vs. DynamoDB** | Structured SQL, ACID transactions | Flexible schema, massive scale |
| **EC2 vs. Lambda** | Long-running, stateful, custom OS | Short events, stateless, serverless |
| **RAG vs. Fine-Tuning** | Dynamic, current data needed | Model behavior/style needs changing |
| **VPN vs. Direct Connect** | Quick setup, tolerate internet latency | Consistent speed, private connection |

### Common Exam Trap Patterns

| Trap | Correct Answer Logic |
|------|---------------------|
| Question mentions "Oracle database migrating to EC2" | Use **MGN** (server migration), NOT DMS |
| Question says "real-time" and "multiple consumers" | Probably **SNS** or **Kinesis**, not SQS |
| Question says "compliance" + "audit" + "who made changes" | **CloudTrail** |
| Question says "performance degradation" + "applications" | **CloudWatch** |
| Question says "PII" + "S3" | **Macie** |
| Question says "vulnerability" + "EC2" + "patching" | **Inspector** |
| Question says "chatbot" or "voice" | **Lex** |
| Question says "recommendation engine" | **Personalize** |
| Question says "search documents with natural language" | **Kendra** |
| Question says "extract text from scanned PDF" | **Textract** |

---

## 24. Mnemonic Memory Aids

### Master Mnemonics Collection

| Concept | Mnemonic | What It Stands For |
|---------|----------|--------------------|
| **Responsible AI** | **GRIPE** | Governance, Robustness, Interpretability, Privacy, Equity |
| **Well-Architected Pillars** | **OSRPCS** | Operational Excellence, Security, Reliability, Performance, Cost, Sustainability |
| **CAF Perspectives** | **BPGPSO** | Business, People, Governance, Platform, Security, Operations |
| **CAF Phases** | **EALS** | Envision, Align, Launch, Scale |
| **EC2 Instance Families** | **MCGBF** | Memory-General-Compute-GPU-Burst |
| **DR Strategies** | **BPWM** | Backup+Restore, Pilot Light, Warm Standby, Multi-Site |
| **Migration 7Rs** | **7Rs** | Retire, Retain, Rehost, Relocate, Replatform, Repurchase, Refactor |
| **S3 Storage Tiers** | Hot -> Cold | Standard -> Intelligent -> IA -> One Zone -> Glacier -> Deep Archive |

### The 7 Rs of Cloud Migration

```
RETIRE      -> Decommission; no longer needed
RETAIN      -> Keep on-premises (not ready to migrate)
REHOST      -> "Lift and Shift" -- move as-is to EC2
RELOCATE    -> Move to AWS Managed Service (e.g., VMware Cloud on AWS)
REPLATFORM  -> "Lift, Tinker, and Shift" -- minor optimization (e.g., move to RDS)
REPURCHASE  -> Move to SaaS product (e.g., Salesforce)
REFACTOR    -> Re-architect for cloud-native (e.g., monolith -> microservices)
```

### Quick-Fire Service to Purpose Map

```
Route 53        = DNS + Health Checks
CloudFront      = CDN (cache at edge)
WAF             = Block bad web traffic
Shield          = Block DDoS
GuardDuty       = Detect threats in logs
Macie           = Find PII in S3
Inspector       = Scan EC2 for CVEs
CloudTrail      = Log every API call
Config          = Track config changes
Trusted Advisor = Recommendations (cost, security, performance)
Cost Explorer   = Visualize your bill
Budgets         = Set spending alerts
Savings Plans   = Commit for savings
Spot Instances  = Cheapest compute (interruptible)
Fargate         = Serverless containers
Lambda          = Serverless functions
Kinesis         = Real-time data streams
Glue            = Serverless ETL
Athena          = SQL queries on S3
Redshift        = Data warehouse
QuickSight      = BI dashboards
SageMaker       = Build/train custom ML models
Bedrock         = Use foundation models via API
Lex             = Build chatbots
Polly           = Text to speech
Transcribe      = Speech to text
Textract        = Extract text from documents
Comprehend      = NLP on text
Rekognition     = Image/video analysis
Personalize     = Recommendations
Kendra          = Enterprise search
Translate       = Language translation
Forecast        = Time-series prediction
Fraud Detector  = ML fraud detection
A2I             = Human review of ML predictions
```

---

##  Final Exam Day Checklist

- [ ] Read each question fully before looking at answers
- [ ] Identify the KEY VERB: Detect, Extract, Analyze, Train, Deploy, Protect
- [ ] Eliminate obviously wrong answers first (usually 2 can be cut quickly)
- [ ] For cost questions: serverless and managed > self-managed EC2
- [ ] For security questions: least privilege principle applies always
- [ ] For AI questions: RAG vs. fine-tuning, SageMaker vs. Bedrock are most common traps
- [ ] Flag uncertain questions and return -- never leave blanks
- [ ] Trust GRIPE for any Responsible AI scenario
- [ ] Trust Well-Architected pillars for any architecture design question
- [ ] You need **700/1000** to pass AIF-C01 -- aim for 850+

---

*Last Updated: April 2026 | Covers AIF-C01, SAA-C03, CLF-C02*
