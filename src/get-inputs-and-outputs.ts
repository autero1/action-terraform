import * as core from '@actions/core';
import {Inputs, Outputs} from './interfaces';

function showInputs(inps: Inputs): void {
  core.info(`[INFO] TerraformVersion: ${inps.TerraformVersion}`);
}

export function getInputs(): Inputs {
  const inps: Inputs = {
    TerraformVersion: core.getInput('terraform_version')
  };

  showInputs(inps);

  return inps;
}

export function getOutputs(): Outputs {
  const outs: Outputs = {
    TerraformPath: 'terraform_path'
  };

  return outs;
}
