# AWS SAA-C03 Ultimate Study Guide

This study guide is organized by the four official SAA-C03 domains and focuses on the AWS products, services, and concepts that appear most frequently on the exam.[web:1][web:4]

---

## Exam overview

- **Exam name:** AWS Certified Solutions Architect – Associate (SAA-C03).[web:4]
- **Question types:** Multiple choice and multiple response.[web:4]
- **Primary focus:** Design secure, resilient, high-performing, and cost-optimized architectures using the AWS Well-Architected Framework.[web:4]
- **Domains and weights:**
  - Domain 1 – Design Secure Architectures (30%).[web:1]
  - Domain 2 – Design Resilient Architectures (26%).[web:1]
  - Domain 3 – Design High-Performing Architectures (24%).[web:1]
  - Domain 4 – Design Cost-Optimized Architectures (20%).[web:1]

Core preparation sources:

- Official SAA-C03 exam guide (HTML/PDF) – content outline, in-scope services.[web:2][web:4]
- AWS Well-Architected Framework whitepaper (all pillars, especially Security, Reliability, Performance Efficiency, and Cost Optimization).[web:4]

---

## Domain 1: Design secure architectures (30%)

Focus: Identity, access management, network security, data protection, and secure application access patterns.

### Identity and access management

**Services to master**

- **AWS Identity and Access Management (IAM):** Users, groups, roles, policies (identity-based vs resource-based), IAM policy evaluation logic, permission boundaries, service-linked roles, IAM roles for services, and cross-account access patterns.[web:2]
- **AWS Single Sign-On / IAM Identity Center (may still be referred to as AWS SSO in materials):** SSO access to multiple AWS accounts and applications, integration with external identity providers (IdP) using SAML.[web:2]
- **AWS Organizations:** Organization units (OUs), service control policies (SCPs) for guardrails, consolidated billing, multi-account strategies (security, sandbox, shared services accounts).[web:2]
- **AWS STS:** Temporary security credentials, AssumeRole patterns, federation flows.[web:2]

**Key concepts**

- **Least privilege:** Grant only required actions on specific resources, avoid wildcards in production policy examples.[web:2]
- **Separation of duties:** Break out admin, security, and application roles; use roles instead of long-lived access keys.[web:2]
- **Cross-account access:** Use IAM roles with trust policies plus resource policies instead of sharing root or IAM user credentials.[web:2]
- **IAM policy types:** Identity-based policies, resource-based policies (for S3, KMS, Lambda, etc.), permissions boundaries, SCPs, session policies.[web:2]

### Network security and secure connectivity

**Amazon VPC**

- **Core components:** VPCs, subnets (public vs private), route tables, internet gateway (IGW), NAT gateway/instances, VPC peering, VPC endpoints (Gateway and Interface/PrivateLink).[web:2]
- **Security layers:** Security groups (stateful) vs network ACLs (stateless), inbound vs outbound rules, common patterns for web tiers vs database tiers.[web:2]
- **Private connectivity:**
  - VPC endpoints to access AWS services without traversing the public internet.[web:2]
  - AWS PrivateLink for exposing services via interface endpoints across accounts/VPCs.[web:2]
  - AWS Site-to-Site VPN, AWS Direct Connect, and VPN + Direct Connect for hybrid connectivity.[web:2]
- **Multi-VPC and hybrid:** Transit Gateway for hub-and-spoke connectivity vs VPC peering for point-to-point; when to use which.[web:2]

**Edge and application security**

- **AWS WAF:** Web ACLs, rules, managed rule groups, integration with CloudFront, ALB, and API Gateway to protect against common web exploits.[web:2]
- **AWS Shield:** Standard vs Advanced protection, DDoS mitigation for CloudFront, Route 53, and other endpoints.[web:2]
- **AWS Network Firewall / Firewall Manager:** Centralized network protection and policy management across multiple VPCs and accounts.[web:2]
- **Amazon Route 53:** Public and private hosted zones, routing policies (simple, weighted, latency, failover, geolocation, multi-value), DNSSEC basics.[web:2]
- **Amazon CloudFront:** As a security/performance layer in front of S3, ALB, or custom origins; origin access control (OAC) / origin access identity (OAI) patterns.[web:2]

### Data protection and encryption

**Key services**

