# AWS Certification Study Guide
## AIF-C01 (AI Practitioner) & SAA-C03 (Solutions Architect - Associate)

> **Exam Quick Facts**
> | Exam | Questions (scored) | Unscored | Passing Score | Duration | Format |
> |------|-------------------|----------|---------------|----------|--------|
> | **AIF-C01** | 50 | 15 | 700 / 1,000 | 90 min | Multiple choice, multiple response, ordering, matching, case study |
> | **SAA-C03** | 50 | 15 | 720 / 1,000 | 130 min | Multiple choice, multiple response |

---


# Part II: SAA-C03 -- AWS Certified Solutions Architect - Associate

**Target candidate:** At least 1 year of hands-on experience designing AWS solutions.  
**Key theme:** Design secure, resilient, high-performing, and cost-optimized architectures using the AWS Well-Architected Framework.

---

## Chapter 6 -- Domain 1: Design Secure Architectures *(30%)* -- HIGHEST WEIGHT

### Secure Access to AWS Resources

**Core Principles:**
- **Principle of Least Privilege** -- Give only the permissions needed, nothing more
- **Shared Responsibility Model** -- AWS secures the *cloud*; you secure *what's in the cloud*
- **MFA (Multi-Factor Authentication)** -- Required for root users and highly privileged IAM users

**IAM Components:**

| Component | What It Does | Mnemonic / Memory Aid |
|-----------|--------------|----------------------|
| **IAM Users** | Long-term credentials for individuals | Think "U = Unique person" |
| **IAM Groups** | Collection of users sharing permissions | "G = Gather users" |
| **IAM Roles** | Temporary credentials; assumed by users/services/apps | "R = Relay" -- pass permissions temporarily |
| **IAM Policies** | JSON documents defining permissions | "P = Permissions paper" |
| **AWS STS** | Issues temporary security credentials | "STS = Short-Term Security" |

**Multi-Account Security Strategy:**

- **AWS Organizations** -- Central management of multiple AWS accounts
- **Service Control Policies (SCPs)** -- Guardrails that limit maximum permissions across accounts
- **AWS Control Tower** -- Automates multi-account setup with guardrails and landing zones

*Mnemonic:* **"Organizations use SCPs to Control the Tower"**

**Federation & SSO:**

- **AWS IAM Identity Center (successor to AWS SSO)** -- Centralized access to multiple AWS accounts and business apps
- **Federation with IAM Roles** -- Let corporate identities access AWS without creating IAM users

### Secure Workloads & Applications

**VPC Security Components:**

| Component | Function | Key Difference |
|-----------|----------|----------------|
| **Security Groups** | Stateful firewall at the instance level | Allow rules only; stateful (return traffic auto-allowed) |
| **Network ACLs** | Stateless firewall at the subnet level | Allow *and* deny rules; stateless (return traffic must be explicitly allowed) |
| **NAT Gateways** | Let private subnets reach internet without inbound exposure | Managed, scalable, high availability per AZ |
| **Route Tables** | Define traffic paths within VPC | Subnet-level routing control |

*Mnemonic for Security Groups vs. NACLs:*  
**"SGs are like a bouncer at the door (instance level, only allows, remembers you). NACLs are like a security checkpoint at the neighborhood gate (subnet level, can deny, forgets you)."**

**Network Segmentation:**
- **Public subnets** -- Have route to Internet Gateway; host web servers, load balancers
- **Private subnets** -- No direct internet route; host databases, application servers
- **DMZ / Edge subnets** -- Buffer zone between internet and internal resources

**Application Security Services:**

| Service | Use Case |
|---------|----------|
| **AWS WAF** -- Web Application Firewall | Block SQL injection, XSS, bad bots at Layer 7 |
| **AWS Shield** -- DDoS protection | Standard (free) and Advanced (premium) |
| **Amazon GuardDuty** -- Threat detection | ML-powered anomaly detection across accounts |
| **Amazon Macie** -- Data privacy | Discovers and protects sensitive data in S3 |
| **AWS Secrets Manager** -- Credential management | Rotate and manage secrets (passwords, API keys) |
| **Amazon Cognito** -- User authentication | Sign-up/sign-in for mobile and web apps |

