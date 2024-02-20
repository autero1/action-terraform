import {Inputs, Outputs} from '../src/interfaces';
import {getInputs, getOutputs} from '../src/get-inputs-and-outputs';
import assert from 'node:assert/strict';
import {afterEach, beforeEach, describe, it, mock} from 'node:test';

beforeEach(() => {
  mock.reset();
});

afterEach(() => {
  delete process.env['INPUT_TERRAFORM-VERSION'];
  delete process.env['INPUT_TERRAFORM-VERSION-FILE'];
  delete process.env['GITHUB_WORKSPACE'];
});

describe('getInputs()', () => {
  it('should get proper value from version input', () => {
    process.env['INPUT_TERRAFORM-VERSION'] = '1.5.7';

    const inputs: Inputs = getInputs();

    assert.strictEqual(inputs.TerraformVersion, '1.5.7');
  });

  it('should get proper value from input version file only', () => {
    process.env['GITHUB_WORKSPACE'] = './test';
    process.env['INPUT_TERRAFORM-VERSION-FILE'] = '.terraform-version';

    const inputs: Inputs = getInputs();

    assert.strictEqual(inputs.TerraformVersion, '1.5.6');
  });

  it('should get proper value from input version and version-file', () => {
    process.env['INPUT_TERRAFORM-VERSION'] = '1.5.5';
    process.env['INPUT_TERRAFORM-VERSION-FILE'] = '.terraform-version';

    const inputs: Inputs = getInputs();

    assert.strictEqual(inputs.TerraformVersion, '1.5.5');
  });

  it('should get proper value from neither input version or version-file', () => {
    const inputs: Inputs = getInputs();
    assert.strictEqual(inputs.TerraformVersion, '');
  });

  it('should get spec outputs', () => {
    const outputs: Outputs = getOutputs();

    assert.strictEqual(outputs.TerraformPath, 'terraform-path');
  });
});
