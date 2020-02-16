[![license](https://img.shields.io/github/license/autero1/action-terraform)](https://github.com/autero1/action-terraform/blob/master/LICENSE)
[![release](https://img.shields.io/github/release/autero1/action-terraform)](https://github.com/autero1/action-terraform/releases/latest)
[![GitHub release date](https://img.shields.io/github/release-date/autero1/action-terraform.svg)](https://github.com/autero1/action-terraform/releases)
![Test Action](https://github.com/autero1/action-terraform/workflows/Test%20Action/badge.svg?branch=master&event=push)
[![CodeFactor](https://www.codefactor.io/repository/github/autero1/action-terraform/badge)](https://www.codefactor.io/repository/github/autero1/action-terraform)

# Setup Terraform GitHub Action

Set up your GitHub Actions workflow with a specific version of [Terraform](https://www.terraform.io/).

## Usage

The next example step will install Terraform 0.12.20.

```yaml
name: Example workflow

on: [push]

jobs:
  example:
    name: Example Terraform interaction
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup Terraform
        uses: autero1/action-terraform@v0.0.1
        with:
          terraform_version: 0.12.20
      - name: Interact with Terraform
        run: terraform --version
```

### Inputs

| Parameter | Description | Required |
| --------- | ----------- | -------- |
| `terraform_version` | Terraform [version](https://releases.hashicorp.com/terraform/) to deploy | true |

### Outputs

| Parameter | Description |
| --------- | ----------- |
| `terraform_path` | Cached tool path of Terraform |

### Supported platforms

This action has been tested on the following platforms:

* ubuntu-18.04
* windows-latest
* macos-latest

## License

The scripts and documentation in this project are released under the [MIT](./LICENSE) license.