**External Network Connections:**

- **AWS Site-to-Site VPN** -- Encrypted connection over internet between on-premises and AWS
- **AWS Direct Connect** -- Private, dedicated physical connection (lower latency, more consistent, higher bandwidth)
- **AWS PrivateLink** -- Private connectivity to AWS services without traversing the public internet

*Mnemonic:* **"VPN = Virtual Public Network (over internet); Direct Connect = Dedicated Private Line"**

### Data Security Controls

**Encryption:**
- **At rest** -- Encrypt stored data (S3, EBS, RDS) using **AWS KMS**
- **In transit** -- Encrypt data moving across networks using **TLS/SSL certificates from AWS Certificate Manager (ACM)**

**Key Management with AWS KMS:**
- **Customer Managed Keys (CMKs)** -- Full control, auditing, rotation
- **AWS Managed Keys** -- Automatic, no granular control
- **Key policies** -- Define who can use and administer keys

**Backup & Recovery:**
- Implement backups, snapshots, and cross-region replication
- Align retention and classification policies with compliance requirements

---

## Chapter 7 -- Domain 2: Design Resilient Architectures *(26%)*

### Scalable & Loosely Coupled Architectures

**Scaling Strategies:**

| Strategy | Direction | Example |
|----------|-----------|---------|
| **Horizontal Scaling** | Add more instances | EC2 Auto Scaling, ECS/EKS pods |
| **Vertical Scaling** | Make instances bigger | Resize EC2 instance type |

*Mnemonic:* **"Horizontal = Home addition (more rooms); Vertical = Higher ceilings (bigger room)"**

**Decoupling Patterns:**

- **SQS (Simple Queue Service)** -- Message queue for decoupling components; pull-based
- **SNS (Simple Notification Service)** -- Pub/sub messaging; push-based notifications
- **EventBridge** -- Serverless event bus for routing events between services
- **API Gateway** -- Front door for APIs; throttling, caching, security
- **Step Functions** -- Orchestrate workflows across multiple Lambda functions/services

*Mnemonic for SQS vs SNS:* **"SQS = Queue = Line up and wait (pull); SNS = Notify = Push to subscribers"**

**Serverless & Containers:**

- **AWS Lambda** -- Event-driven compute; pay per invocation and duration
- **AWS Fargate** -- Serverless containers (no EC2 management)
- **Amazon ECS** -- AWS-native container orchestration
- **Amazon EKS** -- Managed Kubernetes on AWS

**When to Use What:**

| Need | Solution |
|------|----------|
| Simple serverless functions | AWS Lambda |
| Container orchestration, AWS-native | Amazon ECS |
| Kubernetes compatibility | Amazon EKS |
| Serverless containers | AWS Fargate |
| Long-running workflows | AWS Step Functions |
| API management | Amazon API Gateway |

### High Availability & Fault Tolerance

**AWS Global Infrastructure:**

- **Regions** -- Geographic areas with multiple isolated Availability Zones
- **Availability Zones (AZs)** -- One or more discrete data centers with redundant power, networking, and connectivity
- **Edge Locations** -- CDN endpoints for caching content closer to users

*Mnemonic:* **"Region = Country; AZ = City; Edge Location = Neighborhood store"**

**Disaster Recovery Strategies (ordered by cost and speed):**

| Strategy | RTO | RPO | Cost | Description |
|----------|-----|-----|------|-------------|
| **Backup & Restore** | Hours-Days | 24 hrs+ | $ | Periodic backups; restore when needed |
| **Pilot Light** | 10s of min | Minutes | $$ | Core systems always running; scale out on disaster |
| **Warm Standby** | Minutes | Minutes | $$$ | Scaled-down duplicate running; scale up on disaster |
| **Active-Active** | Near zero | Near zero | $$$$ | Full duplicate running actively serving traffic |

*Mnemonic for DR strategies:* **"B-P-W-A"** -> *"Backup first, then Pilot the light, then Warm up, then Always active"*

**Key DR Metrics:**
- **RTO (Recovery Time Objective)** -- How long to recover after outage
- **RPO (Recovery Point Objective)** -- How much data loss is acceptable

