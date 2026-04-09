# AWS SAA-C03 Ultimate Study Guide

> **AWS Certified Solutions Architect - Associate (SAA-C03)**
> Sourced from the official AWS Exam Guide v1.1, AWS documentation, and exam-prep best practices.

---

## Exam Overview

| Detail        | Value                                                          |
| ------------- | -------------------------------------------------------------- |
| Questions     | 65 total (50 scored + 15 unscored)                             |
| Format        | Multiple choice (1 correct) and multiple response (2+ correct) |
| Time          | 130 minutes                                                    |
| Cost          | $150 USD                                                       |
| Passing Score | 720 / 1000 (scaled)                                            |
| Validity      | 3 years                                                        |
| Prerequisites | 1+ year hands-on experience (recommended)                      |

### Domain Weightings

| Domain | Topic                                | Weight  |
| ------ | ------------------------------------ | ------- |
| **1**  | Design Secure Architectures          | **30%** |
| **2**  | Design Resilient Architectures       | **26%** |
| **3**  | Design High-Performing Architectures | **24%** |
| **4**  | Design Cost-Optimized Architectures  | **20%** |

> Domain 1 (Security) alone is 30% — nearly a third of the exam. Master IAM, VPC security, and encryption before anything else.

---

# Domain 1: Design Secure Architectures (30%)

## Task 1.1 — Design Secure Access to AWS Resources

### IAM (Identity and Access Management)

**Core Principle: Least Privilege** — grant only the permissions needed for a task.

**IAM Policy Types:**

| Type                            | Attached To                            | Example                                            |
| ------------------------------- | -------------------------------------- | -------------------------------------------------- |
| Identity-based                  | IAM users, groups, roles               | `s3:GetObject` on `*`                              |
| Resource-based                  | AWS resources (S3 buckets, SQS queues) | Bucket policy allowing cross-account access        |
| Permission boundaries           | IAM entities (advanced)                | Sets maximum permissions a role/user can ever have |
| SCPs (Service Control Policies) | AWS Organizations OUs/accounts         | Guardrails that restrict available services        |

**IAM Roles vs Users:**

|                       | IAM User                    | IAM Role                                               |
| --------------------- | --------------------------- | ------------------------------------------------------ |
| Permanent credentials | Yes (access keys, password) | No (temporary via STS)                                 |
| Best for              | Long-term human identities  | EC2 instances, Lambda, cross-account, temporary access |
| Credential rotation   | Manual                      | Automatic (STS)                                        |

**Multi-Account Strategy:**

- **AWS Organizations** — management account + member accounts, organized into OUs
- **SCPs** — set maximum permission boundaries for OUs/accounts
- **AWS Control Tower** — landing zone with guardrails, best-practice multi-account setup
- **AWS RAM (Resource Access Manager)** — share resources across accounts

**Cross-Account Access:**

1. Create a role in Account B with a trust policy trusting Account A
2. User in Account A calls `AssumeRole` (STS) to get temporary credentials for Account B
3. No long-term credentials shared between accounts

**Federation:**

- **SAML 2.0** — federate with corporate directory (Active Directory, Okta)
- **Cognito** — federate with social providers (Google, Facebook, Amazon)
- **IAM Identity Center (SSO)** — centralized access management for multiple accounts

**Key Exam Points:**

- Root user: never use for daily tasks. Enable MFA, delete access keys.
- IAM groups cannot be nested (no groups within groups).
- IAM roles for EC2: use instance profiles, never embed access keys in code.
- Policy evaluation: explicit deny always wins, even over explicit allow.

---

## Task 1.2 — Design Secure Workloads and Applications

### VPC Security: Security Groups vs NACLs

| Feature           | Security Group                       | Network ACL (NACL)                             |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| **Operates at**   | Instance level (ENI)                 | Subnet level                                   |
| **Stateful**      | Yes (return traffic auto-allowed)    | No (must allow both directions)                |
| **Rules**         | Allow only                           | Allow AND deny                                 |
| **Evaluation**    | All rules evaluated together         | By rule number (lowest first)                  |
| **Default**       | Deny all inbound, allow all outbound | Default NACL: allow all; Custom NACL: deny all |
| **Can reference** | Other security groups as source      | CIDR blocks only                               |

> **Exam Tip:** "Stateful" means if you allow inbound on port 80, the response outbound is automatically allowed. NACLs don't do this — you must add explicit outbound rules.

### VPC Architecture for Security

```
Internet --> IGW --> Public Subnet (ALB, Bastion)
                          |
                    NAT Gateway
                          |
                    Private Subnet (App servers, RDS)
                          |
                    VPC Endpoint (for AWS service access without internet)
```

**Key VPC Security Components:**

- **Public Subnet** — has route to Internet Gateway (IGW)
- **Private Subnet** — no direct internet route; uses NAT Gateway for outbound
- **NAT Gateway** — managed, scales automatically, per-AZ; preferred over NAT Instance
- **VPC Endpoints:**

| Type                   | Services                            | Cost                     |
| ---------------------- | ----------------------------------- | ------------------------ |
| **Gateway Endpoint**   | S3, DynamoDB only                   | Free                     |
| **Interface Endpoint** | Most AWS services (via PrivateLink) | $/hour + data processing |

> **Exam Tip:** Use Gateway Endpoints for S3/DynamoDB (free). Use Interface Endpoints for everything else (e.g., SQS, SSM, API Gateway). VPC endpoints keep traffic off the public internet and avoid NAT Gateway charges.

### Application Security Services

