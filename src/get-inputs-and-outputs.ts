import * as core from '@actions/core';
import {Inputs, Outputs} from './interfaces';
import * as path from 'path';
import fs from 'fs';

export function getTerraformVersionFromFile(versionFilePath: string): string {
  if (!fs.existsSync(versionFilePath)) {
    throw new Error(
      `The specified Terraform version file at: ${versionFilePath} does not exist`
    );
  }

  const contents = fs.readFileSync(versionFilePath, 'utf8');
  return contents.trim().replace(/\r?\n|\r/g, '');
}

function showInputs(inps: Inputs): void {
  core.info(`[INFO] TerraformVersion: ${inps.TerraformVersion}`);
}

function prepareInputs(tfVersion: string): Inputs {
  const inps: Inputs = {
    TerraformVersion: tfVersion
  };

  showInputs(inps);

  return inps;
}

export function getInputs(): Inputs {
  let tfVersion = core.getInput('terraform-version');
  const tfVersionFile = core.getInput('terraform-version-file');

  if (tfVersion && tfVersionFile) {
    core.warning(
      '[WARN] Both terraform-version and terraform-version-file inputs are specified, only terraform-version will be used'
    );
    return prepareInputs(tfVersion);
  }

  if (tfVersionFile) {
    const versionFilePath = path.join(
      process.env.GITHUB_WORKSPACE!,
      tfVersionFile
    );

    tfVersion = getTerraformVersionFromFile(versionFilePath);
  }
  return prepareInputs(tfVersion);
}

export function getOutputs(): Outputs {
  const outs: Outputs = {
    TerraformPath: 'terraform-path'
  };

  return outs;
}