**Resilience Tactics:**
- Multi-AZ deployments for databases (RDS Multi-AZ)
- Read replicas for scaling reads and failover
- Load balancing across AZs
- Auto Scaling to handle traffic spikes
- Immutable infrastructure (replace rather than repair)

**Proxy Concepts:**
- **Amazon RDS Proxy** -- Connection pooling for RDS databases; improves scalability and resilience

---

## Chapter 8 -- Domain 3: Design High-Performing Architectures *(24%)*

### High-Performing & Scalable Storage Solutions

| Service | Type | Best For | Performance Notes |
|---------|------|----------|-------------------|
| **Amazon S3** | Object storage | Backups, data lakes, static websites | Virtually unlimited; 11 9s durability |
| **Amazon EBS** | Block storage | EC2 persistent storage | gp3 = general purpose; io2 = highest IOPS |
| **Amazon EFS** | File storage (NFS) | Shared file access across Linux EC2 | Scales automatically; pay for use |
| **Amazon FSx** | Managed file systems | Windows (SMB), Lustre (HPC), NetApp ONTAP, OpenZFS | Purpose-built performance |

*Mnemonic for storage types:* **"Objects in a bucket, Blocks for disks, Files for sharing"**

### High-Performing & Elastic Compute Solutions

**EC2 Instance Families:**

| Family | Optimized For | Example Use Case |
|--------|---------------|------------------|
| **C** (Compute) | CPU-intensive | Web servers, batch processing |
| **M** (General) | Balanced | General applications, small databases |
| **R** (Memory) | Memory-intensive | In-memory caches, databases |
| **T** (Burstable) | Variable workloads | Low-traffic web apps, dev/test |
| **P / G / Inf** | GPU/ML inference | ML training, graphics rendering |

*Mnemonic:* **"C = Crunch numbers; M = Middle ground; R = RAM-hungry; T = Tiny bursts; P/G = Pictures & Graphics"**

**Scaling & Compute Services:**

- **EC2 Auto Scaling** -- Scale EC2 instances horizontally
- **AWS Auto Scaling** -- Scale multiple resources (EC2, DynamoDB, Aurora, etc.)
- **AWS Batch** -- Run batch computing jobs at any scale
- **Amazon EMR** -- Big data processing (Hadoop, Spark)

**Serverless & Decoupling:**
- Use Lambda for event-driven, short-lived tasks
- Use SQS/SNS/EventBridge to decouple so components scale independently

### High-Performing Database Solutions

| Database Service | Engine / Type | Best For |
|------------------|---------------|----------|
| **Amazon RDS** | Managed relational (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server) | Traditional OLTP |
| **Amazon Aurora** | AWS-optimized MySQL/PostgreSQL | High-performance relational; auto-scaling storage |
| **Amazon DynamoDB** | Fully managed NoSQL key-value | Low-latency, high-scale apps |
| **Amazon ElastiCache** | Redis / Memcached | In-memory caching |
| **Amazon Neptune** | Graph database | Social networks, fraud detection |
| **Amazon DocumentDB** | MongoDB-compatible | JSON document workloads |
| **Amazon Keyspaces** | Apache Cassandra-compatible | Massive scale NoSQL |
| **Amazon QLDB** | Ledger database | Immutable, cryptographically verifiable transactions |

*Mnemonic for RDS vs Aurora:* **"Aurora = AWS's own super-car built on the same roads as MySQL/Postgres"**

**Read Replicas & Caching:**
- **Read Replicas** -- Offload read traffic; improve performance; can promote to standalone
- **ElastiCache** -- Reduce database load by caching frequent queries
- **DynamoDB DAX** -- In-memory cache for DynamoDB (sub-millisecond latency)

### High-Performing Network Architectures

**Load Balancers:**

| LB Type | Layer | Best For |
|---------|-------|----------|
| **Application Load Balancer (ALB)** | Layer 7 (HTTP/HTTPS) | Path-based routing, host-based routing, containerized apps |
| **Network Load Balancer (NLB)** | Layer 4 (TCP/UDP) | Ultra-low latency, millions of requests/sec, static IP |
| **Gateway Load Balancer (GWLB)** | Layer 3 (Gateway) | Inline third-party virtual appliances (firewalls, IPS) |