| Service                 | Purpose                                | When to Use                                               |
| ----------------------- | -------------------------------------- | --------------------------------------------------------- |
| **AWS WAF**             | L7 firewall (web apps)                 | Block SQL injection, XSS, rate-based rules                |
| **AWS Shield Standard** | L3/L4 DDoS protection                  | Free, automatic for all AWS customers                     |
| **AWS Shield Advanced** | Enhanced DDoS + AWS DDoS response team | $3,000/month, for critical apps                           |
| **GuardDuty**           | Threat detection (ML-based)            | Detects compromised instances, unusual API calls          |
| **Amazon Inspector**    | Vulnerability scanning                 | Scan EC2 instances and container images for CVEs          |
| **Amazon Macie**        | PII/data discovery                     | Uses ML to find sensitive data in S3                      |
| **Amazon Cognito**      | User identity for apps                 | User pools (sign-up/sign-in) + Identity pools (AWS creds) |

### Secrets Management

| Feature                | Secrets Manager                | SSM Parameter Store                        |
| ---------------------- | ------------------------------ | ------------------------------------------ |
| **Automatic rotation** | Yes (built-in for RDS, etc.)   | Manual (via Lambda)                        |
| **Cross-account**      | Yes                            | Limited                                    |
| **Cost**               | $0.40/secret/month             | Free tier available                        |
| **Best for**           | Database credentials, API keys | Simple config values, non-sensitive params |

> **Exam Tip:** If the question mentions "automatic rotation of database credentials" → **Secrets Manager**. If it mentions "configuration parameters" or "cost-sensitive" → **Parameter Store**.

### Secure Connectivity

| Method               | Use Case                                            | Encryption                       |
| -------------------- | --------------------------------------------------- | -------------------------------- |
| **Site-to-Site VPN** | Quick setup, encrypted tunnel over internet         | IPsec                            |
| **Direct Connect**   | Consistent low-latency, high-bandwidth              | Optional (MACsec or VPN overlay) |
| **Client VPN**       | Remote user access to VPC                           | TLS                              |
| **VPC Peering**      | Connect two VPCs (same or different account/region) | Encrypted by default             |

> **Exam Tip:** Direct Connect does NOT encrypt traffic by default. Add a VPN over Direct Connect for encryption requirements.

---

## Task 1.3 — Determine Appropriate Data Security Controls

### Encryption at Rest

**S3 Server-Side Encryption:**

| Type         | Key Manager             | Use Case                                           |
| ------------ | ----------------------- | -------------------------------------------------- |
| **SSE-S3**   | AWS manages keys        | Default encryption, no audit trail for key usage   |
| **SSE-KMS**  | You manage keys via KMS | Audit trail (CloudTrail), granular key policies    |
| **SSE-C**    | You provide the key     | You manage keys entirely; AWS uses them on request |
| **DSSE-KMS** | Dual-layer KMS          | Additional layer of encryption compliance          |

**KMS (Key Management Service):**

| Key Type                  | Management                    | Rotation                     | Cost                 |
| ------------------------- | ----------------------------- | ---------------------------- | -------------------- |
| **AWS Owned Keys**        | AWS manages fully             | Automatic                    | Free                 |
| **AWS Managed Keys**      | AWS manages (one per service) | Automatic (annual)           | $1/month             |
| **Customer Managed Keys** | You create, manage, rotate    | Manual or automatic (annual) | $1/month + API calls |

**Envelope Encryption:** KMS generates a data key → data key encrypts your data → KMS key encrypts the data key → store encrypted data key alongside encrypted data.

**EBS Encryption:**

- Encrypt at creation time only — cannot change after
- Snapshots from encrypted volumes are encrypted
- Snapshots from unencrypted volumes can be encrypted on copy
- Default encryption can be enabled at account level

**RDS Encryption:**

- Must be enabled at creation time
- Uses KMS for encryption
- Automated backups, snapshots, and read replicas inherit encryption
- To encrypt an existing unencrypted RDS: snapshot → copy with encryption → restore

### Encryption in Transit

- **TLS/SSL** — standard for HTTPS, API calls
- **ACM (AWS Certificate Manager)** — provisions, manages, deploys TLS certificates
- **S3** — enforce via bucket policy denying non-HTTPS requests
- **VPC** — security groups can restrict traffic, but encryption is application-level

### Data Protection

| Control                    | Service                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| **S3 Object Lock**         | WORM (Write Once Read Many) — compliance mode or governance mode |
| **S3 Versioning**          | Protects against accidental deletes (with MFA Delete)            |
| **S3 Block Public Access** | Account-level guardrail preventing public access                 |
| **AWS Backup**             | Centralized, policy-based backup across services                 |
| **Macie**                  | Discover and protect PII in S3                                   |
| **AWS Config**             | Track resource configuration changes for compliance              |

> **Exam Tip:** "Compliance requirement to prevent object deletion for 7 years" → **S3 Object Lock (Compliance mode)**. "Accidental deletion protection" → **Versioning + MFA Delete**.

---

# Domain 2: Design Resilient Architectures (26%)

## Task 2.1 — Design Scalable and Loosely Coupled Architectures

### Decoupling Patterns

**SQS (Simple Queue Service) — Point-to-Point:**

| Feature        | Standard Queue           | FIFO Queue                                  |
| -------------- | ------------------------ | ------------------------------------------- |
| **Ordering**   | Best-effort              | Guaranteed (First-In-First-Out)             |
| **Throughput** | Nearly unlimited         | 300 messages/sec (with batching: 3,000/sec) |
| **Duplicates** | At-least-once (possible) | Exactly-once                                |
| **Use case**   | Decoupling, buffering    | Order processing, banking transactions      |

