import "jest-extended";

import path from "path";
import os from "os";
import fs from "fs";

process.env.BL_REC_PATH =
  process.env.BL_REC_PATH ||
  path.resolve(
    os.homedir(),
    "projects/github.com/Bililive/BililiveRecorder/BililiveRecorder.Cli/bin/Debug/net6.0/BililiveRecorder.Cli"
  );

export const workdirPrefix = process.env.BL_WORKDIR_PREFIX || "data";
export const newWorkdir = () => {
  const dir = path.join(workdirPrefix, Math.random().toString(36).slice(2));
  fs.mkdirSync(dir);
  return dir;
};
