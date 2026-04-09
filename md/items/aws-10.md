# AWS Certified Solutions Architect Associate (SAA-C03) Ultimate Study Guide

> **Last Updated:** April 2025  
> **Exam Version:** SAA-C03  
> **Validity:** Check [AWS Certification](https://aws.amazon.com/certification/) for latest updates

---

## 📋 Exam Overview

| Attribute | Details |
|-----------|---------|
| **Exam Code** | SAA-C03 |
| **Duration** | 130 minutes |
| **Questions** | 65 (50 scored + 15 unscored) |
| **Question Types** | Multiple choice, Multiple response |
| **Passing Score** | 720 / 1000 (72%) |
| **Cost** | $150 USD |
| **Prerequisites** | None officially, but 1+ years of hands-on AWS experience recommended |
| **Validity** | 3 years |

---

## 🎯 Exam Domains Breakdown

| Domain | Weight | Focus Areas |
|--------|--------|-------------|
| **Domain 1:** Design Secure Architectures | 30% | IAM, VPC security, encryption, multi-account governance |
| **Domain 2:** Design Resilient Architectures | 26% | High availability, fault tolerance, disaster recovery |
| **Domain 3:** Design High-Performing Architectures | 24% | Scaling, caching, database optimization, CDN |
| **Domain 4:** Design Cost-Optimized Architectures | 20% | Pricing models, right-sizing, cost management tools |

---

## 🏛️ AWS Well-Architected Framework (The Foundation)

The **AWS Well-Architected Framework** is the philosophical foundation of the SAA-C03 exam. Every question can be mapped to one of its five pillars:

| Pillar | Key Concepts |
|--------|--------------|
| **1. Operational Excellence** | Monitoring, observability, automation, change management, runbooks |
| **2. Security** | Least privilege, audit, encryption, boundary defense, data protection |
| **3. Reliability** | Eliminate single points of failure, recovery design, backups, Multi-AZ/Region |
| **4. Performance Efficiency** | Scaling, appropriate service selection, caching, serverless |
| **5. Cost Optimization** | Pay-as-you-go, storage tiering, reservations/spot, waste elimination |

> **💡 Pro Tip:** When answering questions, identify which pillar the scenario is testing. This helps eliminate wrong choices.

---

# Domain 1: Design Secure Architectures (30%)

## 1.1 Design Secure Access to AWS Resources

### AWS Identity and Access Management (IAM)

| Concept | Description |
|---------|-------------|
| **IAM Users** | Long-term credentials for humans or applications (avoid using root!) |
| **IAM Groups** | Collection of users for easier permission management |
| **IAM Roles** | Temporary credentials - **preferred over users** for EC2, Lambda, cross-account access |
| **IAM Policies** | JSON documents defining permissions (managed, inline, customer-managed) |
| **Service-Linked Roles** | Predefined roles that AWS services use to call other services |

**Key Best Practices:**
- ✅ Use **IAM Roles** for EC2 instances, Lambda functions (not access keys)
- ✅ Apply **Least Privilege Principle** - grant minimum necessary permissions
- ✅ Enable **MFA** for root user and privileged IAM users
- ✅ Use **STS (Security Token Service)** for temporary credentials
- ✅ Implement **cross-account access** using roles, not shared credentials

### Multi-Account Strategy

| Service | Purpose |
|---------|---------|
| **AWS Organizations** | Consolidate billing, create account hierarchy, apply Service Control Policies (SCPs) |
| **AWS Control Tower** | Automate multi-account setup with guardrails |
| **Service Control Policies (SCPs)** | IAM-like policies applied at OU/account level |
| **AWS IAM Identity Center** | Centralized SSO access to multiple accounts |

### Federation & SSO

| Scenario | Solution |
|----------|----------|
| Enterprise SSO | AWS IAM Identity Center (successor to AWS SSO) |
| SAML 2.0 federation | Corporate directory (Active Directory) → IAM roles |
| Web/mobile app authentication | Amazon Cognito |
| Third-party identity providers | OIDC/OAuth 2.0 federation |

## 1.2 Design Secure Workloads and Applications

### VPC Security

| Component | Purpose | Key Points |
|-----------|---------|------------|
| **Security Groups** | Instance-level firewall (stateful) | Allow rules only, can reference other SGs |
| **Network ACLs** | Subnet-level firewall (stateless) | Allow AND deny rules, ordered rules |
| **NAT Gateway** | Outbound internet from private subnets | Managed, highly available, no admin needed |
| **NAT Instance** | Legacy - use NAT Gateway instead | Self-managed, single point of failure |
| **VPC Endpoints** | Private connection to AWS services | Gateway endpoints (S3, DynamoDB) or Interface endpoints (PrivateLink) |
| **VPC Peering** | Connect two VPCs | Same or different accounts/regions; non-transitive |
| **AWS PrivateLink** | Access services privately across VPCs/accounts | Interface VPC endpoints |

**Security Group vs NACL:**
- **Security Groups** = Stateful (return traffic auto-allowed), instance-level, allow rules only
- **NACLs** = Stateless (must allow return traffic), subnet-level, allow AND deny rules

### Application Security Services

| Service | Purpose |
|---------|---------|
| **AWS WAF** | Web Application Firewall - protect against SQL injection, XSS, DDoS |
| **AWS Shield** | DDoS protection (Standard = free, Advanced = paid with 24/7 support) |
| **AWS Firewall Manager** | Central WAF rule management across accounts |
| **AWS Network Firewall** | VPC-level network traffic inspection |
| **Amazon GuardDuty** | Intelligent threat detection using ML |
| **Amazon Inspector** | Automated security assessments for EC2/ECR |
| **Amazon Macie** | Discover and protect sensitive data (PII) in S3 |
| **AWS Secrets Manager** | Rotate, manage, retrieve secrets (database credentials, API keys) |
| **AWS Certificate Manager (ACM)** | Provision and manage SSL/TLS certificates |

### Network Security Patterns

| Pattern | Implementation |
|---------|----------------|
| **Private subnets for databases** | EC2 in public subnet → RDS in private subnet |
| **Bastion hosts / Jump boxes** | Secure access to private instances via hardened EC2 |
| **VPC Flow Logs** | Capture IP traffic information for monitoring |
| **AWS Client VPN** | Remote access to VPC resources |
| **Site-to-Site VPN** | Encrypted connection between on-premise and AWS |
| **AWS Direct Connect** | Dedicated private connection (bypass internet) |

## 1.3 Determine Appropriate Data Security Controls

### Encryption

| Data State | Services |
|------------|----------|
| **Encryption at Rest** | AWS KMS (managed keys), S3 SSE, EBS encryption, RDS encryption |
| **Encryption in Transit** | TLS/SSL (ACM certificates), VPN, Direct Connect |

### AWS Key Management Service (KMS)

| Key Type | Description | Use Case |
|----------|-------------|----------|
| **AWS Managed Keys** | Created and managed by AWS | Default encryption for services |
| **Customer Managed Keys (CMK)** | You create and control | Custom key policies, rotation, deletion |
| **AWS Owned Keys** | Shared across AWS accounts | Used for multi-tenant services |
| **CloudHSM** | Dedicated hardware security modules | FIPS 140-2 Level 3 compliance |

**KMS Key Rotation:**
- AWS-managed keys: Automatic every 3 years
- Customer-managed keys: Optional automatic yearly rotation

### Data Protection Services

| Service | Purpose |
|---------|---------|
| **Amazon S3** | Object-level encryption, versioning, MFA delete, bucket policies |
| **AWS Backup** | Centralized backup across services |
| **AWS Config** | Track resource configurations and compliance |
| **AWS CloudTrail** | Log API calls and account activity (audit trail) |

---

# Domain 2: Design Resilient Architectures (26%)

## 2.1 Design Scalable and Loosely Coupled Architectures

### Compute Scaling

| Service | Scaling Type | Best For |
|---------|--------------|----------|
| **Amazon EC2 Auto Scaling** | Horizontal (add/remove instances) | Predictable workloads, full control |
| **AWS Auto Scaling** | Scaling across multiple services | ECS, DynamoDB, Aurora |
| **AWS Lambda** | Automatic scaling | Event-driven, unpredictable traffic |
| **AWS Fargate** | Automatic container scaling | Serverless containers |

**EC2 Purchasing Options (for Resilience & Cost):**

| Option | Use Case |
|--------|----------|
| **On-Demand** | Short-term, unpredictable, dev/test |
| **Reserved Instances (RI)** | Predictable workloads, 1-3 year commitment |
| **Savings Plans** | Flexible commitment, applies across instance families |
| **Spot Instances** | Fault-tolerant, flexible workloads (up to 90% discount) |
| **Dedicated Hosts** | Compliance, software licensing requirements |

### Decoupling & Messaging

| Service | Pattern | Use Case |
|---------|---------|----------|
| **Amazon SQS** | Queue (buffering) | Decouple components, absorb spikes |
| **Amazon SNS** | Pub/Sub (push notifications) | Multiple subscribers, fan-out |
| **Amazon EventBridge** | Event bus | Route events between services, scheduled tasks |
| **AWS Step Functions** | Workflow orchestration | Coordinate multiple Lambda functions, visual workflows |

**SQS Queue Types:**
- **Standard Queue:** Unlimited throughput, at-least-once delivery, best-effort ordering
- **FIFO Queue:** Exactly-once processing, strict ordering, limited throughput (3000/sec with batching)

### Container Services

| Service | Description |
|---------|-------------|
| **Amazon ECS** | AWS-native container orchestration |
| **Amazon EKS** | Managed Kubernetes service |
| **Amazon ECR** | Container image registry |
| **AWS Fargate** | Serverless compute for containers (no EC2 management) |
| **ECS/EKS Anywhere** | Run containers on-premises |

### API Management

| Service | Purpose |
|---------|---------|
| **Amazon API Gateway** | Create, publish, maintain, monitor APIs |
| **API Caching** | Reduce backend calls, improve latency |
| **Throttling** | Protect backend from overload |
| **Usage Plans** | Control access and quotas for API consumers |

## 2.2 Design Highly Available and/or Fault-Tolerant Architectures

### AWS Global Infrastructure

| Component | Description |
|-----------|-------------|
| **Region** | Geographic area with multiple AZs (choose for compliance/latency) |
| **Availability Zone (AZ)** | Isolated data center within a region (design for HA across AZs) |
| **Edge Location** | CDN point of presence for CloudFront |
| **Local Zone** | Extension of AWS Region closer to users |
| **Wavelength Zone** | AWS infrastructure embedded in 5G networks |

### High Availability Patterns

| Tier | HA Implementation |
|------|-------------------|
| **Web Tier** | ALB/NLB + EC2 Auto Scaling across multiple AZs |
| **Application Tier** | Auto Scaling + ECS/EKS across multiple AZs |
| **Database Tier** | RDS Multi-AZ, Aurora (6 copies across 3 AZs) |
| **DNS** | Route 53 with health checks and failover routing |

### Disaster Recovery Strategies

| Strategy | RTO | RPO | Description |
|----------|-----|-----|-------------|
| **Backup & Restore** | Hours | 24+ hours | Cheapest, periodic backups |
| **Pilot Light** | 10-60 min | Minutes | Core services always running, scale up on disaster |
| **Warm Standby** | Minutes | Minutes | Scaled-down production running, scale up on disaster |
| **Multi-Site Active-Active** | Near zero | Near zero | Full production in multiple regions, most expensive |

**Key Terms:**
- **RTO (Recovery Time Objective):** How quickly to recover
- **RPO (Recovery Point Objective):** How much data loss is acceptable

### Load Balancing

| Load Balancer Type | OSI Layer | Best For |
|--------------------|-----------|----------|
| **Application Load Balancer (ALB)** | Layer 7 | HTTP/HTTPS, routing based on path/host |
| **Network Load Balancer (NLB)** | Layer 4 | TCP/UDP, extreme performance, static IP |
| **Gateway Load Balancer (GWLB)** | Layer 3 | Third-party virtual appliances |
| **Classic Load Balancer (CLB)** | Layer 4/7 | Legacy - avoid for new designs |

### DNS & Routing (Route 53)

| Routing Policy | Use Case |
|----------------|----------|
| **Simple** | Single resource |
| **Weighted** | A/B testing, gradual migration |
| **Failover** | Active-passive disaster recovery |
| **Geolocation** | Route based on user location (country/continent) |
| **Geoproximity** | Route based on resource proximity (with bias) |
| **Latency-based** | Route to lowest latency region |
| **Multivalue Answer** | Basic load balancing (return multiple IPs) |

---

# Domain 3: Design High-Performing Architectures (24%)

## 3.1 Determine High-Performing and/or Scalable Storage Solutions

### Storage Comparison

| Service | Type | Use Case | Performance |
|---------|------|----------|-------------|
| **Amazon S3** | Object storage | Static files, backups, data lake | 11 9's durability |
| **Amazon EBS** | Block storage | EC2 instance storage | GP3, IO2 provisioned IOPS |
| **Amazon EFS** | File storage (NFS) | Shared file systems across EC2 | Auto-scaling, burst capability |
| **Amazon FSx** | Managed file servers | Windows (SMB), Lustre (HPC) | High performance |
| **Amazon S3 Glacier** | Archive | Long-term retention | Minutes to hours retrieval |

### Amazon S3 Storage Classes

| Storage Class | Use Case | Retrieval Time |
|---------------|----------|----------------|
| **S3 Standard** | Frequently accessed data | Milliseconds |
| **S3 Intelligent-Tiering** | Unknown/changing access patterns | Milliseconds, auto-tiering |
| **S3 Standard-IA** | Infrequently accessed, needed quickly | Milliseconds |
| **S3 One Zone-IA** | Infrequently accessed, reproducible | Milliseconds (single AZ) |
| **S3 Glacier Instant Retrieval** | Archive, rarely accessed, need instantly | Milliseconds |
| **S3 Glacier Flexible Retrieval** | Archive, rarely accessed | Minutes to hours |
| **S3 Glacier Deep Archive** | Long-term archive (7-10 years) | 12-48 hours |

**S3 Key Features:**
- **Versioning:** Keep multiple versions of objects (protect against accidental deletion)
- **Lifecycle Policies:** Auto-transition between storage classes
- **Cross-Region Replication (CRR):** Replicate to different region
- **Same-Region Replication (SRR):** Replicate within same region
- **S3 Transfer Acceleration:** Fast uploads via CloudFront edge locations
- **S3 Select:** Retrieve subset of data from objects

### EBS Volume Types

| Volume Type | Use Case | IOPS |
|-------------|----------|------|
| **gp3** | General purpose (default) | 3,000-16,000 |
| **gp2** | Legacy general purpose | 3 IOPS/GB (burst to 3,000) |
| **io2/io2 Block Express** | I/O intensive, databases | 64,000-256,000 |
| **st1** | Throughput optimized (HDD) | 500 MB/s per TB |
| **sc1** | Cold HDD | 250 MB/s per TB (lowest cost) |

## 3.2 Design High-Performing and Elastic Compute Solutions

### EC2 Instance Families

| Family | Use Case |
|--------|----------|
| **T3/T4g** | Burstable, general purpose, dev/test |
| **M6i/M6g** | General purpose, balanced compute/memory |
| **C6i/C7g** | Compute optimized, CPU-intensive |
| **R6i/R6g** | Memory optimized, in-memory caches, databases |
| **I4i** | Storage optimized, high IOPS |
| **G5/P4** | GPU instances, ML/AI, graphics |
| **Hpc6a** | High performance computing |

**EC2 Enhanced Networking:**
- **ENA (Elastic Network Adapter):** Up to 100 Gbps
- **EFA (Elastic Fabric Adapter):** HPC, ML - OS bypass

### Serverless Compute

| Service | Use Case | Limits |
|---------|----------|--------|
| **AWS Lambda** | Event-driven functions | 15 min timeout, 10 GB memory, 6 MB payload |
| **AWS Fargate** | Serverless containers | Task size up to 16 vCPU, 120 GB memory |
| **AWS Batch** | Batch computing at scale | Managed compute environments |

**Lambda Triggers:**
- API Gateway, S3 events, SQS, SNS, EventBridge, DynamoDB Streams, Kinesis, CloudWatch Events

### Edge Services

| Service | Purpose |
|---------|---------|
| **Amazon CloudFront** | Global CDN, cache static and dynamic content |
| **AWS Global Accelerator** | Improve global application availability and performance (static anycast IPs) |
| **AWS Outposts** | Run AWS services on-premises |
| **AWS Wavelength** | Run apps within 5G networks (ultra-low latency) |

**CloudFront vs Global Accelerator:**
- **CloudFront:** Caches content at edge, good for static content, HTTP/HTTPS
- **Global Accelerator:** Routes traffic over AWS backbone, good for dynamic content, TCP/UDP, static IPs

## 3.3 Determine High-Performing Database Solutions

### Database Services Comparison

| Service | Type | Best For |
|---------|------|----------|
| **Amazon RDS** | Managed relational | MySQL, PostgreSQL, MariaDB, SQL Server, Oracle |
| **Amazon Aurora** | Cloud-optimized relational | High performance, MySQL/PostgreSQL compatible |
| **Amazon DynamoDB** | NoSQL key-value/document | Single-digit ms latency, massive scale, serverless |
| **Amazon ElastiCache** | In-memory cache | Redis or Memcached, session storage, query caching |
| **Amazon Redshift** | Data warehouse | Analytics, petabyte-scale |
| **Amazon Neptune** | Graph database | Relationship data, fraud detection |
| **Amazon Keyspaces** | Managed Cassandra | Cassandra-compatible applications |
| **Amazon DocumentDB** | Document database | MongoDB-compatible |
| **Amazon Timestream** | Time series | IoT, operational metrics |
| **Amazon QLDB** | Ledger database | Immutable transaction log |

### RDS & Aurora

| Feature | RDS | Aurora |
|---------|-----|--------|
| **Performance** | Standard | 5x MySQL, 3x PostgreSQL |
| **Storage** | Provisioned | Auto-scaling up to 128 TB |
| **Replicas** | Read replicas (5) | Aurora Replicas (15), faster failover |
| **Multi-AZ** | Synchronous standby | 6 copies across 3 AZs |
| **Serverless** | Aurora Serverless v2 | Yes |

**RDS High Availability:**
- **Multi-AZ:** Synchronous standby for failover (DR)
- **Read Replicas:** Asynchronous copies for read scaling (performance)

### DynamoDB

| Feature | Description |
|---------|-------------|
| **Primary Key** | Partition key (simple) or Partition + Sort key (composite) |
| **Secondary Indexes** | Global (any attributes) or Local (same partition key) |
| **Capacity Modes** | On-demand (pay per request) or Provisioned (auto-scaling) |
| **DAX** | DynamoDB Accelerator - microsecond latency for cached reads |
| **Streams** | Capture item-level changes for triggers |
| **Global Tables** | Multi-region, multi-active replication |

### Caching Strategies

| Service | Use Case |
|---------|----------|
| **ElastiCache Redis** | Complex data structures, persistence, pub/sub, sorted sets |
| **ElastiCache Memcached** | Simple key-value, multi-threaded |
| **DAX** | DynamoDB read caching |
| **CloudFront** | HTTP content caching at edge |

## 3.4 Determine High-Performing and/or Scalable Network Architectures

### Networking Services

| Service | Purpose |
|---------|---------|
| **VPC Peering** | Connect two VPCs (same/different accounts/regions) |
| **AWS Transit Gateway** | Hub-and-spoke VPC connectivity (scale beyond peering) |
| **AWS PrivateLink** | Private access to services across VPCs/accounts |
| **AWS Direct Connect** | Dedicated private connection to AWS |
| **AWS VPN** | Encrypted connection over internet |
| **AWS App Mesh** | Service mesh for microservices |

### Data Transfer Optimization

| Scenario | Solution |
|----------|----------|
| **Large one-time migration** | AWS Snowball, Snowmobile |
| **Ongoing sync on-premises ↔ AWS** | AWS DataSync |
| **Database migration** | AWS Database Migration Service (DMS) |
| **Offline data transfer** | Snowball Edge, Snowcone |

---

# Domain 4: Design Cost-Optimized Architectures (20%)

## 4.1 Design Cost-Optimized Storage Solutions

### S3 Cost Optimization

| Strategy | Implementation |
|----------|----------------|
| **Lifecycle Policies** | Auto-transition to cheaper storage classes |
| **Intelligent-Tiering** | Auto-move objects based on access patterns |
| **Delete incomplete multipart uploads** | Abort after X days |
| **Object expiration** | Delete old versions/logs automatically |
| **Requester Pays** | Charge downloaders instead of bucket owner |

### Storage Selection Decision Tree

| Requirement | Solution |
|-------------|----------|
| Static website, backups, data lake | S3 |
| EC2 instance storage | EBS |
| Shared file system across instances | EFS |
| Windows file share | FSx for Windows |
| HPC workloads | FSx for Lustre |
| Long-term archive | S3 Glacier |

## 4.2 Design Cost-Optimized Compute Solutions

### EC2 Pricing Optimization

| Workload Pattern | Best Option |
|------------------|-------------|
| Steady-state, predictable | Reserved Instances or Savings Plans (up to 72% savings) |
| Variable, needs capacity guarantee | On-Demand with Auto Scaling |
| Fault-tolerant, flexible | Spot Instances (up to 90% savings) |
| Short-term, dev/test | Spot or On-Demand |

**Compute Savings Plans vs Reserved Instances:**
- **Savings Plans:** More flexible, applies to usage regardless of instance family/region
- **Reserved Instances:** Specific to instance family, region, tenancy

### Serverless Cost Optimization

| Service | Cost Model |
|---------|------------|
| **AWS Lambda** | Pay per request + execution time (ms) |
| **AWS Fargate** | Pay for vCPU and memory resources used |
| **API Gateway** | Pay per API call + data transfer |

## 4.3 Design Cost-Optimized Database Solutions

| Strategy | Implementation |
|----------|----------------|
| **Right-sizing** | Choose appropriate instance size |
| **Reserved Instances** | Commit to 1-3 years for RDS |
| **Aurora Serverless v2** | Auto-scale capacity, pay per use |
| **DynamoDB On-Demand** | Pay per request for unpredictable workloads |
| **Read Replicas** | Offload read traffic instead of upsizing |
| **ElastiCache** | Reduce database load by caching |

## 4.4 Design Cost-Optimized Network Architectures

| Cost-Saving Strategy | Implementation |
|----------------------|----------------|
| **VPC Endpoints** | Use Gateway endpoints for S3/DynamoDB (free) instead of NAT Gateway |
| **CloudFront** | Cache content to reduce origin load and data transfer costs |
| **Direct Connect** | Reduce data transfer costs for high-volume transfers |
| **Reserved capacity** | Reserve Direct Connect port |

### Data Transfer Costs (Key Points)

| Direction | Cost |
|-----------|------|
| **In to AWS** | Free |
| **Out from AWS** | Charged (varies by service) |
| **Within same AZ** | Free |
| **Between AZs in same region** | Charged |
| **Cross-region** | Charged |

---

## 📊 Cost Management Tools

| Tool | Purpose |
|------|---------|
| **AWS Cost Explorer** | Visualize and analyze costs |
| **AWS Budgets** | Set custom budgets and alerts |
| **AWS Cost and Usage Report** | Detailed billing data |
| **AWS Pricing Calculator** | Estimate costs before deployment |
| **Savings Plans** | Compute savings recommendations |
| **AWS Compute Optimizer** | Right-sizing recommendations |

---

# 🔥 High-Priority Services (Must Know Cold)

These services appear frequently on the exam - know them inside and out:

## Compute
- Amazon EC2 + Auto Scaling
- AWS Lambda
- Amazon ECS/EKS/Fargate

## Storage
- Amazon S3 (all storage classes + features)
- Amazon EBS
- Amazon EFS

## Database
- Amazon RDS (Multi-AZ, Read Replicas)
- Amazon Aurora
- Amazon DynamoDB
- Amazon ElastiCache

## Networking
- Amazon VPC (subnets, route tables, security groups, NACLs)
- Elastic Load Balancing (ALB, NLB)
- Amazon CloudFront
- Amazon Route 53
- NAT Gateway

## Security
- AWS IAM (roles, policies, best practices)
- AWS KMS
- AWS WAF + Shield
- Amazon GuardDuty

## Management
- Amazon CloudWatch
- AWS CloudTrail
- AWS CloudFormation
- AWS Config

---

# 🎓 Key Exam Strategies

## 1. Read the Question Carefully

Look for keywords:
- **"Most cost-effective"** → Cheapest option that meets requirements
- **"Most secure"** → Security over cost
- **"Least operational overhead"** → Managed services over self-managed
- **"Highly available"** → Multi-AZ, auto-failover
- **"Serverless"** → Lambda, Fargate, DynamoDB

## 2. Eliminate Wrong Answers

| If you see... | It's likely wrong because... |
|---------------|------------------------------|
| NAT Instance | Use NAT Gateway instead (managed, HA) |
| Classic Load Balancer | Use ALB or NLB |
| Access Keys on EC2 | Use IAM Roles |
| Root account for daily tasks | Use IAM users/roles |
| Single EC2 for HA | Need Auto Scaling across AZs |
| Backup for HA | Backups are for DR, not HA |

## 3. Common Architecture Patterns

| Scenario | Answer Pattern |
|----------|----------------|
| Static website | S3 + CloudFront |
| Dynamic website | ALB + EC2 Auto Scaling + RDS Multi-AZ |
| Serverless API | API Gateway + Lambda + DynamoDB |
| High read traffic | Add ElastiCache or RDS Read Replicas |
| Global application | CloudFront + Route 53 latency routing |
| Queue-based processing | SQS + EC2 Auto Scaling or Lambda |
| Container orchestration | ECS Fargate or EKS |

## 4. Time Management

- **130 minutes / 65 questions** = 2 minutes per question
- Flag difficult questions and return later
- Don't get stuck on one question

---

# 📚 Recommended Study Resources

## Official AWS Resources
1. [AWS SAA-C03 Exam Guide (Official PDF)](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)
2. [AWS Free Tier](https://aws.amazon.com/free/) - Hands-on practice
3. [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)
4. [AWS Whitepapers](https://aws.amazon.com/whitepapers/)
5. [AWS FAQs](https://aws.amazon.com/faqs/) for each service

## Essential Whitepapers
- AWS Well-Architected Framework
- Architecting for the Cloud: AWS Best Practices
- AWS Security Best Practices
- AWS Storage Services Overview
- Amazon VPC Connectivity Options

## Practice Exams
- Official AWS Practice Questions
- Jon Bonso/Tutorials Dojo (highly recommended)
- Stephane Maarek's practice exams

---

# ✅ Exam Day Checklist

- [ ] Valid photo ID
- [ ] Stable internet connection (if online)
- [ ] Quiet, private room (if online)
- [ ] Arrive early (15-30 minutes)
- [ ] Read questions carefully
- [ ] Use flag feature for uncertain questions
- [ ] Review all answers if time permits

---

# 📝 Quick Reference: Service-to-Use Mapping

| Requirement | Service |
|-------------|---------|
| Block storage for EC2 | EBS |
| Object storage | S3 |
| Shared file storage | EFS |
| Managed Windows file server | FSx for Windows |
| Relational database | RDS/Aurora |
| NoSQL database | DynamoDB |
| In-memory cache | ElastiCache |
| Data warehouse | Redshift |
| Docker containers | ECS/EKS/Fargate |
| Serverless functions | Lambda |
| API management | API Gateway |
| Message queue | SQS |
| Pub/sub messaging | SNS |
| Event routing | EventBridge |
| CDN | CloudFront |
| DNS | Route 53 |
| DDoS protection | Shield |
| Web application firewall | WAF |
| Secrets management | Secrets Manager |
| Encryption keys | KMS |
| Threat detection | GuardDuty |
| Configuration compliance | Config |
| Audit logging | CloudTrail |
| Monitoring | CloudWatch |
| Infrastructure as Code | CloudFormation |

---

**Good luck with your SAA-C03 exam preparation! 🎉**

*Remember: The exam tests your ability to make architectural decisions based on the AWS Well-Architected Framework. Focus on understanding WHY a solution is correct, not just memorizing services.*
