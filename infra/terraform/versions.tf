terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}

  # Required by azurerm 4.x. Set via variable or the ARM_SUBSCRIPTION_ID env var.
  subscription_id = var.subscription_id
}
