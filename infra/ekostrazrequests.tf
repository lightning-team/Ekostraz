provider "azurerm" {
  version = "=2.0.0"
  features {}
  skip_provider_registration = true
  subscription_id = var.subscription_id
}

resource "azurerm_resource_group" "requests_rg" {
  name     = "${var.testprefix}${var.resource_group_name}"
  location = var.region
}

resource "azurerm_storage_account" "requests_storage" {
  name                     = "${var.testprefix}${var.storage_account_name}"
  resource_group_name      = azurerm_resource_group.requests_rg.name
  location                 = azurerm_resource_group.requests_rg.location
  account_tier             = "Standard"
  account_replication_type = var.storage_replication_type
  account_kind 			   = var.storage_account_kind
}

resource "azurerm_app_service_plan" "requests_serviceplan" {
  name                = "${var.testprefix}${var.function_app_name}plan"
  location            = azurerm_resource_group.requests_rg.location
  resource_group_name = azurerm_resource_group.requests_rg.name
  kind                = "FunctionApp"

  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "requests_functions" {
  name                      = "${var.testprefix}${var.function_app_name}"
  location                  = azurerm_resource_group.requests_rg.location
  resource_group_name       = azurerm_resource_group.requests_rg.name
  app_service_plan_id       = azurerm_app_service_plan.requests_serviceplan.id
  storage_connection_string = azurerm_storage_account.requests_storage.primary_connection_string
  version 					= "~2"

}

resource "azurerm_storage_table" "requests_table" {
  name                 = "Interventions"
  storage_account_name = azurerm_storage_account.requests_storage.name
}

resource "azurerm_storage_container" "requests_container" {
  name                  = "attachments"
  storage_account_name  = azurerm_storage_account.requests_storage.name
  container_access_type = "container"
}