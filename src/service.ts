import { ChildProcessWithoutNullStreams, spawn } from "child_process";

import portfinder from "portfinder";

import { BililiveRec } from "./sdk";
import { env, separatedPromise } from "./utils";
import { Webhook, WebhookOptions } from "./webhook";

export interface ServiceOptions {
  host?: string;
  port?: number;
  binPath?: string;
  workdir?: string;
  webhook?: true | WebhookOptions;
  extArgs?: string[];
  portable?: boolean;
}

export class BililiveRecService {
  private constructor(
    public host: string,
    public port: number,
    public binPath: string,
    public workdir: string,
    public bililiveRec: BililiveRec,
    public webhook: Webhook | null,
    public process: ChildProcessWithoutNullStreams
  ) {}
  static async create(options?: ServiceOptions): Promise<BililiveRecService> {
    const host = options?.host ?? env("BL_REC_API_HOST") ?? "localhost";
    const binPath =
      options?.binPath ?? env("BL_REC_PATH") ?? "BililiveRecorder.Cli";
    const workdir = options?.workdir ?? env("BL_REC_WORKDIR") ?? process.cwd();
    const port =
      options?.port ||
      env("BL_REC_API_PORT", "int") ||
      (await portfinder.getPortPromise({ host, port: 1453 }));
    const whOpts = options?.webhook;
    let webhook: Webhook | null = null;
    if (whOpts)
      webhook =
        whOpts === true ? await Webhook.create() : await Webhook.create(whOpts);

    const recProcess = spawn(binPath, [
      options?.portable ? "portable" : "run",
      "--http-bind",
      `http://${host}:${port}`,
      workdir,
      ...(options?.extArgs ?? []),
    ]);

    const apiHost = host === "0.0.0.0" ? "127.0.0.1" : host;
    const bililiveRec = new BililiveRec({
      httpUrl: `http://${apiHost}:${port}`,
    });

    const waitProcess = separatedPromise<void>();
    recProcess.once("exit", waitProcess.reject);
    const dataListener = (chunk: Buffer) => {
      if (!chunk.includes("Content root path")) return;
      recProcess.stdout.removeListener("data", dataListener);
      waitProcess.resolve();
    };
    recProcess.stdout.addListener("data", dataListener);
    await waitProcess.promise;

    if (webhook)
      await bililiveRec.setConfig({
        optionalWebHookUrlsV2: {
          hasValue: true,
          value: webhook.getUrl(),
        },
      });

    return new BililiveRecService(
      host,
      port,
      binPath,
      workdir,
      bililiveRec,
      webhook,
      recProcess
    );
  }
  async stop() {
    await this.webhook?.stop();
    this.process.kill("SIGTERM");
  }
}
