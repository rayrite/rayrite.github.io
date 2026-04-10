# 🧠 SAA-C03 Exam Strategy Guide — v2: Prevalence-Ordered Edition
### Reorganized by Actual Question Frequency from 745 Real Exam Questions

> **What's different about this version?** Version 1 was organized by topic. Version 2 is organized by *how often each concept actually appears on the exam*. The sections you see first are the ones most likely to appear on your test. Study top-down and you're covering the highest-value material first.

---

## 📊 How This Guide Is Ordered

We analyzed 745 SAA-C03 practice exam questions and counted how often each service and scenario pattern appeared. The results drive the order of every section in this guide:

| Priority Tier | Service/Concept | Questions | % of Exam |
|--------------|-----------------|-----------|-----------|
| **Tier 1** | EC2 | 353 | 47% |
| **Tier 1** | S3 | 282 | 38% |
| **Tier 1** | Scalability/Performance scenarios | 273 | 37% |
| **Tier 1** | Security/Encryption scenarios | 221 | 30% |
| **Tier 1** | Migration scenarios | 198 | 27% |
| **Tier 1** | Lambda | 189 | 25% |
| **Tier 1** | Cost/Budget | 163 | 22% |
| **Tier 1** | RDS | 143 | 19% |
| **Tier 2** | "Least Operational Overhead" qualifier | 124 | 17% |
| **Tier 2** | Auto Scaling | 122 | 16% |
| **Tier 2** | ALB/NLB/ELB | 121 | 16% |
| **Tier 2** | Private Connectivity/Networking | 120 | 16% |
| **Tier 2** | Cost Optimization qualifier | 101 | 14% |
| **Tier 2** | VPC | 95 | 13% |
| **Tier 2** | HA/Failover/DR | 92 | 12% |
| **Tier 2** | DynamoDB | 86 | 12% |
| **Tier 2** | Monitoring/Logging | 86 | 12% |
| **Tier 3** | CloudFront | 78 | 10% |
| **Tier 3** | EBS | 71 | 10% |
| **Tier 3** | ECS/EKS/Fargate | 69 | 9% |
| **Tier 3** | CloudWatch | 66 | 9% |
| **Tier 3** | IAM | 61 | 8% |
| **Tier 3** | SQS | 57 | 8% |
| **Tier 3** | Decoupling/Serverless scenarios | 55 | 7% |
| **Tier 3** | API Gateway | 52 | 7% |
| **Tier 3** | EventBridge | 50 | 7% |
| **Tier 3** | Aurora | 49 | 7% |
| **Tier 4** | SNS, Route 53, KMS, EFS | 42–46 each | 6% |
| **Tier 4** | ElastiCache, Kinesis, FSx | 34–38 each | 5% |
| **Tier 4** | Direct Connect, Config, Athena, Glue, Redshift, Systems Manager | 25–30 each | 3–4% |
| **Tier 4** | WAF, Storage Gateway, GuardDuty, Global Accelerator | 20–22 each | 3% |
| **Tier 4** | ACM, CloudFormation, Macie, Secrets Manager, Step Functions | 10–19 each | 1–2% |

---

## 📋 Table of Contents (Prevalence Order)