- **Visibility Timeout** — hides message from other consumers while being processed (default: 30s, max: 12h)
- **Dead Letter Queue (DLQ)** — receives messages that fail processing after max receive count
- **Long Polling** — reduces API calls; set `ReceiveMessageWaitTimeSeconds > 0`

**SNS (Simple Notification Service) — Pub/Sub:**

- Fanout pattern: one message → multiple subscribers (SQS queues, Lambda, HTTP, email)
- SNS FIFO topics available (with SQS FIFO queues as subscribers)
- Message filtering: subscribers can filter by message attributes

**EventBridge — Event Bus:**

- Serverless event bus connecting AWS services, SaaS, and custom apps
- Schema registry, content-based filtering, archive and replay
- Default event bus (AWS services) + custom event buses

> **Exam Tip:** "Decouple two components" → **SQS**. "Fanout to multiple consumers" → **SNS**. "Event-driven with filtering/replay" → **EventBridge**.

### Compute for Scalability

**Auto Scaling Groups (ASG):**

| Scaling Type        | Trigger                                    | Use Case                                     |
| ------------------- | ------------------------------------------ | -------------------------------------------- |
| **Target Tracking** | Maintains metric at target (e.g., 50% CPU) | Most common, simplest                        |
| **Step Scaling**    | Adds/removes instances based on thresholds | Multiple thresholds with different actions   |
| **Simple Scaling**  | Single threshold with cooldown             | Legacy, less common                          |
| **Predictive**      | ML-based forecasting of load patterns      | Scheduled capacity ahead of predicted demand |

**EC2 Placement Groups:**

| Type          | Purpose                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------- |
| **Cluster**   | Low latency, high throughput (HPC). Same rack. Risk: simultaneous failure.                |
| **Spread**    | Isolate critical instances. Max 7 instances per group per AZ.                             |
| **Partition** | Large distributed systems (Hadoop, Cassandra). Divides instances into logical partitions. |

**Containers vs Serverless:**

|                 | ECS/EKS on EC2             | ECS/EKS on Fargate            | Lambda                    |
| --------------- | -------------------------- | ----------------------------- | ------------------------- |
| **Management**  | You manage instances       | No instance management        | No infrastructure         |
| **Max timeout** | Unlimited                  | Unlimited                     | 15 minutes                |
| **Best for**    | Long-running, full control | Containers without management | Event-driven, short tasks |

### Workflow Orchestration

- **AWS Step Functions** — coordinate multiple AWS services into serverless workflows
  - Standard Workflows: long-running, exactly-once execution
  - Express Workflows: high-throughput, at-least-once (for event streaming)
- **Amazon MQ** — managed ActiveMQ/RabbitMQ for migrating from on-premises messaging

---

## Task 2.2 — Design Highly Available and/or Fault-Tolerant Architectures

### Load Balancers

| Feature       | ALB (L7)                        | NLB (L4)               | GWLB                   |
| ------------- | ------------------------------- | ---------------------- | ---------------------- |
| **Protocols** | HTTP/HTTPS, gRPC, WebSocket     | TCP/UDP/TLS            | IP (GENEVE)            |
| **Routing**   | Path-based, host-based, headers | Target IP/port         | Transparent to apps    |
| **Targets**   | EC2, ECS, Lambda, IP            | EC2, IP, ALB           | Appliances (firewalls) |
| **Latency**   | Higher                          | Ultra-low              | N/A                    |
| **Static IP** | No (uses DNS)                   | Yes (per AZ)           | Yes                    |
| **Use case**  | Web apps, microservices         | Gaming, IoT, real-time | Network inspection     |

> **Exam Tip:** "Route based on URL path" → **ALB**. "Ultra-low latency" or "static IP" → **NLB**. "Route traffic through firewall appliances" → **GWLB**.

### Multi-AZ and Multi-Region Patterns

**RDS High Availability:**

| Feature                | Multi-AZ                     | Read Replica                         |
| ---------------------- | ---------------------------- | ------------------------------------ |
| **Replication**        | Synchronous                  | Asynchronous                         |
| **Purpose**            | High availability (failover) | Read scaling                         |
| **Cross-region**       | No (same region)             | Yes                                  |
| **Automatic failover** | Yes                          | No (promote manually or with Aurora) |
| **RPO**                | ~0                           | Seconds to minutes                   |
| **RTO**                | 1-2 minutes                  | Minutes (promotion time)             |

**Aurora:** 6 copies across 3 AZs, up to 15 read replicas, automatic failover in <30 seconds.
**Aurora Global Database:** async replication across regions, RPO ~1 second, detached head for DR.

**DynamoDB:** Built-in across 3 AZs. **Global Tables** for multi-region, multi-master replication (RPO ~0, RTO ~near-zero).

### Disaster Recovery Strategies

| Strategy                       | RPO             | RTO       | Cost     | Description                                                     |
| ------------------------------ | --------------- | --------- | -------- | --------------------------------------------------------------- |
| **Backup & Restore**           | Hours           | Hours     | Low      | Back up to S3, restore when needed                              |
| **Pilot Light**                | Minutes         | Minutes   | Low-Med  | Core (DB replica) always running; spin up rest during disaster  |
| **Warm Standby**               | Seconds-Minutes | Minutes   | Med-High | Scaled-down full stack always running; scale up during disaster |
| **Multi-Site (Active-Active)** | Near-zero       | Near-zero | High     | Full stack in multiple regions; traffic split                   |

**Key DR Services:**

| Service                                 | Role                                                  |
| --------------------------------------- | ----------------------------------------------------- |
| **AWS Elastic Disaster Recovery (DRS)** | Continuous block-level replication to staging area    |
| **AWS Backup**                          | Centralized backup policies across services           |
| **Route 53**                            | DNS failover, health checks, latency-based routing    |
| **CloudFormation**                      | IaC — rapidly reprovision infrastructure in DR region |

