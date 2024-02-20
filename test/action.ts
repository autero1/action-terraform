import * as assert from 'assert';
import os from 'node:os';
import got from 'got';
import {getDownloadURL, getLatestVersion} from '../src/action';
import {afterEach, describe, it, mock} from 'node:test';

afterEach(() => {
  delete process.env['INPUT_TERRAFORM-VERSION'];
  delete process.env['INPUT_TERRAFORM-VERSION-FILE'];
  delete process.env['GITHUB_WORKSPACE'];
  mock.reset();
  mock.restoreAll();
});

async function checkHead(url: string): Promise<number> {
  const response = await got.get(url, {followRedirect: false});
  return response.statusCode;
}

describe('getDownloadURL()', () => {
  it('get windows url', async () => {
    mock.method(os, 'type', () => {
      return 'Windows_NT';
    });
    mock.method(os, 'arch', () => {
      return 'x64';
    });
    const winDLUrl = getDownloadURL('0.12.20');
    assert.strictEqual(
      winDLUrl,
      'https://releases.hashicorp.com/terraform/0.12.20/terraform_0.12.20_windows_amd64.zip'
    );
    assert.strictEqual(await checkHead(winDLUrl), 200);
  });

  it('get darwin url', async () => {
    mock.method(os, 'type', () => {
      return 'Darwin';
    });
    mock.method(os, 'arch', () => {
      return 'x64';
    });

    const darwinDLUrl = getDownloadURL('0.12.20');
    assert.strictEqual(
      darwinDLUrl,
      'https://releases.hashicorp.com/terraform/0.12.20/terraform_0.12.20_darwin_amd64.zip'
    );
    assert.strictEqual(await checkHead(darwinDLUrl), 200);
  });

  it('get linux url', async () => {
    mock.method(os, 'type', () => {
      return 'Linux';
    });
    mock.method(os, 'arch', () => {
      return 'x64';
    });
    const linuxDLUrl = getDownloadURL('0.12.20');
    assert.strictEqual(
      linuxDLUrl,
      'https://releases.hashicorp.com/terraform/0.12.20/terraform_0.12.20_linux_amd64.zip'
    );
    assert.strictEqual(await checkHead(linuxDLUrl), 200);
  });

  it('get latest url', async () => {
    process.env['INPUT_TERRAFORM-VERSION'] = 'latest';
    const latestVersion = (await getLatestVersion()) || '';
    mock.method(os, 'type', () => {
      return 'Linux';
    });
    mock.method(os, 'arch', () => {
      return 'x64';
    });
    const linuxDLUrl = getDownloadURL(latestVersion);
    assert.strictEqual(await checkHead(linuxDLUrl), 200);
  });
});
