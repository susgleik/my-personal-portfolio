terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "tu-project-id"  # Tu Firebase Project ID
  region  = "us-central1"
}