> **Exam Tip:** "Minimize RPO with lowest cost" → **Pilot Light**. "Near-zero RPO/RTO regardless of cost" → **Multi-Site Active-Active** or **DynamoDB Global Tables**.

### Route 53 Routing Policies

| Policy          | Use Case                                             |
| --------------- | ---------------------------------------------------- |
| **Simple**      | Single resource, no health checks                    |
| **Failover**    | Active-passive DR (primary + standby)                |
| **Latency**     | Route to fastest region for the user                 |
| **Weighted**    | Split traffic by percentage (canary deployments)     |
| **Geolocation** | Route based on user's geographic location            |
| **Multi-value** | Return multiple healthy IPs (simple health checking) |

---

# Domain 3: Design High-Performing Architectures (24%)

## Task 3.1 — Determine High-Performing Storage Solutions

### EBS Volume Types

| Volume                | Type | Max IOPS | Max Throughput | Use Case                                  |
| --------------------- | ---- | -------- | -------------- | ----------------------------------------- |
| **gp3**               | SSD  | 16,000   | 1,000 MB/s     | General purpose (default, cost-effective) |
| **io2 Block Express** | SSD  | 256,000  | 4,000 MB/s     | Critical business apps, databases         |
| **st1**               | HDD  | 500      | 500 MB/s       | Big data, sequential reads                |
| **sc1**               | HDD  | 250      | 250 MB/s       | Cold data, infrequent access              |

> **Exam Tip:** `gp3` is the default and most cost-effective SSD. `io2` for highest performance. `st1`/`sc1` for throughput-oriented, cost-sensitive workloads.

### S3 Performance

- **Baseline:** 3,500 PUT/COPY/POST/DELETE and 5,500 GET requests per second per prefix
- **Scale horizontally:** Use multiple prefixes for higher aggregate throughput
- **S3 Transfer Acceleration:** Uses CloudFront edge locations for fast long-distance uploads
- **Multipart Upload:** For files >100MB; required for files >5GB
- **S3 Byte-Range Fetches:** Parallelize downloads of large objects

### EFS (Elastic File System)

| Mode                       | Description                                                                     |
| -------------------------- | ------------------------------------------------------------------------------- |
| **Bursting Throughput**    | Default; throughput scales with storage size                                    |
| **Provisioned Throughput** | Fixed throughput regardless of storage (for low-storage, high-throughput needs) |
| **Regional**               | Multi-AZ redundancy (default)                                                   |
| **One Zone**               | Single AZ, lower cost                                                           |

### FSx File Systems

| Type                     | Protocol        | Use Case                                           |
| ------------------------ | --------------- | -------------------------------------------------- |
| **FSx for Windows**      | SMB, NTFS       | Windows applications, Active Directory integration |
| **FSx for Lustre**       | POSIX           | HPC, machine learning, integrated with S3          |
| **FSx for NetApp ONTAP** | NFS, SMB, iSCSI | Multi-protocol, enterprise migration               |
| **FSx for OpenZFS**      | NFS             | ZFS features, RAID-Z, snapshots                    |

### Instance Store

- Ephemeral (data lost on stop/termination)
- Physically attached to host — lowest latency
- Best for: temporary data, buffers, caches, scratch data

---

## Task 3.2 — Design High-Performing Compute Solutions

### EC2 Instance Families

| Family             | Optimized For              | Examples                                  |
| ------------------ | -------------------------- | ----------------------------------------- |
| **M**              | General purpose (balanced) | Web servers, app servers                  |
| **C**              | Compute                    | Batch processing, HPC, gaming             |
| **R / X**          | Memory                     | In-memory databases, big data analytics   |
| **I / D**          | Storage                    | NoSQL, data warehousing, Hadoop           |
| **P / G**          | GPU                        | ML training, video encoding, graphics     |
| **T**              | Burstable                  | Development, low-traffic web servers      |
| **Graviton (ARM)** | Price-performance          | Up to 40% better price-performance vs x86 |

### Lambda Performance

| Aspect                      | Detail                                                                    |
| --------------------------- | ------------------------------------------------------------------------- |
| **Memory**                  | 128 MB to 10,240 MB (10 GB)                                               |
| **vCPU**                    | Scales with memory (1 vCPU at ~1,769 MB)                                  |
| **Timeout**                 | 15 minutes max                                                            |
| **Cold Start**              | Initial invocation latency; mitigated by Provisioned Concurrency          |
| **Provisioned Concurrency** | Pre-initialized instances, eliminates cold starts, additional cost        |
| **Execution Context**       | Reused across invocations — use for caching (DB connections, SDK clients) |

### Auto Scaling for Performance

- **Target Tracking:** "Keep CPU at 50%" — simplest, most common
- **Step Scaling:** "If CPU > 70%, add 2; if > 90%, add 5" — more granular
- **Predictive Scaling:** Uses ML to predict load patterns and pre-scale
- **Scale-out cooldown:** Prevents rapid over-scaling (default: 300 seconds)

---

## Task 3.3 — Determine High-Performing Database Solutions

### Database Selection Matrix

