# Setup EKS

<br>

### Step 1: Setup

Execute in terminal: 

```
terraform init
terraform plan
terraform apply
```

__Note:__ It takes about 10 minutes to create the resources.

<br>

### Step 2: Configure kubectl

__Configure kubectl__ using the terraform output (__kubeconfig__).

<br>

### Step 3: Connect nodes to cluster

__Connect the nodes to the cluster__ using the terraform output (__config_map_aws_auth__).
