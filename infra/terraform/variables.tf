variable "subscription_id" {
  description = "Azure subscription ID (az account show --query id -o tsv)."
  type        = string
}

variable "project_name" {
  description = "Prefix used to name all resources."
  type        = string
  default     = "coffee-arabica"
}

variable "location" {
  description = "Azure region. Pick one where the free-tier VM size is available."
  type        = string
  default     = "francecentral"
}

variable "vm_size" {
  description = "VM size. B1s / B2pts_v2 / B2ats_v2 are covered by the Azure free account (750h/month, 12 months)."
  type        = string
  default     = "Standard_B1s"
}

variable "admin_username" {
  description = "Linux admin user on the VM."
  type        = string
  default     = "azureuser"
}

variable "ssh_public_key" {
  description = "Content of the SSH public key (e.g. file(\"~/.ssh/id_rsa.pub\")). Never put the private key here."
  type        = string
}

variable "ssh_allowed_cidr" {
  description = "CIDR allowed to SSH (your public IP, e.g. 1.2.3.4/32). Avoid 0.0.0.0/0."
  type        = string
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default = {
    project = "coffee-arabica"
    managed = "terraform"
  }
}