- **AWS Key Management Service (KMS):** Customer managed keys vs AWS managed keys, symmetric vs asymmetric keys, key policies, grants, envelope encryption.[web:2]
- **AWS Secrets Manager:** Secure rotation and storage of DB credentials, API keys, and secrets, integration with RDS, Lambda, etc.[web:2]
- **AWS Systems Manager Parameter Store:** SecureString parameters vs plain text configuration, hierarchy and versioning.[web:2]

**Encryption concepts**

- **At rest vs in transit:** TLS for network connections, S3/SNS/SQS/Kinesis encryption, EBS and RDS encryption patterns.[web:2]
- **Client-side vs server-side encryption:** SSE-S3, SSE-KMS, SSE-C for S3; key rotation and access patterns.[web:2]
- **Cross-account encryption:** Using KMS key policies and grants to let other accounts encrypt/decrypt when needed.[web:2]

### Secure storage and database patterns

- **Amazon S3 security:** Bucket policies, IAM policies, Block Public Access, ACLs (legacy), Access Points, VPC endpoints, S3 Object Lock, and versioning for protection against accidental deletion and ransomware-style attacks.[web:2]
- **RDS and Aurora:** Encryption at rest, enforcing SSL/TLS, managing credentials (IAM authentication, Secrets Manager).[web:2]
- **DynamoDB:** IAM-based access control, fine-grained access via condition keys (e.g., partition key constraints).[web:2]

### Compliance, logging, and monitoring

- **AWS CloudTrail:** Management, data, and insights events, organization-wide trails, encryption and storage of logs.[web:2]
- **Amazon CloudWatch:** Logs, metrics, alarms, dashboards, log metric filters for security alerts.[web:2]
- **AWS Config:** Resource configuration history, rules for compliance, remediation.
- **AWS Security Hub, GuardDuty, Inspector:** Aggregated findings, threat detection, and vulnerability assessment.[web:2]

---

## Domain 2: Design resilient architectures (26%)

Focus: High availability, fault tolerance, disaster recovery, and self-healing architectures.

### High availability and fault tolerance fundamentals

**Core principles**

- **Multi-AZ vs multi-Region:** When to design for AZ-level vs Region-level failure; typical SAA-C03 patterns emphasize multi-AZ for most workloads, multi-Region for mission-critical or compliance-driven workloads.[web:4][web:7]
- **Stateless vs stateful:** Prefer stateless app servers behind load balancers; keep state in managed, replicated storage like RDS Multi-AZ, DynamoDB, or S3.[web:4]
- **Horizontal vs vertical scaling:** Favor horizontal scaling with Auto Scaling groups, Lambda concurrency, or container replicas.[web:4]

### Compute resilience

- **Amazon EC2 Auto Scaling:** Launch templates, desired/min/max capacity, scaling policies (target tracking, step scaling, scheduled scaling), health checks, lifecycle hooks.[web:2]
- **Elastic Load Balancing:**
  - Application Load Balancer (ALB) for HTTP/HTTPS and WebSocket with advanced routing.
  - Network Load Balancer (NLB) for TCP/UDP and extreme performance.
  - Gateway Load Balancer for virtual appliances.
  - Cross-zone load balancing behaviors and health checks.[web:2]
- **Amazon ECS/EKS:** Task definitions, services, deployments, Fargate vs EC2 capacity, self-healing and spreading tasks across AZs.[web:2]
- **AWS Lambda:** Concurrency scaling, retries, DLQs, multi-AZ durability of Lambda services.

### Storage and database resilience

- **Amazon S3:** 11 nines durability, cross-AZ redundancy, versioning, cross-Region replication (CRR) for DR, lifecycle policies for tiering and cleanup.[web:2]
- **Amazon EBS:** Volume types (gp3, io1/io2, st1, sc1), Multi-Attach for io1/io2, snapshots for backup and DR, AZ-scoped nature of volumes.[web:2]
- **Amazon EFS:** Regional service with multi-AZ durability, performance modes (General Purpose vs Max I/O), throughput modes, and resiliency benefits compared to single-instance storage.[web:2]
- **AWS Backup:** Centralized backup policies for EBS, RDS, DynamoDB, EFS, FSx, and others.[web:2]

**Relational databases (RDS and Aurora)**

