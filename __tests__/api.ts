import { ApiInstance, GlobalConfigDto, SetGlobalConfig } from "../src/api";
// @ts-ignore
import { execPath, newWorkdir } from "./init";
import { BililiveRecService } from "../src/service";

describe("api", () => {
  const service = new BililiveRecService({
    execPath,
    workdir: newWorkdir(),
  });
  let api: ApiInstance;

  beforeAll(async () => {
    const [bililiveRec] = await service.start();
    api = bililiveRec.ctx.api;
    console.log("service.workdir", service.workdir);
  }, 10000);

  afterAll(() => service.stop());

  test("api.getVersion", async () => {
    await expect(api.getVersion()).resolves.toEqual(
      expect.objectContaining({
        major: "1",
        minor: "3",
      })
    );
  });

  test("api.getDefaultConfig", async () => {
    await expect(api.getDefaultConfig()).resolves.toEqual(
      expect.objectContaining({
        recordFilenameFormat:
          "{roomid}-{name}/录制-{roomid}-{date}-{time}-{ms}-{title}.flv",
      })
    );
  });

  test("api.getGlobalConfig & api.setGlobalConfig", async () => {
    const initConfig = {
      optionalCuttingMode: {
        hasValue: false,
        value: 0,
      },
      optionalRecordDanmaku: {
        hasValue: false,
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
      expect.objectContaining(initConfig)
    );

    await expect(api.setGlobalConfig(targetConfig)).resolves.toEqual(
      expect.objectContaining(targetConfig)
    );
  });
});
