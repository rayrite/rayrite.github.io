# AWS Solutions Architect Associate (SAA-C03) Certification Study Guide

A comprehensive study guide covering all four official exam domains with essential services, concepts, and exam-focused content.

---

## Table of Contents

1. [Exam Overview](#exam-overview)
2. [Domain 1: Design Secure Architectures (30%)](#domain-1-design-secure-architectures-30)
3. [Domain 2: Design Resilient Architectures (26%)](#domain-2-design-resilient-architectures-26)
4. [Domain 3: Design High-Performing Architectures (24%)](#domain-3-design-high-performing-architectures-24)
5. [Domain 4: Design Cost-Optimized Architectures (20%)](#domain-4-design-cost-optimized-architectures-20)
6. [VPC Fundamentals](#vpc-fundamentals)
7. [Container Services](#container-services)
8. [Serverless Architecture](#serverless-architecture)
9. [Storage Services Comparison](#storage-services-comparison)
10. [Database Services Comparison](#database-services-comparison)
11. [Migration Services](#migration-services)
12. [Monitoring and Logging](#monitoring-and-logging)
13. [Common Architectural Patterns](#common-architectural-patterns)
14. [Quick Reference Tables](#quick-reference-tables)

---

## Exam Overview

### Exam Details
- **Exam Code:** SAA-C03
- **Format:** 65 multiple-choice and multiple-response questions
- **Time:** 130 minutes
- **Passing Score:** 720/1000
- **Cost:** $150 USD
- **Validity:** 3 years

### Domain Weightings
| Domain | Weight | Focus Area |
|--------|--------|------------|
| Domain 1: Design Secure Architectures | 30% | Security, IAM, Encryption |
| Domain 2: Design Resilient Architectures | 26% | High Availability, DR |
| Domain 3: Design High-Performing Architectures | 24% | Performance, Caching |
| Domain 4: Design Cost-Optimized Architectures | 20% | Cost optimization |

### Question Types
- **Scenario-based:** Given a scenario, choose the best solution
- **Fact-based:** Direct knowledge questions
- **Architecture design:** Design or improve architectures
- **Troubleshooting:** Identify and fix issues

---

## Domain 1: Design Secure Architectures (30%)

### IAM (Identity and Access Management)

#### Core Components

**Users**
- Individual entities representing people or applications
- Can have passwords (console access) and/or access keys (API/CLI access)
- Best practice: Use roles instead of long-term access keys

**Groups**
- Collection of IAM users
- Cannot be nested (no groups within groups)
- Used to apply permissions to multiple users at once
- Users can belong to multiple groups

**Roles**
- Temporary credentials with specific permissions
- Used by AWS services, applications, or external users
- No long-term credentials (access keys/passwords)
- **Trust Policy:** Defines who can assume the role
- **Permissions Policy:** Defines what the role can access

**Policies**
- JSON documents defining permissions
- Types:
  - **Managed Policies:** AWS managed or customer managed (reusable)
  - **Inline Policies:** Embedded directly in user/group/role
  - **Service Control Policies (SCP):** For AWS Organizations

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::mybucket/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "10.0.0.0/24"
        }
      }
    }
  ]
}
```

#### Policy Elements
- **Effect:** Allow or Deny
- **Action:** Specific API calls allowed/denied
- **Resource:** ARN of the resource
- **Condition:** Optional conditions for when policy applies
- **Principal:** Who the policy applies to (in resource-based policies)

#### IAM Best Practices
1. **Least Privilege:** Grant minimum necessary permissions
2. **Use Roles:** Instead of sharing credentials, use roles
3. **Enable MFA:** For root account and privileged users
4. **Rotate Credentials:** Regularly rotate access keys
5. **Use Groups:** Organize users and manage permissions
6. **Monitor Activity:** Use CloudTrail to log IAM activity

#### IAM Identity Center (formerly AWS SSO)
- Centralized access management for multiple AWS accounts
- Integrates with external identity providers (Azure AD, Okta, etc.)
- Provides single sign-on access to AWS accounts and applications
- Supports SAML 2.0 identity providers

#### MFA (Multi-Factor Authentication)
- **Virtual MFA:** Software-based (Google Authenticator, Authy)
- **Hardware MFA:** Physical device (YubiKey, Gemalto)
- **U2F Security Keys:** Universal 2nd Factor devices
- **SMS MFA:** Text message (least secure, not recommended)

> **Exam Tip:** Root account should ALWAYS have MFA enabled. Root account should rarely be used.

---

### VPC Security

#### Security Groups
- **Stateful:** Return traffic is automatically allowed
- **Operate at instance level** (ENI level)
- **Only Allow rules** (no Deny rules)
- Can reference other security groups (dynamic)
- Default: Deny all inbound, allow all outbound
- Changes take effect immediately

| Feature | Security Group |
|---------|---------------|
| Level | Instance (ENI) |
| Stateful | Yes |
| Rules | Allow only |
| Default Inbound | Deny all |
| Default Outbound | Allow all |
| Can reference SG | Yes |

#### Network ACLs (NACLs)
- **Stateless:** Must explicitly allow return traffic
- **Operate at subnet level**
- **Both Allow and Deny rules**
- Rules processed in order (lowest number first)
- Default NACL: Allows all traffic
- New custom NACL: Denies all traffic
- Changes take effect immediately

| Feature | NACL |
|---------|------|
| Level | Subnet |
| Stateful | No |
| Rules | Allow and Deny |
| Default | Allow all (default) / Deny all (custom) |
| Rule Order | Processed sequentially |

> **Exam Tip:** Use NACLs for subnet-level blocking (e.g., blocking specific IPs). Use Security Groups for instance-level access control.

#### VPC Endpoints
- **Private connection to AWS services** without internet gateway
- Types:
  - **Gateway Endpoints:** S3 and DynamoDB only (free, route table based)
  - **Interface Endpoints (PrivateLink):** Most AWS services (ENI-based, costs apply)
  - **Gateway Load Balancer Endpoints:** For third-party appliances

| Feature | Gateway Endpoint | Interface Endpoint |
|---------|-----------------|-------------------|
| Services | S3, DynamoDB | Most AWS services |
| Cost | Free | Charged per hour + data |
| Implementation | Route table | ENI in subnet |
| Cross-region | No | Yes |
| On-premises | No | Yes (via Direct Connect/VPN) |

#### VPC Flow Logs
- Capture IP traffic information going to/from network interfaces
- Can be published to CloudWatch Logs or S3
- Levels: VPC, Subnet, or ENI
- **NOT real-time:** 5-15 minute delay
- Does NOT capture:
  - Traffic to/from 169.254.169.254 (instance metadata)
  - DHCP traffic
  - Traffic to reserved IP addresses

---

### Encryption

#### KMS (Key Management Service)
- **Fully managed encryption key service**
- Types of keys:
  - **AWS Managed Keys:** Free, AWS manages rotation (every 1 year)
  - **Customer Managed Keys (CMK):** $1/month, you control rotation
  - **AWS Owned Keys:** Used by AWS services, not visible to you
  - **CloudHSM Keys:** Keys in CloudHSM cluster

**Key Features:**
- Symmetric (AES-256) and Asymmetric keys
- Automatic key rotation (optional for CMK)
- Key policies for access control
- Integration with most AWS services
- Audit via CloudTrail

**Key Rotation:**
- AWS Managed: Automatic (every 1 year)
- Customer Managed: Optional (every 1 year)
- Imported: Manual rotation only

> **Exam Tip:** KMS is regional. Keys cannot be used across regions. Use multi-region keys for cross-region scenarios.

#### CloudHSM
- **Dedicated hardware security module (HSM)**
- FIPS 140-2 Level 3 compliance
- You manage your own keys (AWS cannot access)
- Single-tenant hardware
- Higher cost than KMS
- Use cases: Compliance requirements, keys you must control

| Feature | KMS | CloudHSM |
|---------|-----|----------|
| FIPS Level | 140-2 Level 2 | 140-2 Level 3 |
| Key Control | AWS or Customer | Customer only |
| Multi-tenant | Yes | No (dedicated) |
| Cost | Lower | Higher |
| Scaling | Automatic | Manual cluster management |

#### Encryption at Rest vs In Transit

**Encryption at Rest:**
- Data encrypted when stored
- Services: S3, EBS, RDS, DynamoDB, etc.
- Options: SSE-S3, SSE-KMS, SSE-C, Client-side encryption

**Encryption in Transit:**
- Data encrypted while moving
- TLS/SSL certificates (ACM)
- VPN connections
- Direct Connect with MACsec

---

### AWS Certificate Manager (ACM)
- **Provision, manage, and deploy SSL/TLS certificates**
- Free public certificates from Amazon Trust Services
- Automatic certificate renewal
- Integrates with: ALB, CloudFront, API Gateway
- **Cannot export private keys for ACM-issued certificates**
- Can import third-party certificates (manual renewal)

> **Exam Tip:** For CloudFront, certificates must be in us-east-1 (N. Virginia).

---

### Secrets Manager vs Parameter Store

| Feature | Secrets Manager | Parameter Store |
|---------|-----------------|-----------------|
| Cost | $0.40/secret/month | Free (standard) / $0.05/advanced |
| Automatic Rotation | Yes (built-in) | No (Lambda required) |
| Cross-Account | Yes | Yes |
| Replication | Multi-region | No |
| Secret Types | Any | String, StringList, SecureString |
| RDS Integration | Native | No |
| Versioning | Yes | Yes |

> **Exam Tip:** Use Secrets Manager for database credentials requiring rotation. Use Parameter Store for configuration values.

---

### Security Monitoring and Compliance

#### AWS Config
- **Assess, audit, and evaluate AWS resource configurations**
- Records configuration changes over time
- Config Rules: Evaluate compliance (managed or custom)
- **NOT a preventive control** (detective only)
- Can trigger notifications on non-compliance
- Use cases: Compliance monitoring, change management, troubleshooting

#### CloudTrail
- **Logs API calls and account activity**
- Event history: 90 days (free)
- Trails: Store logs in S3 (long-term)
- Types:
  - **Management Events:** Control plane operations (enabled by default)
  - **Data Events:** Resource operations (S3 object-level, Lambda invokes)
  - **Insights Events:** Unusual activity detection
- **NOT real-time:** 15-minute delay for trails

> **Exam Tip:** CloudTrail is for "who did what." CloudWatch is for "what's happening now."

#### GuardDuty
- **Intelligent threat detection**
- Uses machine learning and threat intelligence
- Analyzes: CloudTrail logs, VPC Flow Logs, DNS logs
- Findings sent to CloudWatch Events/EventBridge
- **Fully managed** - no infrastructure to manage

#### Inspector
- **Automated security assessments**
- Network assessments (reachability)
- Host assessments (CVE scanning on EC2)
- Generates findings with severity levels
- Requires Inspector Agent on EC2 instances

#### Macie
- **Machine learning to discover and protect sensitive data**
- Scans S3 buckets for PII (personally identifiable information)
- Uses pattern matching and ML
- Integrates with CloudWatch Events

---

### WAF, Shield, and Firewall Manager

#### AWS WAF (Web Application Firewall)
- **Protect web applications from common exploits**
- Works with: CloudFront, ALB, API Gateway, AppSync
- Web ACLs with rules:
  - SQL injection protection
  - Cross-site scripting (XSS) protection
  - Rate limiting
  - Geo-blocking
  - Custom rules
- Managed rule groups available

#### AWS Shield
- **DDoS protection**
- **Shield Standard:** Free, automatic protection (L3/L4)
- **Shield Advanced:** $3,000/month, enhanced protection (L3/L4/L7)
  - Includes WAF at no extra cost
  - 24/7 DRT (DDoS Response Team) access
  - Cost protection for scaling during attacks
  - Real-time visibility

| Feature | Shield Standard | Shield Advanced |
|---------|-----------------|-----------------|
| Cost | Free | $3,000/month |
| Protection | L3/L4 | L3/L4/L7 |
| WAF Included | No | Yes |
| DRT Access | No | Yes |
| Cost Protection | No | Yes |

#### AWS Firewall Manager
- **Centralized WAF rule management**
- Manage rules across multiple accounts (with Organizations)
- Enforce baseline security policies
- Works with: WAF, Shield Advanced, Security Groups, Network Firewall

---

### AWS PrivateLink
- **Private connectivity between VPCs and services**
- Types:
  - **VPC Endpoint Services:** Expose your service to other VPCs
  - **VPC Endpoints (Interface):** Access AWS services privately
- Traffic stays on AWS network (no internet gateway)
- Cross-account and cross-region support

---

## Domain 2: Design Resilient Architectures (26%)

### EC2 (Elastic Compute Cloud)

#### Instance Types
| Family | Use Case | Examples |
|--------|----------|----------|
| T | Burstable, general purpose | t3, t3a, t4g |
| M | General purpose | m5, m5a, m6g |
| C | Compute optimized | c5, c5a, c6g |
| R | Memory optimized | r5, r5a, r6g |
| X | Memory optimized (extreme) | x1, x1e |
| HPC | High performance computing | hpc6a |
| I | Storage optimized (IOPS) | i3, i3en |
| D | Storage optimized (density) | d2, d3 |
| G | GPU accelerated | g4, g5 |
| P | GPU accelerated (ML) | p3, p4 |
| F | FPGA | f1 |

> **Exam Tip:** T instances are burstable with CPU credits. Good for variable workloads, not sustained high CPU.

#### Auto Scaling Groups (ASG)
- **Automatically adjust capacity based on demand**
- Components:
  - **Launch Template:** AMI, instance type, security groups, user data
  - **Scaling Policies:** When to scale
  - **Health Checks:** Replace unhealthy instances

**Scaling Policies:**
- **Target Tracking:** Maintain metric at target (e.g., 50% CPU)
- **Step Scaling:** Scale by steps based on alarm breach
- **Simple Scaling:** Scale by fixed amount
- **Scheduled Scaling:** Scale at specific times
- **Predictive Scaling:** ML-based prediction (proactive)

**Cooldown Period:**
- Default: 300 seconds
- Prevents additional scaling during this period
- Allows metrics to stabilize

> **Exam Tip:** Use Launch Templates (not Launch Configurations) - they support versioning and multiple instance types.

---

### Load Balancers

#### Application Load Balancer (ALB)
- **Layer 7 (HTTP/HTTPS)**
- Content-based routing (path, host, headers)
- Supports WebSocket and HTTP/2
- Target groups: EC2, ECS, Lambda, IP addresses
- SSL termination
- Slow start for targets
- Health checks at target group level

#### Network Load Balancer (NLB)
- **Layer 4 (TCP, UDP, TLS)**
- Ultra-low latency
- Handles millions of requests per second
- Static IP addresses (Elastic IP can be assigned)
- Preserves client IP address
- Target groups: EC2, IP addresses, ALB
- No SSL termination (pass-through)

#### Classic Load Balancer (CLB)
- **Legacy - Layer 4/7**
- Not recommended for new architectures
- Limited features compared to ALB/NLB

| Feature | ALB | NLB | CLB |
|---------|-----|-----|-----|
| Layer | 7 (HTTP/HTTPS) | 4 (TCP/UDP) | 4/7 |
| Latency | Higher | Ultra-low | Medium |
| Static IP | No | Yes | No |
| SSL Termination | Yes | No (pass-through) | Yes |
| Path-based Routing | Yes | No | No |
| WebSocket | Yes | Yes | No |
| Lambda Targets | Yes | No | No |
| Cross-Zone | Always on | Optional (charges) | Always on |

> **Exam Tip:** Use ALB for HTTP/HTTPS with routing needs. Use NLB for TCP/UDP, extreme performance, or static IP requirements.

---

### Route 53

#### Routing Policies
1. **Simple:** Single resource, no health checks
2. **Weighted:** Distribute traffic by percentage
3. **Failover:** Primary/secondary with health checks
4. **Latency-based:** Route to lowest latency region
5. **Geolocation:** Route based on user location
6. **Geoproximity:** Route based on geographic proximity (with bias)
7. **Multivalue Answer:** Return multiple IPs (client chooses)

#### Health Checks
- Monitor endpoint health
- Can trigger failover
- Types: HTTP, HTTPS, TCP
- Interval: 10 or 30 seconds
- Failure threshold: 1-10 consecutive failures

#### DNS Records
- **A Record:** IPv4 address
- **AAAA Record:** IPv6 address
- **CNAME:** Domain name alias (cannot be at zone apex)
- **Alias:** AWS-specific, maps to AWS resources (can be at zone apex)
- **MX:** Mail exchange
- **TXT:** Text records

> **Exam Tip:** Use Alias records for AWS resources (free, automatic health checks). CNAME cannot be used for root domain.

---

### S3 (Simple Storage Service)

#### Storage Classes

| Class | Durability | Availability | Use Case |
|-------|-----------|--------------|----------|
| S3 Standard | 99.999999999% | 99.99% | Frequently accessed |
| S3 Intelligent-Tiering | 99.999999999% | 99.9% | Unknown/variable access |
| S3 Standard-IA | 99.999999999% | 99.9% | Infrequent access |
| S3 One Zone-IA | 99.999999999% | 99.5% | Infrequent, reproducible |
| S3 Glacier Instant Retrieval | 99.999999999% | 99.9% | Archive, instant access |
| S3 Glacier Flexible Retrieval | 99.999999999% | 99.99% | Archive, minutes-hours |
| S3 Glacier Deep Archive | 99.999999999% | 99.9% | Archive, 12-48 hours |
| S3 Outposts | 99.999999999% | 99.9% | On-premises |

**Retrieval Times:**
- S3 Glacier Instant Retrieval: Milliseconds
- S3 Glacier Flexible Retrieval: 1-5 minutes (expedited), 3-5 hours (standard), 5-12 hours (bulk)
- S3 Glacier Deep Archive: 12 hours (standard), 48 hours (bulk)

> **Exam Tip:** S3 One Zone-IA has lower availability because data is in a single AZ. Not for critical data.

#### Versioning
- Stores multiple versions of an object
- Protects against accidental deletion
- Cannot be disabled once enabled (only suspended)
- MFA Delete: Requires MFA to delete versions
- Lifecycle policies can manage old versions

#### Replication
- **Cross-Region Replication (CRR):** Replicate to different region
- **Same-Region Replication (SRR):** Replicate within same region
- Requirements:
  - Versioning must be enabled on both buckets
  - IAM role with proper permissions
- Options:
  - Change object ownership
  - Replicate delete markers
  - Replica modification sync

#### Lifecycle Policies
- Automate transitions between storage classes
- Actions:
  - Transition to another storage class
  - Expire (delete) objects
  - Expire incomplete multipart uploads
  - Delete old object versions

#### S3 Security
- **Bucket Policies:** Resource-based policies
- **ACLs:** Legacy, object-level permissions
- **Block Public Access:** Override to prevent public access
- **Encryption:**
  - SSE-S3: AWS-managed keys
  - SSE-KMS: KMS-managed keys
  - SSE-C: Customer-provided keys
  - Client-side encryption

---

### RDS (Relational Database Service)

#### Multi-AZ Deployment
- **Synchronous replication** to standby in different AZ
- Automatic failover (60-120 seconds)
- For **high availability**, not read scaling
- Same region only
- No additional endpoint for standby
- Automatic backups from standby

#### Read Replicas
- **Asynchronous replication**
- Up to 15 replicas per DB instance
- Can be in same region or cross-region
- Used for **read scaling** and DR
- Each replica has its own endpoint
- Can promote to standalone database

| Feature | Multi-AZ | Read Replica |
|---------|----------|--------------|
| Purpose | High Availability | Read Scaling |
| Replication | Synchronous | Asynchronous |
| Data Lag | None | Typically < 1 second |
| Failover | Automatic | Manual (promote) |
| Endpoint | Single | Separate per replica |
| Cross-Region | No | Yes |
| Number | 1 standby | Up to 15 |

#### Backup Strategies
- **Automated Backups:**
  - Daily full backup
  - Transaction logs every 5 minutes
  - Retention: 0-35 days
  - Point-in-time recovery
- **Manual Snapshots:**
  - User-initiated
  - Stored until deleted
  - Can copy to other regions

#### RDS Proxy
- Connection pooling for RDS and Aurora
- Reduces database load
- Improves failover time
- Supports IAM authentication

---

### DynamoDB

#### Capacity Modes
- **On-Demand:** Pay per request, no capacity planning
- **Provisioned:** Specify RCUs and WCUs, use Auto Scaling

#### DAX (DynamoDB Accelerator)
- **In-memory cache** for DynamoDB
- Microsecond latency for reads
- Compatible with DynamoDB API
- Nodes: 1 primary + up to 9 read replicas
- Cluster spans multiple AZs

#### Global Tables
- **Multi-region, multi-active** replication
- Last writer wins conflict resolution
- Requires DynamoDB Streams
- Sub-second replication latency

#### DynamoDB Streams
- Captures item-level changes
- Use cases:
  - Trigger Lambda functions
  - Cross-region replication
  - Audit logging
  - Event-driven architectures

#### Important Limits
- Item size: 400 KB maximum
- Partition key: 10 GB per partition
- Sort key: Up to 1024 bytes
- GSIs per table: 20 (default), 5 LSIs per table

> **Exam Tip:** DynamoDB is eventually consistent by default. Use `ConsistentRead=true` for strongly consistent reads (2x RCU cost).

---

### EBS (Elastic Block Store)

#### Volume Types

| Type | Use Case | Max IOPS | Max Throughput |
|------|----------|----------|----------------|
| gp3 | General purpose (default) | 16,000 | 1,000 MB/s |
| gp2 | General purpose (legacy) | 16,000 | 250 MB/s |
| io2 | IOPS-intensive | 64,000 | 1,000 MB/s |
| io2 Block Express | Highest performance | 256,000 | 4,000 MB/s |
| st1 | Throughput-optimized HDD | 500 | 500 MB/s |
| sc1 | Cold HDD | 250 | 250 MB/s |

**Characteristics:**
- gp3: Baseline 3,000 IOPS, 125 MB/s, scales independently
- gp2: IOPS linked to size (3 IOPS/GB), bursts to 3,000
- io2: 99.999% durability, provisioned IOPS

#### Snapshots
- Point-in-time backup stored in S3
- Incremental (only changed blocks)
- Can create volumes from snapshots in any AZ
- Can copy to other regions
- Can be automated with Data Lifecycle Manager

#### Encryption
- Uses KMS for key management
- Can encrypt existing volumes (create snapshot, encrypt, create new volume)
- No performance impact
- All snapshot copies are encrypted if source is encrypted

---

### EFS vs FSx

#### EFS (Elastic File System)
- **Managed NFS service**
- Linux workloads
- Multiple AZs (Regional) or single AZ
- Automatic scaling
- Pay for what you use
- Concurrent access from thousands of instances

**Performance Modes:**
- General Purpose: Low latency, general workloads
- Max I/O: Higher throughput, higher latency

**Throughput Modes:**
- Bursting: Scales with file system size
- Provisioned: Fixed throughput
- Elastic: Automatically scales (recommended)

#### FSx
- **Fully managed third-party file systems**
- Types:
  - **FSx for Windows File Server:** SMB, Windows AD integration
  - **FSx for Lustre:** High-performance computing, Linux
  - **FSx for NetApp ONTAP:** NFS, SMB, iSCSI
  - **FSx for OpenZFS:** NFS, ZFS features

| Feature | EFS | FSx for Windows | FSx for Lustre |
|---------|-----|-----------------|----------------|
| Protocol | NFSv4 | SMB, NTFS | POSIX |
| OS | Linux | Windows | Linux |
| Use Case | General file share | Windows apps | HPC, ML |
| Performance | Moderate | High | Very High |

---

### Disaster Recovery Strategies

| Strategy | RTO | RPO | Description |
|----------|-----|-----|-------------|
| Backup and Restore | Hours-Days | 24 hours | Regular backups, restore when needed |
| Pilot Light | 10s of minutes | Minutes | Core systems always running |
| Warm Standby | Minutes | Minutes | Scaled-down production running |
| Multi-Site Active-Active | Near zero | Near zero | Full production in multiple regions |

**RTO (Recovery Time Objective):** Time to recover
**RPO (Recovery Point Objective):** Data loss acceptable

> **Exam Tip:** Backup and Restore is cheapest but slowest. Multi-Site is fastest but most expensive.

---

## Domain 3: Design High-Performing Architectures (24%)

### CloudFront

#### Key Features
- **Global content delivery network (CDN)**
- 400+ edge locations worldwide
- Caches content at edge locations
- Origins: S3, EC2, ALB, API Gateway, custom HTTP servers

#### Cache Behaviors
- Path patterns (e.g., `/images/*`)
- TTL settings (min, max, default)
- Query string forwarding
- Cookie forwarding
- Header forwarding
- Compress objects automatically

#### Origin Types
- **S3 Origin:** Static content, OAI/OAC for security
- **Custom Origin:** Dynamic content, HTTP servers

#### Security Features
- **Field-Level Encryption:** Encrypt specific fields
- **Signed URLs/Signed Cookies:** Restrict access
- **Origin Access Identity (OAI):** Secure S3 access
- **Origin Access Control (OAC):** Modern replacement for OAI

#### Lambda@Edge
- Run Lambda functions at edge locations
- Triggers:
  - Viewer Request
  - Viewer Response
  - Origin Request
  - Origin Response
- Use cases: A/B testing, authentication, URL rewrites

> **Exam Tip:** CloudFront reduces latency by caching at edge locations. Use for global users accessing S3 or dynamic content.

---

### ElastiCache

#### Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| Data Types | Rich (strings, lists, sets, hashes) | Simple (strings only) |
| Persistence | Yes (AOF, RDB) | No |
| Replication | Yes (cluster mode) | No |
| Clustering | Yes | Client-side sharding |
| Multi-AZ | Yes | No |
| Backup/Restore | Yes | No |
| Transactions | Yes | No |
| Pub/Sub | Yes | No |

**Use Cases:**
- **Redis:** Session store, real-time analytics, leaderboards, geospatial
- **Memcached:** Simple caching, small objects, horizontal scaling

---

### Global Accelerator

- **Improves availability and performance for global users**
- Uses AWS global network (not public internet)
- Two static anycast IP addresses
- Health checks and automatic failover
- Works with: ALB, NLB, EC2, Elastic IP
- No caching (unlike CloudFront)

**CloudFront vs Global Accelerator:**
| Feature | CloudFront | Global Accelerator |
|---------|------------|-------------------|
| Caching | Yes | No |
| Static IPs | No | Yes (2 anycast) |
| Protocol | HTTP/HTTPS | Any TCP/UDP |
| Use Case | Content delivery | Application acceleration |

---

### S3 Transfer Acceleration
- **Fast transfers to S3 over long distances**
- Uses CloudFront edge locations
- Optimized for uploads from distant locations
- Additional cost per GB transferred

---

### EC2 Performance

#### Placement Groups
1. **Cluster:** Low latency, high throughput (same rack)
2. **Spread:** High availability (different hardware)
3. **Partition:** Large distributed workloads (different partitions)

| Type | Use Case | Limitations |
|------|----------|-------------|
| Cluster | HPC, low latency | Same AZ, same instance type |
| Spread | Critical instances | 7 instances per AZ |
| Partition | Large distributed apps | Up to 7 partitions per AZ |

#### Enhanced Networking
- **ENA (Elastic Network Adapter):** Up to 100 Gbps
- **ENA Express:** SR-IOV for lower latency
- **EFM (Elastic Fabric Adapter):** HPC, OS-bypass

---

### EBS Optimization

**IOPS vs Throughput:**
- **IOPS:** Number of I/O operations per second (random access)
- **Throughput:** Amount of data transferred per second (sequential access)

**Optimization Tips:**
- Use EBS-optimized instances
- Use appropriate volume type for workload
- Stripe multiple volumes for higher performance
- Consider instance store for temporary high performance

---

### RDS Performance

**Read Scaling:**
- Read Replicas for read-heavy workloads
- Up to 15 replicas
- Can be cross-region

**Caching:**
- ElastiCache for query result caching
- DAX for DynamoDB

**Performance Insights:**
- Visual database performance monitoring
- Identify bottlenecks
- Free tier: 7 days retention

---

### DynamoDB Performance

**Partitioning:**
- Data distributed across partitions based on partition key
- Each partition: 10 GB max, 3,000 RCU, 1,000 WCU
- Hot partition problem: Uneven access causes throttling

**DAX:**
- Microsecond read latency
- 10x read performance improvement
- Compatible with DynamoDB API

**Best Practices:**
- Use composite keys (partition + sort) for even distribution
- Use adaptive capacity for uneven workloads
- Enable DAX for read-heavy workloads
- Use on-demand for unpredictable traffic

---

### API Gateway

#### Features
- Create, publish, and manage APIs
- Types: REST API, HTTP API, WebSocket API

**Caching:**
- Cache responses at edge
- TTL: 0-3600 seconds
- Reduce backend load

**Throttling:**
- Default: 10,000 RPS per region
- Burst: 5,000 concurrent requests
- Can set limits per method

**Endpoint Types:**
- Edge-optimized: CloudFront edge locations
- Regional: Single region
- Private: VPC access only

---

### Lambda Performance

#### Concurrency
- **Unreserved Concurrency:** Default, shared pool
- **Reserved Concurrency:** Guaranteed capacity for function
- **Provisioned Concurrency:** Pre-warmed execution environments

**Cold Start:**
- Time to initialize execution environment
- Mitigation: Provisioned Concurrency, keep-alive pings

**Performance Tips:**
- Increase memory (also increases CPU)
- Use Layers for dependencies
- Minimize deployment package
- Use provisioned concurrency for latency-sensitive apps

---

### SQS vs SNS vs Kinesis vs EventBridge

| Feature | SQS | SNS | Kinesis | EventBridge |
|---------|-----|-----|---------|-------------|
| Type | Queue | Pub/Sub | Streaming | Event Bus |
| Message Order | FIFO available | No | Yes (per shard) | No |
| Delivery | Pull | Push | Pull | Push |
| Retention | 14 days | None | 365 days | 24 hours |
| Fan-out | No | Yes | Yes | Yes |
| Filtering | No | Yes | No | Yes (advanced) |
| Targets | Consumers | SQS, Lambda, etc. | Consumers | 20+ AWS services |

**Use Cases:**
- **SQS:** Decoupling, async processing, task queues
- **SNS:** Notifications, fan-out to multiple subscribers
- **Kinesis:** Real-time streaming, big data, logs
- **EventBridge:** Event-driven architectures, SaaS integration

---

## Domain 4: Design Cost-Optimized Architectures (20%)

### EC2 Pricing Models

| Model | Savings | Commitment | Best For |
|-------|---------|------------|----------|
| On-Demand | None | None | Short-term, unpredictable |
| Reserved | Up to 72% | 1-3 years | Steady-state workloads |
| Savings Plans | Up to 72% | 1-3 years ($/hour) | Flexible commitment |
| Spot | Up to 90% | None (interruptible) | Fault-tolerant, flexible |
| Dedicated Hosts | Varies | None | License compliance |
| Dedicated Instances | Varies | None | Compliance, no sharing |

**Reserved Instance Types:**
- **Standard:** Up to 72% savings, can modify AZ, instance size
- **Convertible:** Up to 54% savings, can change instance family
- **Scheduled:** Reserved for specific time windows

**Savings Plans:**
- Compute Savings Plans: Most flexible (any region, any instance family)
- EC2 Instance Savings Plans: Regional, specific instance family
- SageMaker Savings Plans: For SageMaker

> **Exam Tip:** Spot instances can be interrupted with 2-minute warning. Use for batch processing, CI/CD, stateless workloads.

---

### S3 Cost Optimization

**Storage Classes:**
- Choose appropriate class for access patterns
- Use Intelligent-Tiering for unknown patterns
- Lifecycle policies for automatic transitions

**Cost Factors:**
- Storage (per GB)
- Requests (PUT, GET, etc.)
- Data retrieval (for Glacier classes)
- Data transfer (out to internet)

**Optimization Tips:**
- Use lifecycle policies to move old data to cheaper classes
- Delete incomplete multipart uploads
- Compress data before upload
- Use S3 Select to retrieve only needed data

---

### RDS Cost Optimization

**Reserved Instances:**
- 1 or 3 year terms
- Up to 69% savings
- Can be applied to Multi-AZ deployments

**Serverless:**
- Aurora Serverless v2: Scales capacity automatically
- Pay per second of usage
- Good for variable workloads

**General Tips:**
- Right-size instances
- Use Read Replicas instead of larger instances for reads
- Consider Aurora for better price/performance

---

### Compute Optimizer
- **Recommends optimal AWS resources**
- Analyzes CloudWatch metrics
- Provides recommendations for:
  - EC2 instances
  - Auto Scaling groups
  - EBS volumes
  - Lambda functions
  - ECS services on Fargate

---

### Cost Explorer
- **Visualize and analyze costs**
- Filter by service, region, tags, etc.
- Forecast future costs
- Identify cost drivers
- Free to use

---

### AWS Budgets
- **Set custom budgets and alerts**
- Types:
  - Cost budgets
  - Usage budgets
  - Reservation budgets
  - Savings Plans budgets
- Alerts via email or SNS
- Can trigger actions (e.g., Lambda)

---

### Trusted Advisor
- **Best practices and recommendations**
- Categories:
  - Cost Optimization
  - Performance
  - Security
  - Fault Tolerance
  - Service Limits
  - Operational Excellence
- Checks vary by support plan

---

### Right-Sizing Strategies
1. **Monitor:** Use CloudWatch to track utilization
2. **Analyze:** Identify underutilized resources
3. **Act:** Resize or terminate resources
4. **Repeat:** Continuous process

**Tools:**
- Compute Optimizer
- CloudWatch
- Cost Explorer
- Third-party tools

---

### Data Transfer Costs

**Free:**
- Inbound data transfer
- Data transfer within same AZ
- Data transfer to CloudFront (from AWS services)
- Data transfer from S3 to CloudFront

**Paid:**
- Outbound to internet
- Cross-region data transfer
- Cross-AZ data transfer (in some cases)
- NAT Gateway data processing

> **Exam Tip:** Data transfer costs can be significant. Use CloudFront, keep traffic within AZ when possible, and use VPC endpoints.

---

## VPC Fundamentals

### VPC Components

**Subnets:**
- Public subnet: Route table has route to IGW
- Private subnet: No route to IGW
- Minimum /28, maximum /16 for VPC CIDR

**Route Tables:**
- Define traffic routing
- Each subnet associated with one route table
- Main route table: Default for new subnets
- Custom route tables: For specific routing needs

**Internet Gateway (IGW):**
- Enables internet access for VPC
- Attach to VPC, add route in route table
- Highly available, no bandwidth constraints

**NAT Gateway:**
- Allows private subnet instances to access internet
- Outbound only (no inbound connections)
- Highly available within AZ
- Use one per AZ for HA
- Charged per hour + data processing

**NAT Instance (legacy):**
- EC2 instance running NAT software
- Single point of failure
- Requires maintenance
- Cheaper but less reliable

| Feature | NAT Gateway | NAT Instance |
|---------|-------------|--------------|
| Availability | HA within AZ | Single point of failure |
| Bandwidth | Up to 45 Gbps | Depends on instance size |
| Maintenance | None | Required |
| Performance | No bottleneck | Can be bottleneck |
| Cost | Higher | Lower |

---

### VPC Connectivity

**VPC Peering:**
- Connect two VPCs (can be cross-account, cross-region)
- No transitive peering (A-B, B-C does NOT mean A-C)
- No overlapping CIDRs
- One peering connection per VPC pair

**Transit Gateway:**
- Hub-and-spoke model
- Connect thousands of VPCs
- Supports VPN and Direct Connect
- Cross-region peering
- Route tables for traffic segmentation

**VPC Endpoints:**
- Private connection to AWS services
- Gateway endpoints: S3, DynamoDB
- Interface endpoints: Most AWS services

**PrivateLink:**
- Private connectivity to services
- Interface endpoints for AWS services
- Endpoint services for your applications

---

### VPN and Direct Connect

**Site-to-Site VPN:**
- Encrypted connection over internet
- VPN Gateway on AWS side
- Customer Gateway on-premises
- Two tunnels for redundancy

**Direct Connect:**
- Dedicated network connection
- No internet traversal
- Lower latency, higher bandwidth
- More secure
- Takes 1-2 months to provision

**Direct Connect Gateway:**
- Connect Direct Connect to multiple VPCs
- Cross-region support

**VPN CloudHub:**
- Multiple site-to-site VPNs with hub-and-spoke
- Low-cost alternative to Direct Connect

---

## Container Services

### ECS (Elastic Container Service)
- **AWS-native container orchestration**
- Launch types:
  - **EC2:** Run on EC2 instances you manage
  - **Fargate:** Serverless, AWS manages infrastructure
- Integrates with: ALB, CloudWatch, IAM
- Task definitions define containers to run
- Services maintain desired number of tasks

### EKS (Elastic Kubernetes Service)
- **Managed Kubernetes service**
- Launch types: EC2 or Fargate
- Supports standard Kubernetes APIs
- Control plane managed by AWS
- More complex than ECS but portable

### ECS vs EKS

| Feature | ECS | EKS |
|---------|-----|-----|
| Complexity | Simpler | More complex |
| Portability | AWS-specific | Kubernetes (portable) |
| Learning Curve | Lower | Higher |
| Cost | Lower (no control plane fee) | $0.10/hour per cluster |
| Community | AWS | Large Kubernetes community |

---

## Serverless Architecture

### Lambda
- **Run code without provisioning servers**
- Supports: Python, Node.js, Java, Go, Ruby, C#, PowerShell
- Triggers: API Gateway, S3, DynamoDB Streams, EventBridge, etc.
- Limits:
  - Memory: 128 MB - 10,240 MB
  - Timeout: 15 minutes
  - Deployment package: 250 MB unzipped
  - Concurrent executions: 1,000 default (can be increased)

### API Gateway
- Create RESTful and WebSocket APIs
- Integrates with Lambda, EC2, other HTTP endpoints
- Features: caching, throttling, authorization, request/response transformation

### Step Functions
- **Workflow orchestration**
- Visual workflow designer
- State machines for complex processes
- Integrates with Lambda, ECS, SNS, SQS, etc.
- Error handling and retries built-in

**State Types:**
- Task: Single unit of work
- Choice: Conditional branching
- Parallel: Execute branches in parallel
- Map: Iterate over collection
- Wait: Delay execution
- Pass: Pass input to output
- Succeed/Fail: End states

---

## Storage Services Comparison

| Service | Type | Use Case | Protocol |
|---------|------|----------|----------|
| S3 | Object storage | Backups, static content, data lake | HTTP/REST |
| EBS | Block storage | EC2 persistent storage | N/A |
| EFS | File storage (NFS) | Linux shared storage | NFSv4 |
| FSx for Windows | File storage (SMB) | Windows shared storage | SMB |
| FSx for Lustre | File storage (HPC) | HPC, ML workloads | POSIX |
| Instance Store | Ephemeral block | Temporary high-performance storage | N/A |
| Storage Gateway | Hybrid storage | On-premises to cloud bridge | iSCSI, NFS, SMB |

---

## Database Services Comparison

| Service | Type | Use Case |
|---------|------|----------|
| RDS | Relational | Traditional SQL databases |
| Aurora | Relational (MySQL/PostgreSQL) | High-performance relational |
| DynamoDB | NoSQL (key-value) | Low-latency, scalable |
| ElastiCache | In-memory | Caching, session store |
| DocumentDB | Document (MongoDB) | JSON document storage |
| Keyspaces | Wide-column (Cassandra) | Cassandra-compatible |
| Neptune | Graph | Graph databases |
| QLDB | Ledger | Immutable transaction log |
| Timestream | Time-series | IoT, operational metrics |
| Redshift | Data warehouse | Analytics, BI |

---

## Migration Services

### DMS (Database Migration Service)
- **Migrate databases to AWS**
- Homogeneous (same engine) or heterogeneous (different engine)
- Continuous replication supported
- Sources: On-premises, RDS, S3, etc.
- Targets: RDS, Aurora, S3, DynamoDB, etc.
- Schema Conversion Tool (SCT) for heterogeneous migrations

### SMS (Server Migration Service)
- **Migrate on-premises VMs to AWS**
- Incremental replication
- Supports: VMware, Hyper-V, Azure VMs
- Being replaced by AWS Application Migration Service

### AWS Application Migration Service
- **Lift-and-shift migration**
- Replicates servers to AWS
- Minimal downtime cutover
- Replaces SMS

### Snow Family
- **Physical data transfer devices**
- **Snowcone:** 8 TB, edge computing
- **Snowball Edge:** 80 TB storage, compute capabilities
- **Snowmobile:** 100 PB, exabyte-scale migration

**When to use:**
- Large data sets (>TB)
- Limited bandwidth
- High network costs
- Time-sensitive migrations

### DataSync
- **Online data transfer service**
- Transfers between on-premises and AWS
- Supports: NFS, SMB, HDFS, S3, EFS, FSx
- Scheduled or one-time transfers
- Faster than standard network copy

---

## Monitoring and Logging

### CloudWatch
- **Monitoring and observability**
- **Metrics:** Performance data (CPU, memory, etc.)
- **Logs:** Centralized log management
- **Alarms:** Trigger actions based on metrics
- **Dashboards:** Visualize metrics
- **Events/EventBridge:** React to AWS resource changes
- **Synthetics:** Canary testing

**CloudWatch Logs:**
- Log groups contain log streams
- Retention: 1 day to 10 years (indefinite)
- Export to S3 for long-term storage
- Subscription filters for real-time processing

### CloudTrail
- **Account activity logging**
- API calls and console actions
- Event history: 90 days
- Trails for long-term storage in S3
- CloudWatch Logs integration

### X-Ray
- **Distributed tracing**
- Analyze and debug applications
- Visual service maps
- Trace requests across services
- Identify performance bottlenecks

---

## Common Architectural Patterns

### 3-Tier Architecture
```
┌─────────────────────────────────────────────────────────┐
│                      Web Tier                            │
│              (ALB + EC2 Auto Scaling)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   Application Tier                       │
│              (EC2 Auto Scaling / ECS)                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Database Tier                         │
│              (RDS Multi-AZ / DynamoDB)                   │
└─────────────────────────────────────────────────────────┘
```

### Microservices Architecture
- Independent, loosely coupled services
- Each service has its own database
- Communicate via APIs or messaging
- Use ECS/EKS for container orchestration
- API Gateway for service exposure

### Event-Driven Architecture
- Components react to events
- Services are decoupled
- Use: EventBridge, SQS, SNS, Kinesis
- Lambda for event processing

### Serverless Architecture
- No server management
- Event-triggered functions
- Auto-scaling
- Pay per use
- Components: Lambda, API Gateway, DynamoDB, S3

---

## Quick Reference Tables

### When to Use What

| Scenario | Service |
|----------|---------|
| Static website hosting | S3 + CloudFront |
| Session state | ElastiCache (Redis) |
| User authentication | Cognito |
| Message queue | SQS |
| Pub/Sub messaging | SNS |
| Real-time streaming | Kinesis |
| Container orchestration | ECS or EKS |
| Serverless compute | Lambda |
| API management | API Gateway |
| Workflow orchestration | Step Functions |
| Secrets management | Secrets Manager |
| Configuration management | Systems Manager Parameter Store |
| Infrastructure as Code | CloudFormation or Terraform |
| CI/CD pipeline | CodePipeline + CodeBuild |

### Security Services Matrix

| Service | Purpose |
|---------|---------|
| IAM | Access management |
| KMS | Key management |
| CloudHSM | Hardware key management |
| WAF | Web application firewall |
| Shield | DDoS protection |
| GuardDuty | Threat detection |
| Inspector | Security assessments |
| Macie | Data discovery |
| Config | Compliance monitoring |
| CloudTrail | Activity logging |
| Secrets Manager | Secret storage |
| Certificate Manager | SSL/TLS certificates |

### High Availability Patterns

| Pattern | Services | RTO |
|---------|----------|-----|
| Multi-AZ | RDS Multi-AZ, ALB | Minutes |
| Multi-Region | Route 53, RDS Cross-Region Read Replica | Minutes-Hours |
| Active-Active | Route 53, DynamoDB Global Tables | Near zero |
| Auto Scaling | EC2 ASG, ECS | Minutes |

### Performance Optimization

| Technique | Service | Benefit |
|-----------|---------|---------|
| Caching | CloudFront, ElastiCache | Reduced latency |
| Read replicas | RDS Read Replicas, DAX | Read scaling |
| CDN | CloudFront | Global performance |
| Connection pooling | RDS Proxy | Reduced DB load |
| Provisioned capacity | DynamoDB, Lambda | Consistent performance |

---

## Exam Tips Summary

### General Tips
1. **Read the question carefully** - identify what is being asked
2. **Eliminate wrong answers first** - increases odds
3. **Look for keywords** - "most cost-effective," "highly available," "lowest latency"
4. **Consider all requirements** - security, performance, cost, availability
5. **AWS-managed services preferred** - over self-managed when possible

### Common Traps
- Choosing the most expensive solution when not required
- Forgetting about data transfer costs
- Not considering Multi-AZ for production databases
- Using the wrong storage class for access patterns
- Choosing Spot instances for critical workloads

### Key Concepts to Remember
- **Security:** Defense in depth, least privilege, encryption everywhere
- **Resilience:** Multi-AZ, auto-scaling, health checks, backups
- **Performance:** Caching, read replicas, CDN, appropriate instance types
- **Cost:** Right-sizing, reserved capacity, lifecycle policies, Spot instances

---

## Additional Resources

### AWS Documentation
- AWS Well-Architected Framework
- AWS Architecture Center
- Service-specific documentation

### Practice Exams
- AWS Official Practice Exam
- Whizlabs
- Tutorial Dojo
- Linux Academy / A Cloud Guru

### Hands-On Practice
- AWS Free Tier
- AWS Workshops
- Qwiklabs
- CloudAcademy labs

---

*Good luck with your SAA-C03 exam! This guide covers the essential concepts, but hands-on practice is crucial for success.*