- **RDS Multi-AZ:** Synchronous replication within a Region, automatic failover, impact on availability and maintenance.[web:2]
- **Read replicas:** Asynchronous replication for scaling reads; cross-Region read replicas for DR and global access.[web:2]
- **Aurora:** Cluster architecture with writer and multiple readers, 6-copy storage across 3 AZs, features like Global Database and backtrack.[web:2]

**NoSQL and caching**

- **DynamoDB:** Multi-AZ data replication, on-demand and provisioned capacity, auto scaling, global tables for multi-Region active-active designs.[web:2]
- **Amazon ElastiCache (Redis/Memcached):** Clustering, replication groups, automatic failover for Redis; using caching to reduce pressure on databases and improve resilience.[web:2]

### Disaster recovery strategies

Understand and compare DR patterns and when they appear in scenario questions:[web:4]

- **Backup and restore:** Cheapest but slowest RTO/RPO.
- **Pilot light:** Minimal core infrastructure always running in target Region.
- **Warm standby:** Scaled-down full stack in secondary Region ready to scale up.
- **Multi-site/active-active:** Fully working stacks in multiple Regions.

Key services used:

- Cross-Region S3 replication, DynamoDB global tables, RDS cross-Region read replicas, Route 53 health checks and failover routing, and AWS Backup cross-Region backups.[web:2]

### Resilient network and edge design

- **Route 53 health checks and DNS failover** between endpoints in different Regions or across multi-AZ setups.[web:2]
- **CloudFront:** Global edge network, origin failover between S3 buckets or ALBs, shielding origin from traffic spikes.
- **API Gateway and regional vs edge-optimized endpoints** for client access.

---

## Domain 3: Design high-performing architectures (24%)

Focus: Selecting the right compute, storage, database, and network options for performance and scalability.

### Compute performance

- **EC2 instance families:** General purpose (M, T), compute optimized (C), memory optimized (R, X), storage optimized (I, D, H), and burstable (T) families – typical use cases and trade-offs.[web:2]
- **Placement groups:** Cluster, spread, and partition placement groups and when to use each (low latency HPC vs spreading instances across hardware for resilience).[web:2]
- **Elastic Load Balancing performance:** Choosing ALB vs NLB vs Gateway Load Balancer based on protocol and throughput needs.[web:2]
- **Auto Scaling performance tuning:** Scaling based on custom or predefined metrics, cooldowns, warm pools.[web:2]
- **Serverless performance:** Lambda memory/CPU trade-off, provisioned concurrency for latency-sensitive workloads.[web:2]

### Storage performance

- **EBS volume performance:** gp3 as modern default, IOPS and throughput characteristics, sizing for performance, RAID patterns on EBS when appropriate.[web:2]
- **EFS performance:** Performance vs throughput modes, regional multi-AZ file system shared by many instances or containers.[web:2]
- **S3 performance:** Request parallelization using key name patterns is less critical now, but understand multi-part uploads, transfer acceleration, and S3 Intelligent-Tiering.[web:2]

### Database and analytics performance

- **RDS/Aurora:** Read replicas for read scaling, connection pooling, query optimization basics, storage autoscaling, and Aurora Serverless v2 for variable workloads.[web:2]
- **DynamoDB:** Partition keys and hot partition issues, global secondary indexes (GSI) vs local secondary indexes (LSI), on-demand vs provisioned capacity with auto scaling, DAX for caching.[web:2]
- **Amazon Redshift:** Data warehousing use cases, distribution styles, sort keys, concurrency scaling, spectrum for querying data in S3.[web:2]
- **Amazon ElastiCache:** Offloading frequently accessed data from databases; when to choose Redis vs Memcached for performance.[web:2]

### Caching and content delivery

- **CloudFront:** Caching static and dynamic content, cache behaviors, TTLs, invalidations, signed URLs and cookies for private content.[web:2]
- **Application caching:** Using ElastiCache, DAX, and application-level caches to reduce latency and improve throughput.

### Networking performance

- **VPC design for performance:** Subnet placement, using multiple AZs, ENIs, and enhanced networking (ENA) for high throughput.[web:2]
- **Direct Connect vs VPN:** Lower latency and consistent bandwidth with Direct Connect vs quick but less predictable VPN tunnels.[web:2]

---

## Domain 4: Design cost-optimized architectures (20%)

Focus: Right-sizing, pricing models, and cost governance across compute, storage, database, and data transfer.

### Cost management services

