/// <reference types="jest" />
import "./init";
import * as utils from "../src/utils";

describe("utils", () => {
  test("generateExampleFilename", () => {
    expect(
      utils.generateExampleFilename(
        "{roomid}-{name}/录制-{roomid}-{date}-{time}-{ms}-{title}.flv"
      )
    ).toStartWith("14846654-小司无常/录制-14846654-");

    expect(utils.generateExampleFilename("-{title}")).toEndWith(
      "-【小司无常】今天来教大家计算 20 - 1.flv"
    );
  });

  test("getRoomId", () => {
    expect(utils.getRoomId("https://live.bilibili.com/14846654")).toBe(
      14846654
    );
    expect(
      utils.getRoomId("https://live.bilibili.com/14846654?search=42#hash")
    ).toBe(14846654);
    expect(utils.getRoomId("14846654")).toBe(14846654);
    expect(utils.getRoomId(14846654)).toBe(14846654);
    expect(() => utils.getRoomId("a14846654")).toThrow("get roomid failed");
  });

  test("validateCookie", () => {
    expect(
      utils.validateCookie(
        "_uuid=b407f63a-055d-458d-8bcb-4580e590b05a08491infoc; buvid3=b407f63a-055d-458d-8bcb-4580e590b05a34759infoc; buvid_fp_plain=b407f63a-055d-458d-8bcb-4580e590b05a34759infoc; LIVE_BUVID=AUTO3472911340282227; SESSDATA=ffffffff%2C000000000%2Cffffffff; bili_jct=9e2f1f8446e609144d58649b3becbfb7; DedeUserID=106978941; DedeUserID__ckMd5=22z4au4dm76fzm1i; sid=l1jtp3xe; fingerprint_s=1c284e6b42fe3c7d8474be3fb2e4cd6d; b_ut=5; buvid_fp=b4030ec481cd5c9028cd2c8b9409e003; buvid4=b407f63a-055d-458d-8bcb-4580e590b05a00000-133706993-Kp8wR12WW5LJ61IZHtW3tQ%3D%3D; i-wanna-go-back=2; nostalgia_conf=-1; fingerprint3=9a6a390bcc9dbcc2f020ee703e2294f5; fingerprint=488ec7503cbd5badde001f334975956e; bp_video_offset_100000000=3750794630458092523; dy_spec_agreed=1; bp_t_offset_100000000=451506386782327464; PVID=1; innersign=0; b_lsid=B407F63A_0E2BECBD1F2"
      )
    ).toBe(true);

    expect(
      utils.validateCookie(
        "_uuid=b407f63a-055d-458d-8bcb-4580e590b05a08491infoc;buvid3=b407f63a-055d-458d-8bcb-4580e590b05a34759infoc;buvid_fp_plain=b407f63a-055d-458d-8bcb-4580e590b05a34759infoc;LIVE_BUVID=AUTO3472911340282227;SESSDATA=ffffffff%2C000000000%2Cffffffff;bili_jct=9e2f1f8446e609144d58649b3becbfb7;DedeUserID=106978941;DedeUserID__ckMd5=22z4au4dm76fzm1i;sid=l1jtp3xe;fingerprint_s=1c284e6b42fe3c7d8474be3fb2e4cd6d;b_ut=5;buvid_fp=b4030ec481cd5c9028cd2c8b9409e003;buvid4=b407f63a-055d-458d-8bcb-4580e590b05a00000-133706993-Kp8wR12WW5LJ61IZHtW3tQ%3D%3D;i-wanna-go-back=2;nostalgia_conf=-1;fingerprint3=9a6a390bcc9dbcc2f020ee703e2294f5;fingerprint=488ec7503cbd5badde001f334975956e;bp_video_offset_100000000=3750794630458092523;dy_spec_agreed=1;bp_t_offset_100000000=451506386782327464;PVID=1;innersign=0;b_lsid=B407F63A_0E2BECBD1F2"
      )
    ).toBe(true);

    expect(
      utils.validateCookie(
        "_uuid=b407f63a-055d-458d-8bcb-4580e590b05a08491infoc;buvid3=b407f63a-055d-458d-8bcb-4580e590b05a34759infoc;buvid_fp_plain=b407f63a-055d-458d-8bcb-4580e590b05a34759infoc;LIVE_BUVID=AUTO3472911340282227;SESS_DATA=ffffffff%2C000000000%2Cffffffff;bili_jct=9e2f1f8446e609144d58649b3becbfb7;DedeUserID=106978941;DedeUserID__ckMd5=22z4au4dm76fzm1i;sid=l1jtp3xe;fingerprint_s=1c284e6b42fe3c7d8474be3fb2e4cd6d;b_ut=5;buvid_fp=b4030ec481cd5c9028cd2c8b9409e003;buvid4=b407f63a-055d-458d-8bcb-4580e590b05a00000-133706993-Kp8wR12WW5LJ61IZHtW3tQ%3D%3D;i-wanna-go-back=2;nostalgia_conf=-1;fingerprint3=9a6a390bcc9dbcc2f020ee703e2294f5;fingerprint=488ec7503cbd5badde001f334975956e;bp_video_offset_100000000=3750794630458092523;dy_spec_agreed=1;bp_t_offset_100000000=451506386782327464;PVID=1;innersign=0;b_lsid=B407F63A_0E2BECBD1F2"
      )
    ).toBe(false);
  });
});
