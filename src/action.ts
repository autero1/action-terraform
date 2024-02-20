import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import got from 'got';
import {getInputs, getOutputs} from './get-inputs-and-outputs';

const executableName = 'terraform';
const tfCheckpointApiUrl =
  'https://checkpoint-api.hashicorp.com/v1/check/terraform';
const downloadUrlFormat =
  'https://releases.hashicorp.com/terraform/%s/terraform_%s_%s_amd64.zip';

export function getExecutableExtension(): string {
  core.info(`[INFO] OS Type: '${os.type()}'`);
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

type ResponseBody = {
  current_version: string;
};

export const getLatestVersion = async (): Promise<string | null> => {
  try {
    const response = await got.get(tfCheckpointApiUrl, {followRedirect: false});
    const responseBody: ResponseBody = JSON.parse(response.body);
    return responseBody.current_version;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get the latest version: ${error.message}`);
    }
    throw new Error('Failed to get the latest version');
  }
};
const walkSync = function (
  dir: string,
  filelist: string[],
  fileToFind: string
): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist, fileToFind);
    } else {
      core.debug(file);
      if (file === fileToFind) {
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
  if (filelist.length === 0) {
    throw new Error(
      util.format('Terraform executable not found in path ', rootFolder)
    );
  } else {
    return filelist[0];
  }
}

export async function downloadTerraform(theVersion: string): Promise<string> {
  core.info(`[INFO] Setting up Terraform version: '${theVersion}'`);

  let actualVersion = theVersion;

  // Get latest version number and reassign version param to it.
  if (theVersion.toLowerCase() === 'latest') {
    const latestVersion = await getLatestVersion();
    actualVersion = latestVersion || '';
    core.info(`[INFO] Latest Terraform version: '${actualVersion}'`);
  }

  let cachedToolpath = toolCache.find(executableName, actualVersion);
  if (!cachedToolpath) {
    let dlPath: string;
    const dlURL = getDownloadURL(actualVersion);
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

    // Make it executable: NOTE: we don't need to do this, but adding for future ref
    // const absExecutable = `${unzippedPath}${path.sep}${fullExecutableName}`;
    // core.info(`[INFO] Setting file permissions 755 to: '${absExecutable}'`);
    // fs.chmodSync(absExecutable, '755');

    // Cache the tool
    cachedToolpath = await toolCache.cacheDir(
      unzippedPath,
      executableName,
      actualVersion
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