1. [The 7-Step Scenario Strategy (Meta-Skill)](#1-the-7-step-scenario-strategy)
2. [EC2 — Compute Foundation (47% of questions)](#2-ec2--compute-foundation)
3. [S3 — Storage Foundation (38% of questions)](#3-s3--storage-foundation)
4. [Scalability & Performance Patterns (37%)](#4-scalability--performance-patterns)
5. [Security & Encryption (30%)](#5-security--encryption)
6. [Migration Patterns (27%)](#6-migration-patterns)
7. [Lambda & Serverless (25%)](#7-lambda--serverless)
8. [Cost Management & Optimization (22%)](#8-cost-management--optimization)
9. [RDS, Aurora & Database Selection (19%)](#9-rds-aurora--database-selection)
10. [Auto Scaling & Load Balancing (16%)](#10-auto-scaling--load-balancing)
11. [VPC & Private Connectivity (16%)](#11-vpc--private-connectivity)
12. [High Availability & Disaster Recovery (12%)](#12-high-availability--disaster-recovery)
13. [DynamoDB & NoSQL (12%)](#13-dynamodb--nosql)
14. [Monitoring, Logging & Observability (12%)](#14-monitoring-logging--observability)
15. [CloudFront & Content Delivery (10%)](#15-cloudfront--content-delivery)
16. [EBS & Block Storage (10%)](#16-ebs--block-storage)
17. [Containers: ECS, EKS & Fargate (9%)](#17-containers-ecs-eks--fargate)
18. [IAM & Access Management (8%)](#18-iam--access-management)
19. [Application Integration: SQS, SNS, EventBridge (8%)](#19-application-integration-sqs-sns-eventbridge)
20. [API Gateway (7%)](#20-api-gateway)
21. [Specialist Services: Analytics, Caching, File Systems (3–6%)](#21-specialist-services)
22. [AWS Cloud Adoption Framework (CAF)](#22-aws-cloud-adoption-framework-caf)
23. [Ordering Questions Collections](#23-ordering-questions-collections)
24. [Critical Differentiators & Exam Traps](#24-critical-differentiators--exam-traps)
25. [Mnemonic Memory Aids](#25-mnemonic-memory-aids)

---

## 1. The 7-Step Scenario Strategy

This is the meta-skill that applies to every single question. Over 300 of the 745 questions used qualifier phrases like "LEAST operational overhead," "MOST cost-effective," or "with the FEWEST changes." Recognizing and responding to these qualifiers is the single most valuable exam skill.

### The 7 Steps

```
1. IDENTIFY THE GOAL      → What does the question want? (migrate, secure, scale, optimize?)
2. IDENTIFY THE DOMAIN     → Which Well-Architected pillar? (security, reliability, cost, performance?)
3. EXTRACT KEYWORDS        → Underline clue words: "serverless," "on-premises," "real-time," "audit"
4. DETERMINE CONSTRAINTS   → Budget limit? Existing database? On-premises? OS requirement?
5. MAP THE PATTERN         → Match keywords to the service pattern you've studied
6. ELIMINATE WRONG ANSWERS → Rule out services that don't fit the domain
7. SELECT THE BEST FIT     → Of remaining options, which is most specific/managed?
```

### Qualifier Phrase Decoder

These phrases appeared in hundreds of questions. They are **instructions**, not decoration:

| Qualifier Phrase | What It Really Means | How to Answer |
|-----------------|---------------------|---------------|
| "Least operational overhead" | Choose the most managed/serverless option | Fargate > ECS on EC2; RDS > DB on EC2; Lambda > EC2 |
| "Most cost-effective" | Choose the cheapest option that still works | Spot Instances, S3 Intelligent-Tiering, Lambda, reserved capacity |
| "With the fewest changes" | Don't re-architect; minimize code/config changes | Rehost > Refactor; EFS mount > rewrite to S3 API |
| "Highest availability" | Multi-AZ, multi-Region, auto-failover | Aurora Multi-AZ, DynamoDB Global Tables, Route 53 failover |
| "Most secure" | Encryption + least privilege + private networking | KMS, VPC endpoints, IAM roles (not keys), private subnets |
| "Best performance" | Lowest latency, highest throughput | CloudFront, ElastiCache, read replicas, placement groups |

> 🎯 **If two answers seem correct, the *more managed* or *more specific* service is usually right.** AWS loves recommending its purpose-built services over general-purpose ones.

**Example from Q4 (id:4):** "Limit S3 access to only users within the organization... LEAST operational overhead." Four options ranged from simple (add `aws:PrincipalOrgID` to bucket policy) to complex (tag every user, monitor CloudTrail events). The simplest, most managed answer — the condition key — was correct.

---

## 2. EC2 — Compute Foundation

**Appeared in 353 of 745 questions (47%).** EC2 is the backbone of nearly half the exam. Even questions about other services often have EC2 in the architecture.

### Decision Matrix: Which Compute to Use?

| Scenario Keyword | Service to Choose | Why |
|-----------------|-------------------|-----|
| Full control, custom OS, legacy app | **EC2** | Virtual machine — full OS access |
| Event-driven, short tasks (<15 min), no server management | **Lambda** | Serverless — runs code on triggers |
| Docker containers, managed cluster | **ECS** | AWS-native container orchestration |
| Kubernetes, open-source, container | **EKS** | Managed Kubernetes |
| Containers WITHOUT managing servers | **Fargate** | Serverless containers |
| Deploy app without caring about infrastructure | **Elastic Beanstalk** | PaaS — auto-handles EC2, scaling, LB |
| Batch processing, HPC jobs | **AWS Batch** | Managed batch computing |
| Run code at edge/CDN locations | **Lambda@Edge** | Lambda running inside CloudFront |

### EC2 Instance Types (Memory Aid: **MCGRI**)

| Family | Optimized For | Mnemonic |
|--------|--------------|---------|
| **M** – General Purpose | Balanced CPU/RAM | **M**oderate everything |
| **C** – Compute Optimized | High CPU, scientific work | **C**runching numbers |
| **G/P** – GPU Instances | ML training, graphics | **G**raphics/GPU |
| **R/X** – Memory Optimized | In-memory databases, big data | **R**AM-heavy |
| **I/D** – Storage Optimized | Fast local NVMe disk, data warehousing | **I**O intensive |

### EC2 Pricing Models

| Model | Best For | Savings vs. On-Demand |
|-------|---------|----------------------|
| **On-Demand** | Short-term, unpredictable | Baseline (0%) |
| **Reserved Instances (1–3 yr)** | Steady-state predictable workloads | Up to 72% |
| **Savings Plans** | Flexible commitment (any instance family) | Up to 66% |
| **Spot Instances** | Fault-tolerant, interruptible workloads | Up to 90% |
| **Dedicated Hosts** | Compliance, BYOL (Bring Your Own License) | Varies |

> 🎯 **Exam Trap:** "Batch job that can be interrupted" → **Spot**. "Web server that must stay up" → **Reserved**. "One-time script tonight" → **On-Demand**.

### EC2 Placement Groups

| Type | What It Does | Use Case |
|------|-------------|----------|
| **Cluster** | All instances in same AZ, low-latency network | HPC, tightly coupled workloads |
| **Spread** | Instances on different hardware | Critical instances that must not fail together |
| **Partition** | Groups on isolated racks | Large distributed systems (Hadoop, Kafka) |

**Example from the question set (slide 3576):** "Minimize data transfer charges" → Cluster placement group in same AZ. This is because intra-AZ traffic is free, and cluster placement groups guarantee low-latency, high-bandwidth connections.

---

## 3. S3 — Storage Foundation

**Appeared in 282 of 745 questions (38%).** S3 is the second most-tested service. Questions range from storage class selection to encryption, replication, access control, and integration with other services.

### Storage Decision Matrix: Which Storage to Use?

| Scenario Keyword | Service | Storage Type |
|-----------------|---------|-------------|
| Files, photos, backups, websites, data lake | **S3** | Object |
| Boot volume for an EC2 instance | **EBS** | Block |
| Shared file system across multiple EC2s (Linux) | **EFS** | File (NFS) |
| Shared file system for Windows servers | **FSx for Windows** | File (SMB) |
| High-performance HPC file system | **FSx for Lustre** | File (Lustre) |
| Long-term archive, rarely accessed | **S3 Glacier** | Archive/Object |
| Physical data transfer (petabytes) | **Snowball / Snowmobile** | Physical Transfer |
| Hybrid — on-prem to cloud NFS/SMB with local caching | **Storage Gateway** | Hybrid |

### S3 Storage Classes (Hot → Cold)

```
STANDARD           → Frequently accessed, millisecond retrieval
INTELLIGENT-TIERING → Unknown/unpredictable access pattern; auto-moves between tiers
STANDARD-IA        → Infrequent access but instant retrieval when needed
ONE ZONE-IA        → Same as IA but single AZ (cheaper, less resilient)
GLACIER INSTANT    → Archive but instant (milliseconds) retrieval
GLACIER FLEXIBLE   → Archive, retrieval in minutes to hours
DEEP ARCHIVE       → Coldest/cheapest, retrieval in 12–48 hours
```

> 🎯 **Memory Aid:** Think of temperature — **Standard = Hot**, **Deep Archive = Frozen**. Each tier trades retrieval speed for cost savings.

**Example from the question set (slide 4656):** "Cannot predict or control access pattern... reduce S3 costs" → S3 Lifecycle rules to transition to **S3 Intelligent-Tiering**. The keyword "cannot predict" is the direct trigger for Intelligent-Tiering.

### S3 Key Features for SAA-C03

| Feature | Purpose | Exam Trigger |
|---------|---------|-------------|
| **Versioning** | Keep multiple versions; recover deleted objects | "recover," "accidental deletion" |
| **MFA Delete** | Require MFA to delete object versions | "prevent deletion," "compliance" |
| **Replication (CRR/SRR)** | Copy objects across regions or within a region | "cross-region backup," "compliance copy" |
| **S3 Transfer Acceleration** | Speed up uploads using CloudFront edge locations | "upload speed," "global users uploading" |
| **Object Lock / WORM** | Write Once Read Many — prevent overwrites | "compliance," "regulatory," "immutable" |
| **Lifecycle Policies** | Auto-transition objects to cheaper storage tiers | "reduce cost," "after 30 days" |
| **Server-Side Encryption** | SSE-S3, SSE-KMS, SSE-C (customer key) | "encryption at rest" |
| **Presigned URLs** | Temporary access to private objects | "temporary download link" |
| **S3 Event Notifications** | Trigger Lambda/SQS/SNS on object events | "when uploaded," "trigger processing" |

### Storage Gateway Deep Dive

Storage Gateway appeared in 22 questions — it bridges on-premises and AWS storage. Three modes, three use cases:

| Gateway Type | Protocol | Backed By | Use When |
|-------------|----------|-----------|----------|
| **File Gateway** | NFS / SMB | S3 | On-prem apps need file share, data lands in S3 |
| **Volume Gateway — Cached** | iSCSI | S3 + local cache | Block storage, only recent data local |
| **Volume Gateway — Stored** | iSCSI | Local + S3 backup | Full data local, async backup to S3 |
| **Tape Gateway** | iSCSI/VTL | S3 Glacier | Replace physical tape backups |

**Example from the question set (slide 3583):** "Minimize iSCSI storage on-premises... only recently accessed data locally" → **Volume Gateway cached volumes**. The keyword "recently accessed + local" points directly to cached mode.

**Example from the question set (slide 4770):** "Running out of storage... block + NFS" → **Volume Gateway** (for block) + **File Gateway** (for NFS). Two gateways for two protocols.

---

## 4. Scalability & Performance Patterns

**Appeared in 273 of 745 questions (37%).** This is the single most common scenario theme. These questions ask you to design architectures that handle growing traffic, reduce latency, or increase throughput.

### Key Scalability Patterns

| Pattern | Implementation | When to Use |
|---------|---------------|-------------|
| **Horizontal scaling** | Auto Scaling Group + ALB | Web apps with variable traffic |
| **Vertical scaling** | Change EC2 instance type | Quick fix, but has a ceiling |
| **Caching** | ElastiCache or CloudFront | Reduce database load / reduce latency |
| **Read replicas** | RDS Read Replicas or Aurora Replicas | Read-heavy database workloads |
| **Decoupling** | SQS queue between tiers | CPU bottleneck on workers |
| **Serverless** | Lambda + API Gateway | Event-driven, unpredictable traffic |
| **CDN** | CloudFront | Global users, static content |
| **Database sharding** | DynamoDB partition keys | Massive-scale NoSQL |

**Example from the question set (slide 5154):** "EC2 at 100% CPU, some jobs not processing" → SQS queue + Auto Scaling based on queue depth. This is the classic **decoupling + horizontal scaling** pattern.

**Example from the question set (slide 5591):** "Process terabyte-sized videos, up to 20 minutes" → ECS + Fargate (not Lambda, which has a 15-minute timeout). The 20-minute duration eliminates Lambda.

---

## 5. Security & Encryption

**Appeared in 221 of 745 questions (30%).** Security is the #1 weighted domain on SAA-C03 (30% of score). Questions cover encryption, access control, network isolation, compliance, and threat detection.

### Security Services Decision Matrix

| Security Question | Service | Keyword Trigger |
|-------------------|---------|----------------|
| "Am I vulnerable?" — scan for CVEs | **Inspector** | "vulnerability," "patching," "CVE" |
| "Am I being attacked?" — threat detection | **GuardDuty** | "malicious," "anomalous," "threat" |
| "Is my sensitive data exposed in S3?" | **Macie** | "PII," "sensitive data," "S3" |
| "Protect from DDoS attacks" | **Shield** | "DDoS," "flood" |
| "Block SQL injection, XSS" | **WAF** | "web application firewall," "SQL injection" |
| "Who did what, when?" — API audit trail | **CloudTrail** | "audit," "who made changes," "API call" |
| "Centralize security findings" | **Security Hub** | "aggregate findings," "cross-account security" |
| "Manage encryption keys" | **KMS** | "encryption key," "CMK," "rotate keys" |
| "Store DB passwords, API keys" | **Secrets Manager** | "rotate," "credentials," "database password" |
| "Store config parameters (not secrets)" | **SSM Parameter Store** | "configuration," "non-sensitive parameters" |

### Encryption in AWS

| Where | Encryption Type | Who Manages Keys |
|-------|----------------|-----------------|
| S3 at rest | SSE-S3 | AWS manages everything |
| S3 at rest | SSE-KMS | You manage via KMS (audit trail) |
| S3 at rest | SSE-C | You provide the key per request |
| In transit | SSL/TLS | AWS Certificate Manager (ACM) |
| EBS volumes | KMS | You enable, KMS manages |
| RDS | KMS | You enable at creation |

**Example from the question set (id:3):** "Static S3 website, protect data in transit, don't manage rotation of secrets" → **ACM** (AWS Certificate Manager). GuardDuty, WAF, and Macie are distractors — none of them issue SSL/TLS certificates.

### Shared Responsibility Model

```
AWS RESPONSIBLE FOR ("Security OF the cloud"):
─────────────────────────────────────────────
Physical datacenters, hardware, hypervisor
Managed service infrastructure
Global network backbone

YOU RESPONSIBLE FOR ("Security IN the cloud"):
─────────────────────────────────────────────
Your data and its encryption
IAM users, roles, and permissions
OS patching (on EC2)
Application-level security
Security group and NACL configuration
```

---

## 6. Migration Patterns

**Appeared in 198 of 745 questions (27%).** Migration questions test your ability to move workloads from on-premises to AWS, choose the right migration strategy, and select the right transfer service.

### The 7 Rs of Cloud Migration

```
RETIRE      → Decommission; no longer needed
RETAIN      → Keep on-premises (not ready or no business case)
REHOST      → "Lift and Shift" — move as-is to EC2
RELOCATE    → Move to AWS Managed version (e.g., VMware Cloud on AWS)
REPLATFORM  → "Lift, Tinker, and Shift" — minor optimization (e.g., DB on EC2 → RDS)
REPURCHASE  → Move to SaaS product (e.g., on-prem CRM → Salesforce)
REFACTOR    → Re-architect for cloud-native (e.g., monolith → microservices + Lambda)
```

### Migration Services Decision Matrix

| Scenario | Service |
|---------|---------|
| Move a server (physical/VM) to EC2 | **AWS Application Migration Service (MGN)** |
| Move a database to RDS/Aurora | **AWS Database Migration Service (DMS)** |
| Convert Oracle/SQL Server schema for migration | **AWS Schema Conversion Tool (SCT)** + DMS |
| Migrate large data physically (terabytes) | **AWS Snowball / Snowball Edge** |
| Migrate petabytes, entire data centers | **AWS Snowmobile** |
| Track all migrations in one place | **AWS Migration Hub** |
| Discover on-prem servers before migrating | **AWS Application Discovery Service** |
| Continuous file/object data replication to AWS | **AWS DataSync** |

> 🎯 **Exam Trap:** "Migrate Linux server running Oracle DB to EC2" → **MGN** (server migration), NOT DMS. The target is EC2 (a server), not RDS (a database service). DMS is only for database-to-database migration.

---

## 7. Lambda & Serverless

**Appeared in 189 of 745 questions (25%).** Lambda is the third most-tested service. Questions focus on its constraints, event-driven architecture, and when Lambda is NOT the right choice.

### Lambda Key Constraints

| Constraint | Limit | Why It Matters |
|-----------|-------|---------------|
| **Execution timeout** | 15 minutes max | Jobs > 15 min → use ECS/Fargate or EC2 |
| **Memory** | Up to 10 GB | CPU scales proportionally with memory |
| **Deployment package** | 50 MB zipped / 250 MB unzipped | Large ML models won't fit |
| **Concurrent executions** | 1,000 default (can increase) | Throttling under heavy load |
| **Temporary storage** | 512 MB (/tmp) up to 10 GB | Use S3 or EFS for large files |

### When NOT to Use Lambda

| Scenario | Use Instead | Why |
|---------|-------------|-----|
| Processing > 15 minutes | ECS + Fargate | Lambda times out |
| Needs persistent local state | EC2 | Lambda is stateless |
| Custom OS or GPU | EC2 | Lambda has fixed runtime |
| Consistent always-on traffic | EC2 + ASG or Fargate | Lambda cold starts + cost at scale |

**Example from the question set (slide 5591):** "Video processing can take up to 20 minutes" → Lambda eliminated (15-min limit). Correct answer: ECS + Fargate.

---

## 8. Cost Management & Optimization

**Appeared in 163 of 745 questions (22%).** Cost questions are Domain 4 of SAA-C03 (20% of score). They test your ability to choose the cheapest solution that still meets requirements.

### Cost Management Tools

| Tool | Purpose | Exam Trigger |
|------|---------|-------------|
| **Cost Explorer** | Visualize, analyze, and forecast spending | "visualize bill," "forecast costs" |
| **AWS Budgets** | Set spending alerts, trigger actions | "alert when spending exceeds" |
| **Cost and Usage Report (CUR)** | Most granular billing data | "detailed billing," "line-item cost" |
| **Compute Optimizer** | Rightsize EC2, Lambda, EBS | "over-provisioned," "rightsize" |
| **Cost Anomaly Detection** | ML-based unusual spend alerts | "unusual spending," "anomaly" |
| **Savings Plans** | Commit to usage → savings | "predictable usage," "committed" |

### Cost Optimization Architecture Patterns

| Pattern | How to Achieve | Savings |
|---------|---------------|---------|
| **Rightsize** | Use Compute Optimizer; don't over-provision | 10–30% |
| **Elasticity** | Auto Scaling — scale down when demand drops | Variable |
| **Spot for Batch** | Use Spot Instances for fault-tolerant batch jobs | Up to 90% |
| **S3 Lifecycle** | Auto-move data to cheaper tiers over time | 40–90% on storage |
| **VPC Endpoints** | Replace NAT Gateway with Gateway VPC Endpoint for S3/DynamoDB | 100% (endpoints are free) |
| **Managed Services** | Use RDS/DynamoDB vs. self-managed DB on EC2 | Reduced ops cost |

**Example from the question set (slide 5559):** "Unusual cost and usage spending across multiple accounts" → **Cost Anomaly Detection** with linked account monitor + subscription. Not Budgets (which is threshold-based, not anomaly-based).

**Example from the question set (slide 4774):** EC2 in private subnet accessing S3 via NAT Gateway (costs money) → Replace with **Gateway VPC Endpoint** (free). This is both a cost AND networking question.

---

## 9. RDS, Aurora & Database Selection

**RDS appeared in 143 questions (19%), Aurora in 49 (7%).** Database questions test which engine to choose, how to achieve HA, and when to use managed vs. self-managed.

### Database Decision Matrix

| Scenario Keyword | Service | Type |
|-----------------|---------|------|
| SQL, relational, MySQL/PostgreSQL/Oracle | **RDS** | Relational |
| Relational but needs high performance + auto-scaling | **Aurora** | Relational (AWS-native) |
| Key-value, single-digit ms, massive scale, NoSQL | **DynamoDB** | NoSQL |
| Caching layer, speed up database reads | **ElastiCache** (Redis/Memcached) | In-Memory |
| Analytics, data warehouse, petabyte SQL | **Redshift** | Data Warehouse |
| Graph relationships (social, fraud detection) | **Neptune** | Graph |
| Immutable financial records, audit log | **QLDB** | Ledger |
| IoT metrics, time-series data | **Timestream** | Time-Series |
| MongoDB-compatible, document database | **DocumentDB** | Document |

### RDS vs. Aurora vs. DynamoDB (Critical Comparison)

| Feature | RDS | Aurora | DynamoDB |
|---------|-----|--------|----------|
| **Type** | Relational | Relational | NoSQL |
| **Scaling** | Manual vertical | Auto storage + read replicas | Auto (on-demand or provisioned) |
| **Performance** | Standard | 5× MySQL, 3× PostgreSQL | Single-digit ms |
| **Multi-AZ** | Standby replica | 6 copies across 3 AZs automatically | Built-in |
| **Cost** | Moderate | Higher than RDS | Pay-per-request option |
| **Best For** | Existing SQL apps | High-perf relational | Global, serverless, massive scale |
| **Read Replicas** | Up to 15 | Up to 15 (same storage) | Global Tables |

**Example from the question set (slide 2166):** "RabbitMQ on EC2 + PostgreSQL on EC2, redesign for highest availability with least overhead" → Amazon MQ (managed RabbitMQ) + RDS Multi-AZ. Replace self-managed with managed. The "least overhead" qualifier eliminates options that keep EC2-based database.

**Example from the question set (slide 5114):** "Aurora failover caused 3 min downtime, reduce with least overhead" → **RDS Proxy**. It maintains connection pooling so applications reconnect faster during failover, without requiring architecture changes.

---

## 10. Auto Scaling & Load Balancing

**Auto Scaling: 122 questions (16%). ELB/ALB/NLB: 121 questions (16%).** These two always appear together. Nearly every scalability or HA question involves this pair.

### Load Balancer Types

| Type | Layer | Best For | Protocol |
|------|-------|---------|----------|
| **ALB** (Application) | Layer 7 | HTTP/HTTPS routing, path/host rules | HTTP, HTTPS, WebSocket |
| **NLB** (Network) | Layer 4 | Ultra-low latency, millions of requests/sec | TCP, UDP, TLS |
| **GLB** (Gateway) | Layer 3 | Route to 3rd-party virtual appliances (firewalls) | IP |
| **CLB** (Classic) | Layer 4/7 | Legacy — avoid on new architectures | HTTP, TCP |

### Auto Scaling Policies

| Policy Type | Triggers | Best For |
|------------|---------|----------|
| **Target Tracking** | Maintain a metric at target (e.g., CPU at 50%) | Most common, easiest |
| **Step Scaling** | Different actions at different thresholds | Graduated response |
| **Scheduled** | Time-based scale events | Known traffic patterns |
| **Predictive** | ML-based forecast of future demand | Recurring patterns |

### Auto Scaling + SQS Pattern (High-Frequency Exam Pattern)

When you see "workers processing jobs" + "CPU at 100%" + "some requests dropping":

```
Web Tier → SQS Queue → Worker Tier (EC2 Auto Scaling Group)
                        Scaling metric: ApproximateNumberOfMessagesVisible
```

**Example from the question set (slide 5154):** This exact pattern. "Analytics software on EC2... 100% CPU... some data not processed" → Route requests to SQS, Auto Scaling based on queue size.

---

## 11. VPC & Private Connectivity

**VPC: 95 questions (13%). Private connectivity: 120 questions (16%).** VPC questions test subnets, security groups, NACLs, and connectivity options.

### Core Networking Components

| Component | What It Does | Analogy |
|-----------|-------------|---------|
| **VPC** | Your private isolated network in AWS | A fenced property |
| **Subnet** | Segment of a VPC (public or private) | Rooms inside your property |
| **Internet Gateway (IGW)** | Allows public internet traffic into VPC | Front door |
| **NAT Gateway** | Allows private subnets to reach internet (outbound only) | One-way exit door |
| **Security Group** | Instance-level firewall (stateful) | Bodyguard for each EC2 |
| **NACL** | Subnet-level firewall (stateless) | Security checkpoint at subnet border |

### Security Group vs. NACL

| Feature | Security Group | NACL |
|---------|---------------|------|
| **Level** | Instance | Subnet |
| **Stateful/Stateless** | Stateful (return traffic auto-allowed) | Stateless (must allow both directions) |
| **Rules** | Allow only | Allow AND Deny |
| **Default** | Deny all inbound, allow all outbound | Allow all both ways |
| **Evaluation** | All rules evaluated together | Rules evaluated in number order |

### Connectivity Options: On-Premises to AWS

| Need | Service | Key Characteristic |
|------|---------|-------------------|
| Encrypted tunnel over public internet | **VPN (Site-to-Site)** | Fast to set up, internet-dependent |
| Dedicated private fiber connection | **Direct Connect** | Consistent latency, expensive, weeks to provision |
| Private access to AWS services (no internet) | **VPC Endpoint** | Service-level private path |
| Connect multiple VPCs + on-prem networks | **Transit Gateway** | Hub-and-spoke architecture |

### VPC Endpoints (High-Frequency Pattern)

| Endpoint Type | Services | Cost |
|--------------|---------|------|
| **Gateway Endpoint** | S3, DynamoDB only | **Free** |
| **Interface Endpoint** | Everything else (uses ENI + PrivateLink) | Per-hour + per-GB |

**Example from the question set (id:2):** "EC2 must access S3 without connectivity to the internet" → **Gateway VPC endpoint**. This is the most common VPC endpoint question pattern.

**Example from the question set (slide 4774):** "Reduce data output costs" when using NAT Gateway for S3 → Replace with **Gateway VPC endpoint** (free vs. NAT Gateway charges).

### Route 53 Routing Policies

| Policy | Use Case |
|--------|---------|
| **Simple** | Single resource, no health checks |
| **Weighted** | A/B testing, gradual traffic shifts (e.g., 90/10 split) |
| **Latency-Based** | Route to region with lowest latency for user |
| **Failover** | Active/passive DR configuration |
| **Geolocation** | Route based on user's country/continent |
| **Geoproximity** | Route based on geographic distance (with adjustable bias) |
| **Multi-Value Answer** | Return multiple healthy endpoints (simple load balancing) |

---

## 12. High Availability & Disaster Recovery

**Appeared in 92 of 745 questions (12%).** DR questions test your understanding of RTO/RPO tradeoffs and which HA mechanisms each service provides.

### DR Strategies (Cheapest → Most Expensive)

```
1. BACKUP & RESTORE        → Cheapest. Backup data to S3/Glacier. Restore when needed.
                              RTO: Hours | RPO: Hours

2. PILOT LIGHT             → Core services running minimally in DR region (DB replication only).
                              RTO: Minutes–Hours | RPO: Minutes

3. WARM STANDBY            → Scaled-down full copy running in DR region.
                              RTO: Minutes | RPO: Seconds–Minutes

4. MULTI-SITE / HOT STANDBY → Full active-active setup in multiple regions.
                              RTO: Near-zero | RPO: Near-zero | Most expensive
```

> 🎯 **Key Terms:**
> - **RTO** (Recovery Time Objective) = How long can you be down? (Time to recover)
> - **RPO** (Recovery Point Objective) = How much data can you lose? (Age of data at recovery)

### HA by Service

| Service | HA Mechanism |
|---------|-------------|
| **RDS Multi-AZ** | Synchronous standby in another AZ; auto-failover |
| **Aurora** | 6 copies across 3 AZs; auto-failover in <30 seconds |
| **DynamoDB** | Built-in multi-AZ + Global Tables for multi-region |
| **S3** | 11 nines durability; replicated across AZs automatically |
| **ELB + ASG** | Distribute traffic + auto-replace failed instances |
| **Route 53 Failover** | DNS-level failover to healthy endpoint |

**Example from the question set (slide 5563):** "DocumentDB global clusters, minimize downtime during disruptions" → **Managed failover to secondary Region**. Not snapshots (slow), not in-Region replica (doesn't help for regional failure), not increased replication lag (makes things worse).

---

## 13. DynamoDB & NoSQL

**Appeared in 86 of 745 questions (12%).** DynamoDB questions test capacity modes, global tables, streams, and when to choose NoSQL over relational.

### DynamoDB Key Concepts

| Concept | Definition |
|---------|-----------|
| **Partition Key** | Primary key used to distribute data across partitions |
| **Sort Key** | Optional secondary key for range queries within a partition |
| **GSI (Global Secondary Index)** | Query on non-key attributes; has its own capacity |
| **LSI (Local Secondary Index)** | Alternate sort key; must be created at table creation |
| **DynamoDB Streams** | Capture item-level changes in real-time (like a change log) |
| **Global Tables** | Multi-region, multi-active replication |
| **DAX (DynamoDB Accelerator)** | In-memory cache for DynamoDB (microsecond reads) |

### Capacity Modes

| Mode | Best For | Billing |
|------|---------|---------|
| **On-Demand** | Unpredictable traffic, new tables | Per-request pricing |
| **Provisioned** | Predictable, steady traffic | Set RCU/WCU (can auto-scale) |

---

## 14. Monitoring, Logging & Observability

**Appeared in 86 of 745 questions (12%).**

### Monitoring Services

| Service | Monitors | Output |
|---------|---------|--------|
| **CloudWatch** | Metrics, logs, events, alarms | Dashboards, alerts, log groups |
| **CloudTrail** | API calls (who did what, when) | Audit trail, compliance |
| **AWS Config** | Resource configuration history | Compliance rules, drift detection |
| **X-Ray** | Distributed application tracing | Request flow visualization |
| **VPC Flow Logs** | Network traffic metadata | Security analysis, troubleshooting |

### CloudWatch vs. CloudTrail (Critical Differentiator)

| | CloudWatch | CloudTrail |
|--|------------|------------|
| **Purpose** | Performance monitoring | Audit logging |
| **Answers** | "Is my app healthy?" | "Who changed my infrastructure?" |
| **Data** | Metrics, logs, events | API call records |
| **Trigger** | "CPU utilization," "latency," "alarm" | "audit," "compliance," "who did what" |

---

## 15. CloudFront & Content Delivery

**Appeared in 78 of 745 questions (10%).**

### CloudFront Key Concepts

| Feature | Purpose | Exam Trigger |
|---------|---------|-------------|
| **Edge Locations** | Cache content close to users globally | "reduce latency," "global users" |
| **Origin** | Source of content (S3, ALB, EC2, custom) | "serve from S3," "API backend" |
| **OAC (Origin Access Control)** | Restrict S3 access to CloudFront only | "private S3 bucket," "no direct access" |
| **Lambda@Edge** | Run code at edge locations | "customize headers," "URL rewrite" |
| **Signed URLs / Signed Cookies** | Restrict access to specific users | "paid content," "premium access" |
| **Field-Level Encryption** | Encrypt specific form fields at edge | "credit card data," "PII at edge" |

---

## 16. EBS & Block Storage

**Appeared in 71 of 745 questions (10%).**

### EBS Volume Types

| Type | IOPS | Throughput | Use Case |
|------|------|-----------|----------|
| **gp3** (General Purpose SSD) | Up to 16,000 | 1,000 MB/s | Default for most workloads |
| **gp2** (General Purpose SSD) | Up to 16,000 | Tied to size | Legacy default |
| **io2 Block Express** | Up to 256,000 | 4,000 MB/s | Critical databases, highest performance |
| **st1** (Throughput HDD) | N/A | 500 MB/s | Big data, log processing (sequential) |
| **sc1** (Cold HDD) | N/A | 250 MB/s | Infrequent access, lowest cost |

### Key EBS Facts

- EBS volumes are **AZ-locked** — can't attach cross-AZ
- To move: Create snapshot → restore in new AZ
- **Multi-attach** (io1/io2 only): Attach one EBS to multiple EC2s in same AZ
- **Encryption**: Enable with KMS; snapshots of encrypted volumes are also encrypted

**Example from the question set (id:1):** Two EC2s in different AZs behind ALB, users see different files → Problem is EBS (AZ-locked, not shared). Solution: **EFS** (shared across AZs).

---

## 17. Containers: ECS, EKS & Fargate

**Appeared in 69 of 745 questions (9%).**

### Container Decision Matrix

| Scenario | Service | Why |
|---------|---------|-----|
| Run Docker containers, AWS-native | **ECS** | Simpler, tight AWS integration |
| Run Kubernetes, open-source portability | **EKS** | K8s ecosystem, multi-cloud strategy |
| Containers without managing EC2 | **Fargate** | Serverless launch type for ECS or EKS |
| Store container images | **ECR** | Private Docker registry |

> 🎯 **Exam Pattern:** "Least operational overhead" + containers → **Fargate**. "Kubernetes" → **EKS**. "Docker" without K8s mention → **ECS**.

---

## 18. IAM & Access Management

**Appeared in 61 of 745 questions (8%).**

### IAM Core Concepts

| Concept | Definition | Analogy |
|---------|-----------|---------|
| **IAM User** | Person with permanent credentials | Employee badge |
| **IAM Group** | Collection of users sharing permissions | Department |
| **IAM Role** | Temporary credentials assumed by a service or user | Visitor pass |
| **IAM Policy** | JSON document defining permissions | Rulebook |
| **MFA** | Multi-Factor Authentication | Lock + key + fingerprint |

### IAM Policy Types

| Policy Type | Attached To | Purpose |
|------------|-------------|---------|
| **Identity-based** | Users, Groups, Roles | What can this identity do? |
| **Resource-based** | S3 buckets, KMS keys, SQS queues | Who can access this resource? |
| **Permission Boundary** | Users or Roles | Maximum permission ceiling |
| **SCP (Service Control Policy)** | AWS Organizations OUs | Org-wide guardrails |

### User Management Services

| Service | Purpose | When to Use |
|---------|---------|------------|
| **IAM** | AWS account access control | Always — foundational |
| **AWS Organizations** | Multi-account management | Enterprises with many AWS accounts |
| **IAM Identity Center (SSO)** | Single sign-on for employees | Corporate directory → AWS access |
| **Amazon Cognito** | Auth for your application's end users | Web/mobile app login for customers |
| **AWS STS** | Temporary security credentials | Cross-account role assumption |

> 🎯 **Key Differentiator:** **IAM** = AWS console/API access for your team. **Cognito** = your app's login system for customers.

**Example from the question set (id:4):** "Limit S3 access to organization accounts" → `aws:PrincipalOrgID` condition in bucket policy. This is a resource-based policy using an Organizations-aware condition key.

---

## 19. Application Integration: SQS, SNS, EventBridge

**SQS: 57 questions (8%). SNS: 46 (6%). EventBridge: 50 (7%).**

### Messaging Services Decision Matrix

| Scenario | Service | Pattern |
|---------|---------|---------|
| Decouple tiers; one consumer per message | **SQS** | Queue (pull-based) |
| Broadcast to multiple subscribers | **SNS** | Pub/Sub (push-based) |
| Route events between AWS services | **EventBridge** | Event bus + rules |
| Complex multi-step workflows | **Step Functions** | Visual state machine |
| Real-time streaming, high throughput | **Kinesis** | Data streams |

### SQS vs. SNS (Critical Differentiator)

| | SQS | SNS |
|--|-----|-----|
| **Pattern** | Queue (point-to-point) | Topic (publish-subscribe) |
| **Consumers** | One consumer pulls messages | Many subscribers pushed to |
| **Message Retention** | Up to 14 days | Not stored (deliver or lose) |
| **Use Case** | Order processing queue | Alert broadcast, fan-out |
| **Analogy** | Mailbox (one person reads) | Megaphone (everyone hears) |

### SQS Standard vs. FIFO

| | Standard | FIFO |
|--|----------|------|
| **Ordering** | Best-effort | Guaranteed exactly-once, in-order |
| **Throughput** | Nearly unlimited | 300 msg/sec (3,000 with batching) |
| **Use Case** | Most workloads | Financial transactions, order processing |

**Example from the question set (slide 5550):** "Web tier + worker tier, messages must be processed in order" → **SQS FIFO** (not standard, because ordering matters).

### Fan-Out Pattern: SNS + SQS

When you need to send one event to multiple processing pipelines:

```
Producer → SNS Topic → SQS Queue A (processing pipeline 1)
                     → SQS Queue B (processing pipeline 2)
                     → Lambda (processing pipeline 3)
```

---

## 20. API Gateway

**Appeared in 52 of 745 questions (7%).**

### API Gateway Types

| Type | Protocol | Use Case |
|------|----------|----------|
| **REST API** | HTTP | Full-featured, caching, throttling, API keys |
| **HTTP API** | HTTP | Simpler, cheaper, faster — for Lambda/HTTP backends |
| **WebSocket API** | WebSocket | Real-time two-way communication (chat, gaming) |

### Key API Gateway Features

- **Throttling**: Rate limiting to prevent abuse
- **Caching**: Reduce backend calls for repeated requests
- **Lambda integration**: Serverless backend (API Gateway + Lambda = no servers)
- **Custom domain**: Use your own domain with ACM certificate
- **Authorizers**: Cognito or Lambda for authentication

---

## 21. Specialist Services

### Analytics (3–5% each)

| Service | Purpose | Exam Trigger |
|---------|---------|-------------|
| **Athena** | Serverless SQL queries on S3 | "query S3 data," "no ETL," "ad-hoc SQL" |
| **Glue** | Serverless ETL + Data Catalog | "transform data," "ETL," "catalog" |
| **Redshift** | Data warehouse (petabyte OLAP) | "data warehouse," "analytics," "OLAP" |
| **Kinesis** | Real-time streaming | "real-time," "clickstream," "IoT stream" |
| **OpenSearch** | Text search + log analytics | "search," "log analytics," "Elasticsearch" |
| **QuickSight** | BI dashboards | "dashboard," "visualization," "reporting" |

### Caching (5%)

| Service | Purpose | Exam Trigger |
|---------|---------|-------------|
| **ElastiCache Redis** | In-memory cache + complex data types | "session store," "leaderboard," "pub/sub" |
| **ElastiCache Memcached** | Simple in-memory cache | "simple caching," "multi-threaded" |
| **DAX** | DynamoDB-specific microsecond cache | "DynamoDB reads," "microsecond latency" |
| **CloudFront** | CDN — cache at edge | "global latency," "static content" |

### File Systems (5%)

| Service | Protocol | OS | Exam Trigger |
|---------|----------|-----|-------------|
| **EFS** | NFS | Linux | "shared Linux file system," "mount across AZs" |
| **FSx for Windows** | SMB | Windows | "shared Windows file system," "Active Directory" |
| **FSx for Lustre** | Lustre | Linux (HPC) | "high-performance computing," "ML training data" |
| **FSx for NetApp ONTAP** | NFS/SMB/iSCSI | Multi-OS | "multi-protocol," "NetApp features" |

### Other Services (1–3% each)

| Service | Purpose |
|---------|---------|
| **Global Accelerator** | Route traffic via AWS backbone for performance (static IP) |
| **CloudFormation** | Infrastructure as Code — deploy stacks from templates |
| **Systems Manager** | Manage EC2 fleet (patch, run commands, parameter store) |
| **AWS Config** | Track resource config changes, compliance rules |
| **Secrets Manager** | Store and auto-rotate secrets |
| **Step Functions** | Orchestrate multi-step workflows visually |
| **SageMaker** | Build/train/deploy custom ML models |

---

## 22. AWS Cloud Adoption Framework (CAF)

CAF is **not** an AWS service — you won't find it in the console. It's a **strategy playbook** (a white paper) that AWS created by distilling best practices from thousands of cloud migrations. Think of it as AWS saying: *"Here's everything we've learned about what makes cloud adoptions succeed or fail, organized into a checklist."*

The purpose of CAF is to help your organization build a comprehensive plan for digital transformation — not just the technical side (which servers to move), but also the business, people, and governance side (who needs training, how do we manage risk, what's the ROI).

### The 6 CAF Perspectives

The framework is organized into 6 **perspectives** — think of these as 6 different "lenses" that different stakeholders use to evaluate cloud readiness. They split into two groups:

**Business Capabilities (the "why" and "who"):**

| Perspective | Core Question | Real-World Analogy | Key Capabilities |
|------------|--------------|-------------------|-----------------|
| **Business** | "Do our cloud investments accelerate business outcomes?" | The CEO/CFO asking "What's the ROI?" | Strategy management, portfolio management, innovation management, data monetization, business insight |
| **People** | "Is our workforce ready for the cloud?" | The HR director asking "Do we need to retrain or hire?" | Culture evolution, transformational leadership, cloud fluency, workforce transformation, change acceleration, organizational design |
| **Governance** | "How do we manage risk and compliance?" | The compliance officer asking "Are we meeting regulatory requirements?" | Program/project management, risk management, cloud financial management, data governance, data curation |

**Technical Capabilities (the "how"):**

| Perspective | Core Question | Real-World Analogy | Key Capabilities |
|------------|--------------|-------------------|-----------------|
| **Platform** | "What's our cloud architecture and CI/CD pipeline?" | The solutions architect asking "How do we design this?" | Platform architecture, data architecture, platform engineering, provisioning and orchestration, modern app development, CI/CD |
| **Security** | "Is our data protected? Can we detect and respond to threats?" | The CISO asking "Who has access? Is data encrypted?" | Security governance, identity and access management, threat detection, vulnerability management, data protection, incident response |
| **Operations** | "Are cloud services delivered at the level business needs?" | The SRE/DevOps team asking "How do we monitor and patch?" | Observability, event management, incident/problem management, change/release management, patch management, availability/continuity management |

> 🎯 **Critical Exam Fact:** The **People** perspective is the **bridge between technology and business**. This exact phrase is a common exam answer. If a question asks which perspective connects the technical and business sides, the answer is always People.

> 🎯 **Mnemonic:** **B-P-G-P-S-O** → "**B**ig **P**rojects **G**enerally **P**roduce **S**trong **O**utcomes"

### How to Match Capabilities to Perspectives (Exam Strategy)

The exam may ask you to identify which perspective a specific capability belongs to. The good news: it's mostly common sense. Ask yourself **"Who in the company would care about this?"**

| If the capability sounds like... | It belongs to... | Because... |
|----------------------------------|-----------------|------------|
| "Workforce transformation," "cloud fluency," "culture" | **People** | HR cares about training and culture |
| "Risk management," "cloud financial management" | **Governance** | The compliance/finance team manages risk |
| "Data monetization," "business insight," "strategy" | **Business** | The C-suite cares about ROI and strategy |
| "CI/CD," "platform architecture," "data engineering" | **Platform** | The architects build the infrastructure |
| "Threat detection," "IAM," "incident response" | **Security** | The CISO handles protection |
| "Observability," "patch management," "change management" | **Operations** | The SRE/DevOps team runs day-to-day |

### The 4 Transformation Domains

These describe **what changes** when you adopt the cloud:

| Domain | What It Means | Example |
|--------|-------------|---------|
| **Technology** | Migrate and modernize infrastructure, apps, and data platforms | Moving from on-prem servers to EC2/RDS |
| **Process** | Digitize and automate business operations | Using ML to improve customer service, building data analytics pipelines |
| **Organization** | Reorganize teams around products and value streams | Adopting agile methods, restructuring around DevOps |
| **Product** | Create new value propositions, business models, and revenue streams | Building new SaaS products enabled by cloud |

### The 4 Transformation Phases (EALS)

These describe the **journey** of cloud adoption:

```
1. ENVISION  → Identify business opportunities; demonstrate how cloud accelerates outcomes
               "Why should we move to the cloud?"

2. ALIGN     → Use the 6 perspectives to find capability gaps; create an action plan
               "Where are our gaps?"

3. LAUNCH    → Build and deliver pilot initiatives in production; show incremental value
               "Let's prove it works."

4. SCALE     → Expand pilot initiatives to full production at desired scale
               "Let's go big."
```

> 🎯 **Mnemonic:** **EALS** → **E**nvision, **A**lign, **L**aunch, **S**cale

### CAF vs. Well-Architected Framework (Don't Confuse Them)

These two frameworks are related but different. The exam can test whether you know which is which:

| | CAF | Well-Architected Framework |
|--|-----|--------------------------|
| **Purpose** | Plan your cloud *adoption journey* | Evaluate your *existing architecture* |
| **When** | Before and during migration | After you've built something |
| **Scope** | Entire organization (business + tech) | Technical architecture only |
| **Structure** | 6 Perspectives | 6 Pillars (OSRPCS) |
| **Output** | Action plan for transformation | Improvement recommendations |

CAF asks "How do we get to the cloud?" The Well-Architected Framework asks "Now that we're here, is our architecture good?"

---

## 23. Ordering Questions Collections

These sequence questions test your understanding of end-to-end workflows. Anchor on the **first** and **last** step, then fill in the middle.

### Collection A: Deploying a Secure Web App on AWS (SAA-C03)

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

### Collection B: AWS Migration Process

```
1. Discover: Inventory on-prem servers (Application Discovery Service)
2. Assess: Evaluate dependencies, risks, and migration strategy
3. Plan: Choose migration pattern (7 Rs — Rehost, Replatform, Refactor, etc.)
4. Migrate: Move workloads (MGN for servers, DMS for databases)
5. Validate: Test migrated workloads in AWS
6. Optimize: Rightsize, use managed services, reduce costs
7. Operate: Monitor with CloudWatch, CloudTrail
```

### Collection C: Incident Response on AWS

```
1. Detect: CloudWatch Alarm or GuardDuty finding triggers
2. Notify: SNS notification sent to security team
3. Isolate: Modify Security Group to block malicious traffic
4. Investigate: Review CloudTrail logs and VPC Flow Logs
5. Eradicate: Terminate compromised instances; rotate credentials
6. Recover: Restore from backup or launch clean instance
7. Post-mortem: Document findings and update runbooks
```

### Collection D: Setting Up Multi-Account AWS Organization

```
1. Create AWS Management (Root) Account
2. Enable AWS Organizations
3. Define Organizational Unit (OU) structure
4. Create Member Accounts for each OU
5. Apply Service Control Policies (SCPs) to OUs
6. Enable consolidated billing
7. Set up IAM Identity Center (SSO) for access
8. Deploy guardrails with AWS Control Tower
```

---

## 24. Critical Differentiators & Exam Traps

### The Big 10 Differentiators (Most Tested)

| Pair | Use LEFT when... | Use RIGHT when... |
|------|-----------------|------------------|
| **EC2 vs. Lambda** | Long-running, stateful, custom OS | Short events (<15 min), stateless, serverless |
| **SQS vs. SNS** | One consumer pulls messages from queue | Broadcasting to many subscribers at once |
| **RDS vs. DynamoDB** | Structured SQL, ACID transactions, joins | Flexible schema, massive scale, key-value |
| **EBS vs. EFS** | Single EC2 needs a disk (AZ-locked) | Multiple EC2s need shared file system |
| **EFS vs. FSx Windows** | Linux instances (NFS) | Windows instances (SMB) |
| **IAM vs. Cognito** | AWS console/API access for your team | Your app's end-user authentication |
| **CloudTrail vs. CloudWatch** | Audit who did what (API log) | Monitor performance metrics |
| **Inspector vs. GuardDuty** | Proactive vulnerability scan | Reactive threat detection in logs |
| **VPN vs. Direct Connect** | Quick setup, tolerate internet latency | Consistent speed, dedicated private fiber |
| **NAT Gateway vs. VPC Endpoint** | Private subnet → internet access | Private subnet → S3/DynamoDB (free, private) |

### Common Exam Trap Patterns

| Trap | Correct Answer Logic |
|------|---------------------|
| "Oracle database migrating to EC2" | Use **MGN** (server), NOT DMS (database-to-database) |
| "Shared file system" + Linux | **EFS**, not EBS (EBS is single-instance) |
| "Shared file system" + Windows | **FSx for Windows**, not EFS (EFS is NFS/Linux) |
| "Unknown access pattern" + S3 cost | **S3 Intelligent-Tiering** |
| "Recently accessed data locally" + on-prem | **Storage Gateway Volume Cached** |
| "Least operational overhead" | Always pick the most managed/serverless option |
| "Reduce data transfer costs" + S3 | Replace NAT Gateway with **Gateway VPC Endpoint** |
| "Processing takes 20 minutes" | NOT Lambda (15-min limit) → ECS/Fargate |
| "Messages must be in order" | **SQS FIFO**, not SQS Standard |
| "PII in S3" | **Macie**, not GuardDuty or Inspector |

---

## 25. Mnemonic Memory Aids

### Master Mnemonics Collection

| Concept | Mnemonic | What It Stands For |
|---------|----------|--------------------|
| **Well-Architected Pillars** | **OSRPCS** | Operational Excellence, Security, Reliability, Performance, Cost, Sustainability |
| **DR Strategies** | **BPWM** (cheapest → most expensive) | Backup & Restore, Pilot Light, Warm Standby, Multi-Site |
| **Migration 7 Rs** | **7 Rs** | Retire, Retain, Rehost, Relocate, Replatform, Repurchase, Refactor |
| **S3 Storage Tiers** | Hot → Cold | Standard → Intelligent → IA → One Zone → Glacier → Deep Archive |
| **CAF Perspectives** | **BPGPSO** | Business, People, Governance, Platform, Security, Operations |
| **CAF Phases** | **EALS** | Envision, Align, Launch, Scale |
| **Responsible AI** | **GRIPE** | Governance, Robustness, Interpretability, Privacy, Equity |

### Quick-Fire Service → Purpose Map

```
Route 53        = DNS + Health Checks + Routing Policies
CloudFront      = CDN (cache at edge locations globally)
WAF             = Block bad web traffic (SQL injection, XSS)
Shield          = Block DDoS attacks
GuardDuty       = Detect threats in logs (ML-based)
Macie           = Find PII in S3
Inspector       = Scan EC2/containers for vulnerabilities
CloudTrail      = Log every API call (audit)
Config          = Track resource configuration changes
Cost Explorer   = Visualize and forecast your bill
Budgets         = Set spending alerts
Compute Optimizer = Rightsize EC2, Lambda, EBS
Fargate         = Serverless containers
Lambda          = Serverless functions (< 15 min)
Kinesis         = Real-time data streams
Glue            = Serverless ETL + Data Catalog
Athena          = SQL queries on S3 (no servers)
Redshift        = Data warehouse (petabyte OLAP)
ElastiCache     = In-memory cache (Redis or Memcached)
SQS             = Message queue (decouple services)
SNS             = Pub/Sub notifications (fan-out)
EventBridge     = Event bus (route events between services)
Step Functions  = Orchestrate multi-step workflows
API Gateway     = Managed REST/HTTP/WebSocket APIs
ACM             = Free SSL/TLS certificates
KMS             = Encryption key management
Secrets Manager = Store + auto-rotate secrets
Systems Manager = Manage EC2 fleet (patch, configure)
Organizations   = Multi-account management + SCPs
IAM Identity Center = SSO for employees
Cognito         = App user authentication
```

---

## 🎯 Exam Day Checklist

- [ ] Read each question fully before looking at answers
- [ ] Circle the **qualifier phrase** (least overhead, most cost-effective, highest availability)
- [ ] Identify the **key constraint** (15-min limit, Windows vs Linux, on-prem, single AZ)
- [ ] Eliminate 2 obviously wrong answers immediately
- [ ] Between remaining options, pick the **more managed/specific** service
- [ ] For cost questions: serverless and managed > self-managed on EC2
- [ ] For security questions: least privilege, encrypt everything, private subnets
- [ ] Flag uncertain questions and return — **never leave blanks** (no penalty for guessing)
- [ ] You need **720/1000** to pass SAA-C03 — aim for 850+

---

*Generated from analysis of 745 SAA-C03 practice questions | April 2026*
