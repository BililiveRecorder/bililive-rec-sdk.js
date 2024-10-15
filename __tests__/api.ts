import { ApiInstance, SetGlobalConfig } from "../src/api/index.js";
import { BililiveRecService } from "../src/service.js";

import { binPath, newWorkdir } from "./init.js";

describe("api", () => {
  let service: BililiveRecService;
  let api: ApiInstance;

  beforeAll(async () => {
    service = await BililiveRecService.create({
      binPath,
      workdir: newWorkdir(),
      portable: true,
    });
    api = service.bililiveRec.ctx.api;
    console.log("service.workdir", service.workdir);
  });

  afterAll(() => service.stop());

  test("getVersion", async () => {
    await expect(api.getVersion()).resolves.toEqual(
      expect.objectContaining({
        major: "2",
        minor: "1",
      }),
    );
  });

  test("getDefaultConfig", async () => {
    await expect(api.getDefaultConfig()).resolves.toEqual(
      expect.objectContaining({
        fileNameRecordTemplate:
          '{{ roomId }}-{{ name }}/录制-{{ roomId }}-{{ "now" | time_zone: "Asia/Shanghai" | format_date: "yyyyMMdd-HHmmss-fff" }}-{{ title }}.flv',
      }),
    );
  });

  test("getGlobalConfig & setGlobalConfig", async () => {
    const initConfig = {
      optionalCuttingMode: {
        hasValue: false,
        value: 0,
      },
      optionalRecordDanmaku: {
        hasValue: true,
        value: false,
      },
      optionalWebHookUrlsV2: {
        hasValue: false,
        value: null,
      },
    };

    const targetConfig: Partial<SetGlobalConfig> = {
      optionalCuttingMode: {
        hasValue: false,
        value: 0,
      },
      optionalRecordDanmaku: {
        hasValue: false,
        value: false,
      },
      optionalWebHookUrlsV2: {
        hasValue: true,
        value: "http://localhost:12345/test",
      },
    };

    await expect(api.getGlobalConfig()).resolves.toEqual(
      expect.objectContaining(initConfig),
    );

    await expect(api.setGlobalConfig(targetConfig)).resolves.toEqual(
      expect.objectContaining(targetConfig),
    );
  });
});
