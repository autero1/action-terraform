[![license](https://img.shields.io/github/license/autero1/action-terraform)](https://github.com/autero1/action-terraform/blob/main/LICENSE)
[![release](https://img.shields.io/github/release/autero1/action-terraform)](https://github.com/autero1/action-terraform/releases/latest)
[![GitHub release date](https://img.shields.io/github/release-date/autero1/action-terraform.svg)](https://github.com/autero1/action-terraform/releases)
![Test Action](https://github.com/autero1/action-terraform/workflows/Test%20Action/badge.svg?branch=main&event=push)
[![CodeFactor](https://www.codefactor.io/repository/github/autero1/action-terraform/badge)](https://www.codefactor.io/repository/github/autero1/action-terraform)

# Setup Terraform GitHub Action

Set up your GitHub Actions workflow with a specific version of [Terraform](https://www.terraform.io/).

## Special Notice
From version v3.0.0, the inputs and outputs are changed to dash-separated version (`terraform-version`, `terraform-version-file`, `terraform-path`).

This convention aligns with the YAML style guide and is more prevalent in the GitHub Actions community and documentation.

## Usage

The next example step will install Terraform 1.2.8.

```yaml
name: Example workflow

on: [push]

jobs:
  example:
    name: Example Terraform interaction
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Terraform
        uses: autero1/action-terraform@v3
        with:
          terraform-version: 1.2.8
      - name: Interact with Terraform
        run: terraform --version
```
If you want to use a version file, e.g. `.terraform-version`, you can use the following example:

```yaml
name: Example workflow

on: [push]

jobs:
  example:
    name: Example Terraform interaction
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Terraform
        uses: autero1/action-terraform@v3
        with:
          terraform-version-file: .terraform-version
      - name: Interact with Terraform
        run: terraform --version
```

### Inputs

| Parameter                | Description | Required |
|--------------------------| ----------- | -------- |
| `terraform-version`      | Terraform [version](https://releases.hashicorp.com/terraform/) to deploy | either version or version file required |
| `terraform-version-file` | File containing the Terraform version to install. | either version or version file required |

### Outputs

| Parameter        | Description |
|------------------| ----------- |
| `terraform-path` | Cached tool path of Terraform |

### Supported platforms

This action has been tested on the following platforms:

* ubuntu-22.04
* windows-latest
* macos-latest


## Contributing

Contributions to this repository are very welcome! We follow a fairly standard [pull request process](
https://help.github.com/articles/about-pull-requests/) for contributions, subject to the following guidelines:

1. File a GitHub issue
1. Fork the repository
1. Update the documentation
1. Update the tests
1. Update the code
1. Create a pull request
1. (Merge and release)

The maintainers for this repo will review your code and provide feedback. If everything looks good, they will merge the
code and release a new version, which you'll be able to find in the [releases page](../../releases).

## License

The scripts and documentation in this project are released under the [MIT](./LICENSE) license.
