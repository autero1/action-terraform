import * as os from 'os';
import {getDownloadURL} from '../src/action';

import * as got from 'got';

const theGot = got.default;

jest.mock('os');

async function checkHead(url: string): Promise<number> {
  const response = await theGot.head(url);
  return response.statusCode;
}

describe('getDownloadURL()', () => {
  test('get windows url', async () => {
    const spy = jest.spyOn(os, 'type');
    spy.mockReturnValue('Windows_NT');
    const winDLUrl = getDownloadURL('0.12.20');
    expect(winDLUrl).toBe(
      'https://releases.hashicorp.com/terraform/0.12.20/terraform_0.12.20_windows_amd64.zip'
    );
    expect(await checkHead(winDLUrl)).toEqual(200);
  });

  test('get darwin url', async () => {
    const spy = jest.spyOn(os, 'type');
    spy.mockReturnValue('Darwin');
    const darwinDLUrl = getDownloadURL('0.12.20');
    expect(darwinDLUrl).toBe(
      'https://releases.hashicorp.com/terraform/0.12.20/terraform_0.12.20_darwin_amd64.zip'
    );
    expect(await checkHead(darwinDLUrl)).toEqual(200);
  });

  test('get linux url', async () => {
    const spy = jest.spyOn(os, 'type');
    spy.mockReturnValue('Linux');
    const linuxDLUrl = getDownloadURL('0.12.20');
    expect(linuxDLUrl).toBe(
      'https://releases.hashicorp.com/terraform/0.12.20/terraform_0.12.20_linux_amd64.zip'
    );
    expect(await checkHead(linuxDLUrl)).toEqual(200);
  });
});