| Need                           | Service               | Why                                                          |
| ------------------------------ | --------------------- | ------------------------------------------------------------ |
| Relational, traditional        | **RDS**               | Managed MySQL, PostgreSQL, SQL Server, Oracle                |
| High-performance relational    | **Aurora**            | 5x faster MySQL, 3x faster PostgreSQL; 6 copies across 3 AZs |
| Variable/unpredictable load    | **Aurora Serverless** | Auto-scales capacity up/down                                 |
| Key-value, massive scale       | **DynamoDB**          | Single-digit ms latency at any scale                         |
| In-memory caching              | **ElastiCache**       | Redis or Memcached; sub-ms latency                           |
| Data warehousing               | **Redshift**          | Columnar, petabyte-scale analytics                           |
| Graph database                 | **Neptune**           | Social networking, fraud detection                           |
| Document (MongoDB compat)      | **DocumentDB**        | MongoDB-compatible, managed                                  |
| Wide-column (Cassandra compat) | **Keyspaces**         | Managed Apache Cassandra                                     |

### DynamoDB Performance

| Capacity Mode   | Description             | Use Case                                    |
| --------------- | ----------------------- | ------------------------------------------- |
| **Provisioned** | Set RCUs/WCUs per table | Predictable workloads, cost optimization    |
| **On-Demand**   | Pay per request         | Unpredictable traffic, no capacity planning |

- **RCU (Read Capacity Unit):** 1 strongly consistent read/sec (up to 4KB) or 2 eventually consistent reads/sec
- **WCU (Write Capacity Unit):** 1 write/sec (up to 1KB)
- **DAX (DynamoDB Accelerator):** In-memory cache, reduces response times from ms to microseconds
- **Partition Key Design:** Distribute evenly to avoid hot partitions; use composite keys (partition + sort key)
- **Adaptive Capacity:** Automatically adjusts for uneven access patterns
- **Global Secondary Index (GSI):** Query on non-key attributes

### ElastiCache: Redis vs Memcached

| Feature         | Redis                                            | Memcached             |
| --------------- | ------------------------------------------------ | --------------------- |
| **Multi-AZ**    | Yes (replication)                                | No                    |
| **Persistence** | Yes                                              | No                    |
| **Data types**  | Strings, lists, sets, sorted sets, hashes        | Strings only          |
| **Pub/Sub**     | Yes                                              | No                    |
| **Use case**    | Caching + session store + ranking + leaderboards | Simple object caching |

### Caching Strategies

| Strategy                       | How It Works                                                    |
| ------------------------------ | --------------------------------------------------------------- |
| **Lazy Loading (Cache-Aside)** | App checks cache first; if miss, reads from DB, writes to cache |
| **Write-Through**              | App writes to cache and DB simultaneously; cache always fresh   |
| **TTL (Time-to-Live)**         | Auto-expire cached items to prevent stale data                  |

---

## Task 3.4 — Determine High-Performing Network Architectures

### CloudFront (CDN)

- **Edge Locations** — 600+ globally for low-latency content delivery
- **Lambda@Edge** — Run Lambda functions at edge locations (modify requests/responses)
- **Origin Failover** — Automatic failover to a secondary origin
- **Field-Level Encryption** — Encrypt specific fields at the edge
- **Signed URLs / Signed Cookies** — Restrict access to premium content

### Global Accelerator

- Uses AWS global network backbone to route traffic optimally
- Provides static anycast IPs
- Improves performance for non-HTTP use cases (gaming, IoT, custom protocols)
- Automatic failover across endpoints

> **Exam Tip:** HTTP/HTTPS content → **CloudFront**. Non-HTTP (TCP/UDP), need static IPs, or global routing → **Global Accelerator**.

### VPC Endpoints & PrivateLink

- **Gateway Endpoint:** S3 and DynamoDB — free, route-table based
- **Interface Endpoint (PrivateLink):** Creates ENI in your VPC for private access to AWS services
- **Endpoint Services:** Expose your own service privately to other VPCs/accounts

---

## Task 3.5 — Determine High-Performing Data Ingestation and Transformation Solutions

### Data Streaming

| Service                               | Purpose                                                   |
| ------------------------------------- | --------------------------------------------------------- |
| **Kinesis Data Streams**              | Real-time data streaming (shards, consumers)              |
| **Kinesis Data Firehose**             | Load streaming data into S3/Redshift/OpenSearch (no code) |
| **Kinesis Data Analytics**            | Real-time SQL processing on streams                       |
| **MSK (Managed Streaming for Kafka)** | Fully managed Apache Kafka                                |

### Data Processing

| Service                | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| **AWS Glue**           | Serverless ETL, Data Catalog, crawlers, job bookmarks |
| **Amazon EMR**         | Big data processing (Spark, Hadoop, Hive, Presto)     |
| **Amazon Athena**      | Serverless SQL queries directly on S3 data            |
| **AWS Lake Formation** | Set up secure data lakes in days                      |

### Data Visualization

- **Amazon QuickSight** — serverless BI dashboards, ML-powered insights

### Data Transfer Services

| Service                 | Use Case                                                                   |
| ----------------------- | -------------------------------------------------------------------------- |
| **AWS DataSync**        | Automated data transfer between on-premises and AWS                        |
| **AWS Storage Gateway** | Hybrid storage (file, volume, tape)                                        |
| **AWS Transfer Family** | Managed file transfer (SFTP, FTPS, FTP)                                    |
| **AWS Snow Family**     | Physical data transfer for petabyte-scale (Snowcone, Snowball, Snowmobile) |

> **Exam Tip:** "Ongoing sync between on-premises and AWS" → **DataSync**. "One-time migration of 50TB" → **Snowball Edge**. "SFTP access to S3" → **Transfer Family**.

---

# Domain 4: Design Cost-Optimized Architectures (20%)

## Task 4.1 — Design Cost-Optimized Storage Solutions

### S3 Storage Classes

