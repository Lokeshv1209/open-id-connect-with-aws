**Steps to build and push the image to the ECR**

1️⃣ Create ECR Repository (AWS)
AWS Console → Amazon ECR → Repositories → Create repository
Fill:
Visibility: Private
Repository name: demo/lfb
Region: ap-south-1

2️⃣ Create GitHub OIDC Identity Provider (AWS IAM)
IAM → Identity providers → Add provider
⚠️ This is NOT the EKS OIDC provider.
Fill exactly:
Field	Value
Provider type	OpenID Connect
Provider URL	https://token.actions.githubusercontent.com
Audience	sts.amazonaws.com
Click Add provider
✅ Result:
arn:aws:iam::202279973546:oidc-provider/token.actions.githubusercontent.com

3️⃣ Create IAM Role for GitHub Actions
Console steps
IAM → Roles → Create role
Trusted entity
Select Web identity
Identity provider: token.actions.githubusercontent.com
Audience: sts.amazonaws.com
Click Next

4️⃣ Configure Trust Policy (VERY IMPORTANT)
Edit Trust relationships → Replace with:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::202279973546:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:Lokeshv1209/open-id-connect-with-aws:*"
        }
      }
    }
  ]
}

5️⃣ Attach ECR Permissions to the Role
Attach AWS managed policy:
AmazonEC2ContainerRegistryPowerUser
This allows:
Login to ECR
Push images
Pull images
✅ Your role now:
GitHubActions-ECR-Push

6️⃣ Verify Role Exists
IAM → Roles → GitHubActions-ECR-Push
You should see:
Trusted entity: GitHub OIDC provider
Permissions: ECR PowerUser









**Steps to run the image stored in the ECR in the ECS**

Running an ECS Fargate Task for Testing (Run Task – Detailed Steps)
Goal: Run a container image from ECR on AWS ECS Fargate for testing using a public IP

0️⃣ Prerequisites (already completed)
Docker image pushed to Amazon ECR
ECS Cluster created
ECS Task Definition created
Internet Gateway attached to VPC
Route table updated with 0.0.0.0/0 → IGW
Security group allows inbound traffic on app port (5000)
App listens on 0.0.0.0:5000

1️⃣ Create / Update Task Definition
ECS → Task Definitions → Create new revision
Task settings
Launch type: Fargate
OS/Architecture: Linux / x86_64
CPU: 1 vCPU
Memory: 3 GiB
Network mode: awsvpc
Container definition
Field	Value
Container name	lfb
Image	202279973546.dkr.ecr.ap-south-1.amazonaws.com/demo/lfb:<tag>
Port mappings	5000 / TCP
Essential	✅
Environment variables	PORT=5000, HOST=0.0.0.0 pass it in the Dockerfile
IAM roles
Task execution role: ecsTaskExecutionRole
Task role: None
Save → New revision created

2️⃣ Run Task (Testing Mode)
Go to:
ECS → Task definitions → open-id-connect-with-aws:<revision> → Run task

3️⃣ Run Task Configuration (IMPORTANT)
Task details
Task definition: open-id-connect-with-aws
Revision: Latest
Desired tasks: 1
Environment
Launch type: FARGATE
Cluster: open-id-connect-with-aws
Networking (CRITICAL)
Setting	Value
VPC	Default VPC
Subnet	Public subnet
Security group	Allows TCP 5000
Auto-assign public IP	ENABLED
IAM
Task execution role: ecsTaskExecutionRole
Task role: (empty)
Container overrides
❌ Do NOT override command
❌ No echo hello world
Platform version
LATEST
Click Create

4️⃣ Verify Task Status
Go to:
ECS → Clusters → open-id-connect-with-aws → Tasks
Expected:
Status: RUNNING

5️⃣ Access the Application
Open the running task
Copy Public IP
Access in browser:
http://<public-ip>:5000
✅ Application loads successfully

6️⃣ Why this Worked (Key Points)
Task runs in awsvpc mode
ENI attached directly to the task
Public IP + IGW route allows internet access
App listens on 0.0.0.0
Container port matches app port

7️⃣ Common Errors You Avoided (Good Job)
Mistake	Result
No IGW route	Image pull fails
App bound to localhost	Connection refused
Wrong container port	App unreachable
Command override	Task exits
No public IP	Cannot access