- **AWS Cost Explorer:** Visualizing and analyzing AWS spending over time.[web:2]
- **AWS Budgets:** Creating cost and usage budgets with alerts.[web:2]
- **Cost and Usage Report (CUR):** Detailed billing data for advanced analysis.
- **AWS Compute Optimizer and Rightsizing recommendations:** Suggestions to downsize or change instance families based on utilization.

### Compute cost optimization

- **EC2 pricing models:** On-Demand, Reserved Instances (Standard vs Convertible, 1-year vs 3-year, all/partial/no upfront), Savings Plans (Compute vs EC2), and Spot Instances.[web:2]
- **Auto Scaling for cost:** Scale down during off-hours; combine on-demand, reserved, and spot in Auto Scaling groups (mixed instance policies).[web:2]
- **Lambda and Fargate costs:** Pay-per-invocation and duration, tuning memory to minimize cost per execution while meeting performance requirements.[web:2]

### Storage and database cost optimization

- **S3 storage classes:** Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Flexible Retrieval, Deep Archive, and when to choose each based on access patterns and retrieval latency.[web:2]
- **Lifecycle policies:** Transitioning objects between classes and expiring data to control storage growth.[web:2]
- **EBS:** Choosing gp3 vs higher-cost io1/io2, deleting unattached volumes, and using snapshots for backup instead of keeping large idle volumes.[web:2]
- **EFS:** Standard vs Infrequent Access classes and lifecycle policies to move infrequently accessed files to EFS-IA.
- **RDS/Aurora:** Right-sizing instance classes, storage autoscaling settings, and using read replicas or Aurora Serverless where appropriate.[web:2]
- **DynamoDB:** Choosing on-demand vs provisioned capacity with auto scaling, using TTL to automatically delete stale items.[web:2]

### Data transfer and architecture choices

- **Data transfer pricing basics:** Intra-AZ vs inter-AZ, inter-Region, internet egress, and how using VPC endpoints, CloudFront, or PrivateLink can reduce costs.[web:2]
- **Architectural trade-offs:** Placing services in same AZ/VPC/Region when possible, using caching and CDNs to minimize repeated data transfer.

---

## Cross-domain core services to know cold

Based on the official exam guide and community analyses, these services appear in a large portion of questions and are worth deep study time.[web:2][web:7][web:10]

### Tier 1: Absolutely critical

- **Amazon VPC:** Subnets, routing, endpoints, NAT, security groups, NACLs, peering, Transit Gateway.[web:2][web:7]
- **IAM and Organizations:** Permissions, roles, SCPs, cross-account access.[web:2][web:7]
- **S3:** Storage classes, lifecycle, encryption, versioning, replication, access controls.[web:2][web:7]
- **EC2 and Auto Scaling:** Instance types, pricing models, ASG policies, health checks, placement groups.[web:2][web:7]
- **ELB (ALB/NLB):** Load balancing patterns, health checks, routing, integration with EC2, ECS, and Lambda.[web:2][web:7]
- **RDS/Aurora:** Multi-AZ, read replicas, backups, encryption, failover, Aurora Global Database.[web:2][web:7]

### Tier 2: Very important

- **Lambda and API Gateway:** Serverless patterns, event sources, integrations.[web:2][web:7]
- **DynamoDB:** Keys, indexes, capacity modes, global tables, DAX.[web:2][web:7]
- **CloudFront and Route 53:** Edge delivery, caching, advanced routing and failover.[web:2][web:7]
- **SQS, SNS, EventBridge, Step Functions:** Decoupling, pub/sub, event-driven and workflow designs.[web:2][web:7]
- **KMS, Secrets Manager, Parameter Store:** Encryption and secret management patterns.[web:2][web:7]

### Tier 3: Frequently used but narrower

- **EFS, FSx, AWS Backup:** File storage and centralized backup.[web:2][web:7]
- **Redshift, Kinesis, Glue, Athena:** Analytics workloads where they appear in scenario questions.[web:2][web:7]
- **CloudWatch, CloudTrail, Config, Security Hub, GuardDuty:** Observability and security posture.

---

## How to use this guide

- Use each domain section as a checklist: ensure you can describe each service, its key features, and common exam scenarios out loud.
- Map services to Well-Architected pillars: understand why a solution is more secure, more resilient, or more cost-effective.
- Combine this guide with the official exam guide, hands-on labs, and multiple sets of practice questions to solidify your understanding before the exam.[web:2][web:10]