*Mnemonic:* **"ALB = Apps (HTTP); NLB = Networks (TCP); GWLB = Gateways (Appliances)"**

**Edge & Networking Services:**

- **Amazon CloudFront** -- Global CDN; caches content at edge locations
- **AWS Global Accelerator** -- Improves availability and performance using AWS's global network; provides static anycast IPs
- **AWS PrivateLink** -- Private access to AWS services and VPC endpoints
- **AWS Transit Gateway** -- Central hub for connecting multiple VPCs and on-premises networks
- **VPC Peering** -- Direct private connection between two VPCs

*Mnemonic for CloudFront vs Global Accelerator:*  
**"CloudFront = Caching content at the edge (like a local store); Global Accelerator = Fast lane on AWS's private highway (better for TCP/UDP, not just HTTP)"**

### Data Ingestion & Transformation

| Service | Purpose |
|---------|---------|
| **Amazon Kinesis** | Real-time streaming data ingestion |
| **AWS Glue** | Serverless ETL and data cataloging |
| **Amazon Athena** | Query S3 data using SQL (serverless) |
| **AWS Lake Formation** | Secure data lake creation and management |
| **Amazon QuickSight** | Business intelligence and dashboards |
| **AWS DataSync** | Online data transfer to AWS |
| **AWS Storage Gateway** | Hybrid cloud storage access |
| **Amazon EMR** | Big data processing frameworks |

*Mnemonic for data ingestion:* **"Kinesis = Keenly streams; Glue = Gets data stuck together; Athena = Answers questions about your lake"**

---

## Chapter 9 -- Domain 4: Design Cost-Optimized Architectures *(20%)*

### Cost-Optimized Storage

**S3 Storage Classes:**

| Class | Use Case | Retrieval Time | Cost |
|-------|----------|----------------|------|
| **S3 Standard** | Frequently accessed | Milliseconds | $$ |
| **S3 Intelligent-Tiering** | Unknown/variable access | Milliseconds | $ (auto-moves tiers) |
| **S3 Standard-IA** | Infrequently accessed | Milliseconds | $ (lower storage, higher retrieval) |
| **S3 One Zone-IA** | Infrequently accessed, reproducible | Milliseconds | $ (single AZ) |
| **S3 Glacier Instant Retrieval** | Archive, rare access, but fast when needed | Milliseconds | $ |
| **S3 Glacier Flexible Retrieval** | Archive | Minutes-hours | $ |
| **S3 Glacier Deep Archive** | Long-term archive | 12-48 hours | $ |

*Mnemonic for S3 tiers:* **"Standard = Speedy; IA = Inactive; Glacier = Frozen; Deep Archive = Deep Freeze"**

**Cost Tactics:**
- Use **lifecycle policies** to auto-transition objects between classes
- Use **Requester Pays** buckets to shift data transfer costs to downloaders
- Choose the right **block storage:** gp3 (cost-effective general purpose), io2 (max IOPS)

### Cost-Optimized Compute

**EC2 Purchasing Options:**

| Option | Discount | Best For | Risk |
|--------|----------|----------|------|
| **On-Demand** | None | Short-term, unpredictable, testing | None |
| **Reserved Instances (RI)** | Up to ~72% | Steady-state, predictable workloads | Upfront commitment |
| **Savings Plans** | Up to ~72% | Flexible commitment to $/hour spend | Must maintain usage level |
| **Spot Instances** | Up to ~90% | Fault-tolerant, flexible workloads | Can be interrupted with 2-min notice |
| **Dedicated Hosts** | Varies | Software license compliance (BYOL) | Physical server dedication |

*Mnemonic for purchasing options:* **"OD = On Demand (no deal); RI = Reserved (restaurant reservation -- plan ahead); Spot = Spontaneous (cheap but might get kicked out); Savings Plans = Subscription (commit to spend)"**

**Compute Optimization Strategies:**
- Right-size instances (match workload to instance family/size)
- Use **Compute Optimizer** for recommendations
- Use containers/serverless to maximize utilization
- Hibernate EC2 instances instead of stopping/starting to preserve memory state
- Use auto scaling to match capacity to demand

### Cost-Optimized Databases

