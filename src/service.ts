import { BililiveRec } from "./sdk";
import portfinder from "portfinder";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export interface ServiceOptions {
  httpHost?: string;
  httpPort?: number;
  execPath?: string;
  workdir?: string;
}

export class BililiveRecService {
  httpHost?: string;
  httpPort?: number;
  execPath?: string;
  workdir?: string;
  bililiveRec?: BililiveRec;
  process?: ChildProcessWithoutNullStreams;
  constructor(private options?: ServiceOptions) {}
  async start(): Promise<
    [bililiveRec: BililiveRec, process: ChildProcessWithoutNullStreams]
  > {
    this.httpHost =
      this.options?.httpHost ?? process.env.HTTP_HOST ?? "localhost";
    this.httpPort =
      this.options?.httpPort ||
      Number(process.env.HTTP_PORT) ||
      (await portfinder.getPortPromise({ host: this.httpHost, port: 1453 }));
    this.execPath =
      this.options?.execPath ?? process.env.EXEC_PATH ?? "BililiveRecorder.Cli";
    this.workdir =
      this.options?.workdir ?? process.env.WORKDIR ?? process.cwd();

    const recProcess = spawn(this.execPath, [
      "run",
      "--web-bind",
      `http://${this.httpHost}:${this.httpPort}`,
      this.workdir,
    ]);

    const bililiveRec = new BililiveRec({
      httpUrl: `http://${
        this.httpHost === "0.0.0.0" ? "127.0.0.1" : this.httpHost
      }:${this.httpPort}`,
    });

    return new Promise((resolve, reject) => {
      recProcess?.once("exit", reject);
      recProcess?.stdout.on("data", (chunk: Buffer) => {
        if (!chunk.includes("Content root path")) return;
        this.process = recProcess;
        this.bililiveRec = bililiveRec;
        resolve([bililiveRec, recProcess]);
      });
    });
  }
  stop(): void {
    this.process?.kill("SIGTERM");
  }
}

export const startService = (opts?: ServiceOptions) =>
  new BililiveRecService(opts).start();