| Class                    | Availability      | Access                              | Cost                            | Use Case                             |
| ------------------------ | ----------------- | ----------------------------------- | ------------------------------- | ------------------------------------ |
| **Standard**             | 99.99%            | Frequent                            | Base price                      | Active data, websites                |
| **Standard-IA**          | 99.9%             | Infrequent (min 30 days, min 128KB) | Lower storage, higher retrieval | Long-lived, infrequent access        |
| **One Zone-IA**          | 99.5% (single AZ) | Infrequent                          | Lowest storage cost             | Re-creatable data, secondary backups |
| **Intelligent-Tiering**  | 99.9%             | Auto-monitored                      | Small monitoring fee            | Unpredictable access patterns        |
| **Glacier Instant**      | 99.9%             | Millisecond retrieval               | Low                             | Archival with immediate access needs |
| **Glacier Flexible**     | 99.99%            | Minutes to hours                    | Very low                        | Archival, occasional retrieval       |
| **Glacier Deep Archive** | 99.99%            | 12-48 hours                         | Lowest                          | Long-term retention (7-10 years)     |

### S3 Lifecycle Policies

- **Transition Rules:** Move objects between storage classes automatically
  - Standard → Standard-IA (minimum 30 days)
  - Standard-IA → Glacier Instant Retrieval
  - Glacier Instant → Glacier Flexible → Deep Archive
- **Expiration Rules:** Delete objects after a defined period
- **Intelligent-Tiering:** AWS auto-moves objects based on access patterns (no lifecycle rules needed)

> **Exam Tip:** "Unpredictable access patterns" → **S3 Intelligent-Tiering**. "Archive after 90 days, retrieve within hours" → **S3 Lifecycle to Glacier Flexible**. "Lowest cost archival, retrieval in a day" → **Deep Archive**.

### EBS Cost Optimization

- Use **gp3** over gp2 — better baseline performance at lower cost
- Right-size volumes based on actual usage (CloudWatch metrics)
- Delete unused snapshots
- Use **snapshot lifecycle policies** via AWS Backup or Data Lifecycle Manager

---

## Task 4.2 — Design Cost-Optimized Compute Solutions

### EC2 Purchasing Options

| Option                               | Discount  | Commitment                        | Best For                                |
| ------------------------------------ | --------- | --------------------------------- | --------------------------------------- |
| **On-Demand**                        | None      | None                              | Short-term, unpredictable, testing      |
| **Reserved Instances (Standard)**    | Up to 72% | 1 or 3 year                       | Steady-state workloads                  |
| **Reserved Instances (Convertible)** | Up to 54% | 1 or 3 year                       | Workloads that may change instance type |
| **Spot Instances**                   | Up to 90% | None (2-min interruption warning) | Fault-tolerant, batch, flexible         |
| **Savings Plans (Compute)**          | Up to 66% | 1 or 3 year ($/hour commitment)   | Flexible across EC2, Fargate, Lambda    |
| **Savings Plans (EC2 Instance)**     | Up to 72% | 1 or 3 year                       | Specific instance family in a region    |

### Reserved Instances vs Savings Plans

|                 | Reserved Instances                                             | Savings Plans                                                  |
| --------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| **Scope**       | Specific instance type + AZ (Standard) or family (Convertible) | Compute: any EC2/Fargate/Lambda; EC2 Instance: specific family |
| **Flexibility** | Low (Standard), Medium (Convertible)                           | High (Compute), Medium (EC2 Instance)                          |
| **Billing**     | Fixed hourly rate regardless of usage                          | Commit $/hour; any usage beyond commitment is On-Demand        |
| **Best for**    | Known, stable workloads with specific instance needs           | Broad commitment across services                               |

> **Exam Tip:** "Most flexible cost savings across EC2, Lambda, Fargate" → **Compute Savings Plans**. "Maximum discount for a specific steady-state EC2 workload" → **Standard Reserved Instances or EC2 Instance Savings Plans**. "Batch processing, can tolerate interruption" → **Spot Instances**.

### Serverless for Cost Optimization

- **Lambda** — pay per invocation + compute time; no idle costs
- **Fargate** — pay per vCPU and memory second; no EC2 instance management
- Use for variable or sporadic workloads to avoid paying for idle capacity

---

## Task 4.3 — Design Cost-Optimized Database Solutions

### Database Cost Comparison

| Scenario                          | Best Choice                                  | Why                                       |
| --------------------------------- | -------------------------------------------- | ----------------------------------------- |
| Unpredictable read/write patterns | **DynamoDB On-Demand**                       | Pay per request, no capacity planning     |
| Steady, predictable load          | **DynamoDB Provisioned** or **RDS Reserved** | Lower per-request cost                    |
| Variable relational workload      | **Aurora Serverless**                        | Auto-scales, pay only for active capacity |
| Read-heavy relational             | **RDS + Read Replicas**                      | Offload reads, avoid scaling up primary   |
| Repeated queries                  | **ElastiCache**                              | Cache results, reduce DB load and cost    |

### Database Cost Strategies

- **Right-size instances:** Use Compute Optimizer recommendations
- **Use read replicas** instead of scaling up for read-heavy workloads
- **ElastiCache** to reduce database query load
- **Reserved Instances** for RDS steady-state workloads (up to 63% savings)
- **Aurora Serverless** for intermittent workloads (scales to zero)
- **Snapshot lifecycle:** Delete old snapshots per retention policy

---

## Task 4.4 — Design Cost-Optimized Network Architectures

### Network Cost Optimization Strategies