- Use **DynamoDB on-demand** for unpredictable traffic; **provisioned** for steady traffic
- Use **Aurora Serverless** for variable relational workloads
- Implement **read replicas** to scale reads instead of upsizing primary instance
- Use **ElastiCache** to reduce expensive database reads
- Consider columnar formats (Parquet) for analytics to reduce scanned data

### Cost-Optimized Networks

**NAT Gateway Cost Optimization:**
- A single NAT Gateway per AZ avoids cross-AZ data transfer charges for outbound traffic
- Shared NAT Gateway across VPCs (using Transit Gateway) can reduce costs in some architectures
- Compare NAT Gateway vs. NAT Instance (NAT Gateway is managed and more reliable; NAT Instance is cheaper but self-managed)

**Reducing Data Transfer Costs:**

| Pattern | Cost Strategy |
|---------|---------------|
| Same AZ traffic | Free between services in same AZ |
| Cross-AZ traffic | Minimize by placing resources in same AZ when HA isn't critical |
| Cross-Region traffic | Use CloudFront or Global Accelerator to optimize; replicate data locally |
| Internet egress | Use CloudFront, S3 Transfer Acceleration, or Direct Connect for large transfers |

*Mnemonic for network cost:* **"Same AZ = Free; Cross AZ = Fee; Internet out = Expensive route"**

---

# Cheat Sheets & Quick References

## AIF-C01 In-Scope Services (by category)

| Category | Key Services |
|----------|--------------|
| **Analytics** | OpenSearch, QuickSight, Redshift, EMR, Glue, Lake Formation |
| **Compute** | EC2 |
| **Containers** | ECS, EKS |
| **Database** | RDS, DynamoDB, ElastiCache, Neptune, DocumentDB, MemoryDB |
| **ML** | Bedrock, SageMaker, Transcribe, Translate, Comprehend, Lex, Polly, Rekognition, Kendra, Personalize, Textract, Q, A2I, Fraud Detector |
| **Management** | CloudTrail, CloudWatch, Config, Trusted Advisor, Well-Architected Tool |
| **Networking** | CloudFront, VPC |
| **Security** | IAM, KMS, Macie, Secrets Manager, Artifact, Audit Manager, Inspector |
| **Storage** | S3, S3 Glacier |

## SAA-C03 In-Scope Services (by category)

| Category | Key Services |
|----------|--------------|
| **Analytics** | Athena, EMR, Glue, Kinesis, Lake Formation, MSK, OpenSearch, QuickSight, Redshift |
| **App Integration** | AppFlow, AppSync, EventBridge, MQ, SNS, SQS, Step Functions |
| **Compute** | EC2, Auto Scaling, Batch, Beanstalk, Outposts, Wavelength |
| **Containers** | ECS, EKS, ECR |
| **Database** | Aurora, RDS, DynamoDB, ElastiCache, DocumentDB, Neptune, QLDB, Keyspaces |
| **Front-end** | API Gateway, Amplify, Device Farm, Pinpoint |
| **ML** | Comprehend, Forecast, Fraud Detector, Kendra, Lex, Polly, Rekognition, SageMaker, Textract, Transcribe, Translate |
| **Management** | Auto Scaling, CloudFormation, CloudTrail, CloudWatch, CLI, Compute Optimizer, Config, Control Tower, Organizations, Systems Manager, Trusted Advisor, Well-Architected Tool |
| **Migration** | DMS, DataSync, Snow Family, Transfer Family, Application Migration Service |
| **Networking** | CloudFront, Direct Connect, ELB (ALB/NLB/GWLB), Global Accelerator, PrivateLink, Route 53, Transit Gateway, VPC, VPN |
| **Security** | ACM, CloudHSM, Cognito, Directory Service, Firewall Manager, GuardDuty, IAM, IAM Identity Center, Inspector, KMS, Macie, Network Firewall, RAM, Secrets Manager, Security Hub, Shield, WAF |
| **Serverless** | AppSync, Fargate, Lambda |
| **Storage** | EBS, EFS, FSx, S3, S3 Glacier, Storage Gateway, Backup |

---

# Mnemonics & Memory Aids Mega-List

## AIF-C01 Mnemonics

