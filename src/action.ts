import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import {getInputs, getOutputs} from './get-inputs-and-outputs';

const executableName = 'terraform';
const downloadUrlFormat =
  'https://releases.hashicorp.com/terraform/%s/terraform_%s_%s_amd64.zip';

export function getExecutableExtension(): string {
  if (os.type().match(/^Win/)) {
    return '.exe';
  }
  return '';
}

export function getDownloadURL(version: string): string {
  switch (os.type()) {
    case 'Windows_NT':
      return util.format(downloadUrlFormat, version, version, 'windows');

    case 'Darwin':
      return util.format(downloadUrlFormat, version, version, 'darwin');

    case 'Linux':
    default:
      return util.format(downloadUrlFormat, version, version, 'linux');
  }
}

const walkSync = function(
  dir: string,
  filelist: string[],
  fileToFind: string
): string[] {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist, fileToFind);
    } else {
      core.debug(file);
      if (file == fileToFind) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

export function findExecutable(rootFolder: string): string {
  fs.chmodSync(rootFolder, '777');
  const filelist: string[] = [];
  walkSync(rootFolder, filelist, executableName + getExecutableExtension());
  if (!filelist) {
    throw new Error(
      util.format('Terraform executable not found in path ', rootFolder)
    );
  } else {
    return filelist[0];
  }
}

export async function downloadTerraform(version: string): Promise<string> {
  core.info(`[INFO] Setting up Terraform version: '${version}'`);
  let cachedToolpath = toolCache.find(executableName, version);
  if (!cachedToolpath) {
    let dlPath: string;
    const dlURL = getDownloadURL(version);
    core.info(`[INFO] Downloading from: '${dlURL}'`);
    try {
      dlPath = await toolCache.downloadTool(dlURL);
    } catch (exception) {
      throw new Error(util.format('Failed to download Terraform from ', dlURL));
    }

    // Changing temp path permissions
    fs.chmodSync(dlPath, '777');
    const unzippedPath = await toolCache.extractZip(dlPath);
    core.info(`[INFO] Unzipped to: '${unzippedPath}'`);

    // Make it executable
    const absExecutable = `${unzippedPath}/${executableName}`;
    core.info(`[INFO] Setting file permissions 755 to: '${absExecutable}'`);
    fs.chmodSync(absExecutable, '755');

    // Cache the tool
    cachedToolpath = await toolCache.cacheDir(
      unzippedPath,
      executableName,
      version
    );
  }

  const executablePath = findExecutable(cachedToolpath);
  if (!executablePath) {
    throw new Error(
      util.format('Terraform executable not found in path ', cachedToolpath)
    );
  }

  fs.chmodSync(executablePath, '777');
  return executablePath;
}

export async function run(): Promise<void> {
  const terraformVersion: string = getInputs().TerraformVersion;
  const cachedPath = await downloadTerraform(terraformVersion);

  // Add the cached tool to path
  core.addPath(path.dirname(cachedPath));
  core.info(
    `[INFO] Terraform version: '${terraformVersion}' has been cached at ${cachedPath}`
  );
  core.setOutput(getOutputs().TerraformPath, cachedPath);
}