| Strategy                        | Savings                                     | How                                                |
| ------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| **VPC Endpoints**               | Avoid NAT Gateway data charges              | Private path to S3, DynamoDB (Gateway = free)      |
| **CloudFront**                  | Reduce data transfer costs                  | Edge caching reduces origin requests               |
| **Direct Connect**              | Reduced egress vs internet                  | Lower per-GB data transfer rate                    |
| **NAT Instance vs NAT Gateway** | NAT Instance can be cheaper for low traffic | But NAT Gateway is managed and auto-scales         |
| **Single shared NAT Gateway**   | Fewer gateways = lower hourly cost          | Route multiple AZs to one NAT (trades HA for cost) |
| **VPC Peering**                 | Free (same region)                          | Direct VPC-to-VPC connectivity                     |
| **Transit Gateway**             | Cheaper than full mesh peering at scale     | Hub-and-spoke model for many VPCs                  |

### Data Transfer Costs (Key Rules)

| Direction                     | Cost                              |
| ----------------------------- | --------------------------------- |
| **Inbound to AWS**            | Free                              |
| **Between AZs (same region)** | $0.01/GB each direction           |
| **Between Regions**           | $0.02/GB (varies by region)       |
| **Outbound to internet**      | $0.09/GB (first 10TB, varies)     |
| **Via CloudFront**            | Lower than direct internet egress |

> **Exam Tip:** "Minimize data transfer cost between AZs" → **Keep resources in the same AZ** (but trades HA). "Minimize cost accessing S3 from private subnet" → **Gateway VPC Endpoint** (free, no NAT Gateway needed).

---

# Foundational Knowledge

## AWS Well-Architected Framework — 6 Pillars

| Pillar                     | Focus                                         | Key Services                                               |
| -------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| **Operational Excellence** | Run, monitor, improve systems                 | CloudFormation, Systems Manager, CloudTrail, X-Ray         |
| **Security**               | Protect data, systems, assets                 | IAM, KMS, WAF, Shield, GuardDuty, Macie                    |
| **Reliability**            | Consistent performance, recovery from failure | Auto Scaling, Multi-AZ, CloudWatch, Route 53               |
| **Performance Efficiency** | Efficient resource use, right resource types  | Lambda, CloudFront, ElastiCache, RDS read replicas         |
| **Cost Optimization**      | Avoid unnecessary costs                       | Cost Explorer, Budgets, Reserved Instances, Spot           |
| **Sustainability**         | Minimize environmental impact                 | Graviton instances, serverless, S3 lifecycle, right-sizing |

## Shared Responsibility Model

| AWS Responsibility ("OF the Cloud")            | Customer Responsibility ("IN the Cloud")    |
| ---------------------------------------------- | ------------------------------------------- |
| Physical hardware, data centers, networking    | Security groups, NACLs, IAM policies        |
| Hypervisor, physical servers                   | OS patches (on EC2), application security   |
| Managed service infrastructure (RDS, DynamoDB) | Data encryption configuration               |
| Global infrastructure (Regions, AZs)           | Customer data classification and protection |

**Key Nuances:**

- **EC2:** Customer patches OS, manages security groups, configures app security
- **RDS:** AWS patches OS and DB engine; customer manages access, encryption settings, data
- **S3:** AWS manages infrastructure; customer manages bucket policies, encryption, access control
- **Lambda:** AWS manages everything; customer manages function code, IAM execution role, VPC config

---

# Quick Reference Tables

## SQS vs SNS vs Kinesis vs EventBridge

| Feature       | SQS            | SNS           | Kinesis       | EventBridge   |
| ------------- | -------------- | ------------- | ------------- | ------------- |
| **Pattern**   | Point-to-point | Pub/sub       | Streaming     | Event bus     |
| **Consumers** | 1 per message  | Many (fanout) | Many (shards) | Many (rules)  |
| **Retention** | 15 days        | No retention  | 365 days      | Configurable  |
| **Ordering**  | FIFO option    | FIFO option   | Per shard     | Per rule      |
| **Replay**    | No             | No            | Yes           | Yes (archive) |

## Reserved Instances vs Savings Plans vs Spot

|                  | Reserved Instances | Savings Plans    | Spot Instances      |
| ---------------- | ------------------ | ---------------- | ------------------- |
| **Commitment**   | 1 or 3 years       | 1 or 3 years     | None                |
| **Discount**     | Up to 72%          | Up to 66-72%     | Up to 90%           |
| **Interruption** | No                 | No               | Yes (2-min warning) |
| **Flexibility**  | Instance-specific  | Service-flexible | N/A                 |

## DR Strategy Comparison

| Strategy         | RPO     | RTO     | Relative Cost | Complexity |
| ---------------- | ------- | ------- | ------------- | ---------- |
| Backup & Restore | Hours   | Hours   | Low           | Low        |
| Pilot Light      | Minutes | Minutes | Low-Med       | Medium     |
| Warm Standby     | Seconds | Minutes | Med-High      | Medium     |
| Active-Active    | ~Zero   | ~Zero   | High          | High       |

## Load Balancer Comparison

|                  | ALB      | NLB         | CLB (Legacy) | GWLB       |
| ---------------- | -------- | ----------- | ------------ | ---------- |
| **Layer**        | 7 (HTTP) | 4 (TCP/UDP) | 4 & 7        | 3 (GENEVE) |
| **Path routing** | Yes      | No          | No           | No         |
| **WebSocket**    | Yes      | Yes         | No           | No         |
| **gRPC**         | Yes      | No          | No           | No         |
| **Static IP**    | No       | Yes         | No           | Yes        |
| **Latency**      | Standard | Ultra-low   | Standard     | Standard   |

---

# Architecture Patterns for the Exam

## Pattern 1: Serverless Web Application

```
Route 53 --> CloudFront --> S3 (static assets)
                        --> API Gateway --> Lambda --> DynamoDB
                                                    --> ElastiCache (optional)
```

## Pattern 2: Event-Driven Microservices

