# Azure account setup (before the first `terraform apply`)

Checklist of what must exist before running `terraform apply` in `infra/terraform/`.
Nothing here contains secrets: never commit passwords, keys or subscription credentials.

## 1. Azure account

1. Create an Azure free account at <https://azure.microsoft.com/free> (credit card verification required; students can use *Azure for Students*).
2. Open the [Azure portal](https://portal.azure.com) and check **Subscriptions**: you need one active subscription.
3. Note the subscription type (Free Trial / Pay-As-You-Go / Azure for Students). The free services differ between them.

## 2. Local tools

| Tool | Check |
| --- | --- |
| Azure CLI | `az --version` |
| Terraform >= 1.5 | `terraform version` |
| Git | `git --version` |
| SSH client + key pair | `ssh-keygen -t rsa -b 4096` creates `~/.ssh/id_rsa(.pub)` |

## 3. Authenticate

```bash
az login
az account show --query "{name:name, id:id}" -o table
```

If you have several subscriptions, select the right one:

```bash
az account set --subscription "<subscription id>"
```

Terraform reuses this CLI session. The subscription ID goes in `terraform.tfvars` (`subscription_id`).

## 4. Resource providers

Make sure the providers used by Terraform are registered (once per subscription):

```bash
az provider register --namespace Microsoft.Compute
az provider register --namespace Microsoft.Network
az provider show --namespace Microsoft.Compute --query registrationState -o tsv
```

The state must be `Registered`.

## 5. Check the VM size is available

```bash
az vm list-skus --location francecentral --size Standard_B1s -o table
```

If the output shows a restriction for your subscription, pick another region (for example `westeurope`) and set `location` in `terraform.tfvars`.

## 6. Free-tier safety

- Free account: 750 h/month of a B-series Linux VM, plus 2 x 64 GB Premium SSD, for 12 months. Check the current list on the free account page.
- Create a budget: Portal -> **Cost Management** -> **Budgets** -> amount 1-2 EUR with an email alert.
- Run `terraform destroy` when the VM is not needed.
- A stopped (deallocated) VM still bills its disk and public IP.

## 7. Terraform variables

Copy `infra/terraform/terraform.tfvars.example` to `terraform.tfvars` (git-ignored) and set:

- `subscription_id`
- `ssh_public_key` (the `.pub` file, never the private key)
- `ssh_allowed_cidr` (your public IPv4 + `/32`, from `curl.exe -4 ifconfig.me`)

## 8. Final check

```bash
cd infra/terraform
terraform init
terraform validate
terraform plan -out=tfplan
```

Expected: `Plan: 8 to add, 0 to change, 0 to destroy.` Then `terraform apply tfplan`.

## Later: CI/CD access (not needed for the first apply)

GitHub Actions will need a service principal and secrets. See the secrets structure document (task CAD213-36).