1. **ML Pipeline** -- *"Can Every Person Find The Treasure Every Day, Mate?"*  
   (Collection -> EDA -> Pre-processing -> Feature -> Training -> Tuning -> Evaluation -> Deployment -> Monitoring)

2. **Learning Types** -- *"Supervised = Someone shows answers; Unsupervised = Uncovered patterns; Reinforcement = Rewards"*

3. **Vector Stores** -- *"Aurora Operates Documents Properly, Neptune Navigates"*  
   (Aurora, OpenSearch, DocumentDB, RDS PostgreSQL, Neptune)

4. **Foundation Model Lifecycle** -- *"Don't Make Predictions For Every Deployment Failure"*  
   (Data -> Model -> Pre-train -> Fine-tune -> Evaluate -> Deploy -> Feedback)

5. **Responsible AI** -- *"BIRDS"* (Bias, Inclusivity, Robustness, Diversity, Safety -- adapt as needed)

## SAA-C03 Mnemonics

1. **Well-Architected Pillars** -- *"SRC-CO"*  
   (Security, Reliability, Cost Optimization, Operational Excellence, Performance Efficiency, Sustainability)

2. **Disaster Recovery Strategies** -- *"Backup, Pilot, Warm, Active"* (B-P-W-A)  
   Increasing cost and decreasing RTO/RPO as you move right.

3. **Load Balancers** -- *"ALB = Apps; NLB = Networks; GWLB = Gateways"* (Layer 7, 4, 3)

4. **Security Groups vs NACLs** -- *"SG = Stateful, instance-level bouncer; NACL = Stateless, subnet-level checkpoint"*

5. **Storage Types** -- *"Objects in buckets, Blocks for disks, Files for sharing"* (S3, EBS, EFS)

6. **VPC Connectivity** -- *"Peering = Pair; Transit Gateway = Hub; PrivateLink = Private pipe; VPN = Public tunnel; Direct Connect = Private road"*

7. **EC2 Purchasing** -- *"OD = On Demand; RI = Reserved; Spot = Spontaneous; Savings = Subscription"*

---

# Study Tips & Exam Strategy

## General Tips (Both Exams)

1. **Read the question twice.** Many distractors are plausible because they are real AWS services -- but not the *best* answer for the scenario.
2. **Eliminate wrong answers first.** If you can rule out two choices, your odds improve dramatically.
3. **Watch for "most cost-effective," "most secure," "least operational overhead."** The exam often asks for the *best* tradeoff, not just a working solution.
4. **Compensatory scoring means you don't need to ace every domain.** Play to your strengths, but don't completely ignore any section.
5. **No penalty for guessing.** Answer every question.

## AIF-C01 Specific Tips

- **Focus on concepts, not code.** You do NOT need to write Python, tune hyperparameters, or build pipelines from scratch.
- **Know the difference between Bedrock and SageMaker.** Bedrock = consume FMs via API; SageMaker = build, train, and deploy custom models.
- **Memorize prompt engineering techniques** (zero-shot, few-shot, chain-of-thought) and when each is appropriate.
- **Understand RAG deeply** -- it's a high-yield topic for this exam.
- **Be ready for case studies** -- read the scenario carefully, identify the business problem, then match it to the correct service/approach.

## SAA-C03 Specific Tips

- **Draw VPC diagrams in your head.** If a question mentions public/private subnets, NAT gateways, ALBs, and databases, sketch the architecture mentally.
- **Master the storage decision tree.** S3 vs EBS vs EFS vs FSx is heavily tested.
- **Know your DR strategies cold.** Be able to rank backup-and-restore, pilot light, warm standby, and active-active by RTO, RPO, and cost.
- **Database selection is critical.** Practice scenarios asking "Should I use RDS, Aurora, DynamoDB, or ElastiCache?"
- **Cost optimization is everywhere.** Even "secure" and "resilient" questions may have a cost-optimized angle.

## Last-Minute Recall Boosters

- **Morning of the exam:** Review the mnemonics in this guide.
- **Services flashcards:** Quiz yourself on "What service does X?" and "When do I use Y?"
- **Practice reading AWS architecture diagrams** to quickly identify single points of failure, security gaps, and performance bottlenecks.

---

> **Good luck on your exams!** [ROCKET]
