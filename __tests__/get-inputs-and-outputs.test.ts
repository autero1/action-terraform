import {Inputs, Outputs} from '../src/interfaces';
import {getInputs, getOutputs} from '../src/get-inputs-and-outputs';

beforeEach(() => {
  jest.resetModules();
});

afterEach(() => {
  delete process.env['INPUT_TERRAFORM_VERSION'];
});

describe('getInputs()', () => {
  test('get spec inputs', () => {
    process.env['INPUT_TERRAFORM_VERSION'] = '0.12.20';

    const inputs: Inputs = getInputs();

    expect(inputs.TerraformVersion).toMatch('0.12.20');
  });

  test('get spec outputs', () => {
    const outputs: Outputs = getOutputs();

    expect(outputs.TerraformPath).toMatch('terraform_path');
  });
});
