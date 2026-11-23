# Terraform – Azure infrastructure

Provisions the Azure resources for the Coffee Arabica app (free-tier friendly):

- Resource group, virtual network and subnet
- Static public IP
- Network security group (SSH from your IP only, ports 3000 and 8081 open)
- Network interface
- Ubuntu 24.04 Linux VM (`Standard_B1s`, 64 GB Premium SSD) with Docker installed through `cloud-init.yaml`

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli), logged in with `az login`
- An SSH key pair (`ssh-keygen -t rsa -b 4096`)

## Configuration

Copy the example file and fill in your values (it is git-ignored):

```bash
cp terraform.tfvars.example terraform.tfvars
```

| Variable | Description |
| --- | --- |
| `subscription_id` | `az account show --query id -o tsv` |
| `ssh_public_key` | Content of your **public** key (`~/.ssh/id_rsa.pub`) |
| `ssh_allowed_cidr` | Your public IPv4 followed by `/32` (`curl.exe -4 ifconfig.me`) |
| `location` | Azure region (default `francecentral`) |
| `vm_size` | VM size (default `Standard_B1s`) |

## Usage

Run all commands from `infra/terraform/`.

```bash
terraform init
terraform validate
terraform plan -out=tfplan
```

Apply only when the plan looks right:

```bash
terraform apply tfplan
```

Outputs (public IP, SSH command, URLs) are shown after `apply`, or again with `terraform output`.

Remove everything to avoid costs:

```bash
terraform destroy
```

## Security notes

- Never commit `terraform.tfvars`, `*.tfstate` or `tfplan`.
- Never put a private key or password in these files.
- Update `ssh_allowed_cidr` if your IP changes.
