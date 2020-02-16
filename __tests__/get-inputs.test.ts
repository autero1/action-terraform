import {Inputs} from '../src/interfaces';
import {getInputs} from '../src/get-inputs';

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
});
