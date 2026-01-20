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