```
S3 Event --> EventBridge --> Lambda (process)
                        --> SQS (buffer)
                        --> SNS (notify)
Step Functions for complex orchestration
```

## Pattern 3: Decoupled Processing

```
Producer --> SQS (Standard) --> EC2/ECS Consumer (Auto Scaling Group)
                       --> DLQ (for failed messages)
```

## Pattern 4: Data Lake

```
Data Sources --> Kinesis/Glue --> S3 (data lake)
                                    --> Athena (query)
                                    --> Redshift (warehouse)
                                    --> QuickSight (visualize)
Lake Formation for governance
```

## Pattern 5: Multi-Tier Web Application

```
Route 53 --> CloudFront --> ALB (public subnet)
                              --> EC2/ECS (private subnet, Auto Scaling)
                                  --> ElastiCache (caching)
                                  --> RDS/Aurora (private subnet, Multi-AZ)
```

## Pattern 6: Static Website

```
Route 53 --> S3 (static website hosting)
         --> CloudFront (CDN + HTTPS via ACM)
         --> OAC (Origin Access Control)
```

## Pattern 7: Hybrid Connectivity

```
On-Premises --> Direct Connect --> Transit Gateway --> Multiple VPCs
           --> Site-to-Site VPN (backup)
```

---

# Exam Tips and Gotchas

## Top 10 Exam Traps

1. **Security Groups are stateful, NACLs are stateless** — this is tested constantly
2. **NAT Gateway is per-AZ** — for HA, deploy one per AZ (but each costs $32/month)
3. **Gateway Endpoints are free; Interface Endpoints cost money** — use Gateway for S3/DynamoDB
4. **Direct Connect does not encrypt by default** — add VPN over DX for encryption
5. **RDS Multi-AZ is for HA (sync), not read scaling** — use Read Replicas for reads
6. **Lambda max timeout is 15 minutes** — use ECS/Fargate for longer tasks
7. **S3 cross-region replication requires versioning enabled on both buckets**
8. **Spot Instances can be interrupted with 2-minute warning** — never for critical workloads
9. **Aurora Serverless v2 scales to zero capacity? No** — it scales down but not to zero
10. **DynamoDB DAX caches reads, not writes** — it's a read-through/write-through cache

## Answer Selection Strategy

- **Security is always the #1 concern** — when in doubt, choose the most secure option
- **AWS managed services preferred** over self-managed (e.g., RDS over EC2+MySQL)
- **Serverless preferred** over provisioned when the workload fits
- **Least privilege** is always the right IAM answer
- **Most cost-effective** that meets ALL requirements wins
- Eliminate answers with wrong services (e.g., CloudFront for TCP traffic)
- Look for keywords: "minimal operational overhead" → managed/serverless solution

## In-Scope Services (Complete List from Official Exam Guide)

<details>
<summary>Click to expand the full in-scope service list</summary>

**Analytics:** Athena, Data Exchange, Data Pipeline, EMR, Glue, Kinesis, Lake Formation, MSK, OpenSearch, QuickSight, Redshift

**Application Integration:** AppFlow, AppSync, EventBridge, MQ, SNS, SQS, Step Functions

**Cost Management:** Budgets, Cost and Usage Report, Cost Explorer, Savings Plans

**Compute:** Batch, EC2, EC2 Auto Scaling, Elastic Beanstalk, Outposts, Serverless Application Repository, VMware Cloud on AWS, Wavelength

**Containers:** ECS Anywhere, EKS Anywhere, EKS Distro, ECR, ECS, EKS

**Database:** Aurora, Aurora Serverless, DocumentDB, DynamoDB, ElastiCache, Keyspaces, Neptune, QLDB, RDS, Redshift

**Developer Tools:** X-Ray

**Front-End Web and Mobile:** Amplify, API Gateway, Device Farm, Pinpoint

**Machine Learning:** Comprehend, Forecast, Fraud Detector, Kendra, Lex, Polly, Rekognition, SageMaker, Textract, Transcribe, Translate

**Management and Governance:** Auto Scaling, CloudFormation, CloudTrail, CloudWatch, CLI, Compute Optimizer, Config, Control Tower, Health Dashboard, License Manager, Managed Grafana, Managed Service for Prometheus, Management Console, Organizations, Proton, Service Catalog, Systems Manager, Trusted Advisor, Well-Architected Tool

**Media Services:** Elastic Transcoder, Kinesis Video Streams

**Migration and Transfer:** Application Discovery Service, Application Migration Service, DMS, DataSync, Migration Hub, Snow Family, Transfer Family

**Networking:** Client VPN, CloudFront, Direct Connect, ELB, Global Accelerator, PrivateLink, Route 53, Site-to-Site VPN, Transit Gateway, VPC

**Security:** Artifact, Audit Manager, ACM, CloudHSM, Cognito, Detective, Directory Service, Firewall Manager, GuardDuty, IAM Identity Center, IAM, Inspector, KMS, Macie, Network Firewall, RAM, Secrets Manager, Security Hub, Shield, WAF

**Serverless:** AppSync, Fargate, Lambda

**Storage:** Backup, EBS, EFS, FSx (all types), S3, S3 Glacier, Storage Gateway

</details>

## Out-of-Scope (Do NOT Study)

Lightsail, IoT services, GameLift, Sumerian, Managed Blockchain, CodeBuild/CodeCommit/CodeDeploy, CDK, Cloud9, OpsWorks, all Deep Learning AMIs/containers, Panorama, Braket, RoboMaker, and more — see the official exam guide for the complete list.

---

> **Sources:**
> 
> - [AWS Certified Solutions Architect - Associate](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
> - [Official SAA-C03 Exam Guide v1.1 (PDF)](https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf)
> - [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
