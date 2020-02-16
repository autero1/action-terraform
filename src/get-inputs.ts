import * as core from '@actions/core';
import {Inputs} from './interfaces';

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
