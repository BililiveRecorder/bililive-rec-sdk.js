import 'jest-extended';

import path from "path";
import os from "os";
import fs from "fs";

export const execPath =
  process.env.EXEC_PATH ||
  path.resolve(
    os.homedir(),
    "projects/github.com/Bililive/BililiveRecorder/BililiveRecorder.Cli/bin/Debug/net6.0/BililiveRecorder.Cli"
  );

export const workdirsParent = process.env.WORKDIR_PREFIX || "data";
export const newWorkdir = () => {
  const dir = path.join(workdirsParent, Math.random().toString(36).slice(2));
  fs.mkdirSync(dir);
  return dir;
};
