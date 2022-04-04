# @bililive/rec-sdk

typescript sdk for Bililive/BililiveRecorder

Intall: 

`yarn add @bililive/rec-sdk`

`npm i @bililive/rec-sdk`

TODO:

- [ ] Test case

## Sdk

Usage: 

```ts
import { BililiveRec } from "@bililive/rec-sdk"

const server = new BililiveRec({ httpUrl: "http://localhost:1453" });
const server2 = new BililiveRec({ httpUrl: "http://localhost:1454" });

await server.setConfig({ ... })

const rooms = await server.listRooms();
const room = await server.getRoomByRoomId(8760033);

await room.start()
await room.split()
await room.stop()

await room.transferTo(server2);

const api = server.ctx.api;
await api.removeRoomByRoomId(10101);
```

Definitions:

```ts
interface SdkCtxOptions {
  httpUrl?: string;
}

class SdkContext {
  axios: AxiosInstance;
  api: ApiInstance;
}

class BililiveRec {
  ctx: SdkContext;
  constructor(opts: SdkCtxOptions);
  defaultConfig(): Promise<DefaultConfig>;
  getConfig(): Promise<GlobalConfigDto>;
  setConfig(config: SetGlobalConfig): Promise<GlobalConfigDto>;
  listRooms(): Promise<Room[]>;
  addRoom(config: CreateRoomDto): Promise<Room>;
  fetchRoom(roomId: number): Promise<Room>;
  version(): Promise<RecorderVersion>;
}

class Room implements RoomDto {
  ...RoomDto,
  ctx: SdkContext;
  parent: BililiveRec;
  transferTo(target: BililiveRec, newConfig?: Partial<SetRoomConfig>): Promise<void>;
  remove(): Promise<RoomDto>;
  refresh(): Promise<this>;
  refreshStats(): Promise<RoomStatsDto>;
  getConfig(): RoomConfigDto | Promise<RoomConfigDto>;
  setConfig(config: SetRoomConfig): Promise<RoomConfigDto>;
  start(): Promise<this>;
  stop(): Promise<this>;
  split(): Promise<this>;
}
```

## Api

Usage:

```ts
import axios from "axios"
import { Api } from "@bililive/rec-sdk"

const api = new Api.ApiInstance(axios.create({ ... }));
```

Definitions:

```ts
class ApiInstance {
  constructor(public axios: AxiosInstance) { }
  // 获取软件默认设置
  getDefaultConfig: () => Promise<DefaultConfig>
  // 获取全局设置
  getGlobalConfig: () => Promise<GlobalConfigDto>
  // 设置全局设置
  setGlobalConfig: (payload: SetGlobalConfig) => Promise<GlobalConfigDto>
  // 列出所有直播间
  listRooms: () => Promise<RoomDto[]>
  // 添加直播间
  addRoom: (payload: CreateRoomDto) => Promise<RoomDto>
  // 删除直播间
  removeRoomByRoomId: (roomId: number) => Promise<RoomDto>
  // 读取一个直播间
  getRoomByRoomId: (roomId: number) => Promise<RoomDto>
  // 删除直播间
  removeRoomByObjectId: (objectId: string) => Promise<RoomDto>
  // 读取一个直播间
  getRoomByObjectId: (objectId: string) => Promise<RoomDto>
  // 读取直播间统计信息
  statsRoomByRoomId: (roomId: number) => Promise<RoomStatsDto>
  // 读取直播间统计信息
  statsRoomByObjectId: (objectId: string) => Promise<RoomStatsDto>
  // 读取直播间设置
  getRoomConfigByRoomId: (roomId: number) => Promise<RoomConfigDto>
  // 修改直播间设置
  setRoomConfigByRoomId: (roomId: number, payload: SetRoomConfig) => Promise<RoomConfigDto>
  // 读取直播间设置
  getRoomConfigByObjectId: (objectId: string) => Promise<RoomConfigDto>
  // 修改直播间设置
  setRoomConfigByObjectId: (objectId: string, payload: SetRoomConfig) => Promise<RoomConfigDto>
  // 开始录制
  startRecordByRoomId: (roomId: number) => Promise<RoomDto>
  // 开始录制
  startRecordByObjectId: (objectId: string) => Promise<RoomDto>
  // 停止录制
  stopRecordByRoomId: (roomId: number) => Promise<RoomDto>
  // 停止录制
  stopRecordByObjectId: (objectId: string) => Promise<RoomDto>
  // 手动分段
  splitRecordByRoomId: (roomId: number) => Promise<RoomDto>
  // 手动分段
  splitRecordByObjectId: (objectId: string) => Promise<RoomDto>
  // 刷新直播间信息
  refreshRoomByRoomId: (roomId: number) => Promise<RoomDto>
  // 刷新直播间信息
  refreshRoomObjectId: (objectId: string) => Promise<RoomDto>
  // 读取软件版本信息
  getVersion: () => Promise<RecorderVersion>
}
```

## Utils

```ts
import { utils } from "@bililive/rec-sdk";

utils.generateExampleFilename("{roomid}/{date}/{time}.flv")
// => "14846654/20201230/080000.flv"

utils.getRoomId("https://live.bilibili.com/14846654?search=42#hash")
// => 14846654

utils.validateCookie("_uuid=ffffff; buvid3=ffffff...")
// => true
```

## Service

```shell
yarn add eventemitter3 express portfinder
yarn add @types/express
```

Environments:

`BL_REC_API_HOST`, `BL_REC_API_PORT`, `BL_REC_PATH`, `BL_REC_WORKDIR`

Usage:

```ts
import { BililiveRecService } from "@bililive/rec-sdk/dist/service";

const service = await BililiveRecService.create({ workdir: "somewhere" });
service.bililiveRec,
service.webhook,
service.process

service.stop();
```

Definitions:

```ts
export interface ServiceOptions {
  host?: string;
  port?: number;
  binPath?: string;
  workdir?: string;
  webhook?: true | WebhookOptions;
}

export class BililiveRecService {
  host: string;
  port: number;
  execPath: string;
  workdir: string;
  bililiveRec: BililiveRec;
  webhook: Webhook | null;
  process: ChildProcessWithoutNullStreams;
  private constructor();
  static create(options?: ServiceOptions): Promise<BililiveRecService>;
  stop(): Promise<void>;
}
```

## Webhook

```shell
yarn add eventemitter3 express portfinder
yarn add @types/express
```

Environments:

`WEBHOOK_HOST`, `WEBHOOK_POST`, `WEBHOOK_PATH_PREFIX`

Usage:

```ts
import { Webhook } from "@bililive/rec-sdk/dist/webhook"

const webhook = await Webhook.create()
const webhook = await Webhook.create({ host: "localhost", port: 9000 })

webhook.getUrl()
// => http://localhost:9000/webhook/default
webhook.getUrl("second-server")
// => http://localhost:9000/webhook/second-server

webhook.on("SessionStarted", (event, instanceId) => {
  console.loe(instanceId);
  // => "second-server"
  console.loe(event);
  // => {
  //   "EventType": "SessionStarted",
  //   "EventTimestamp": "2021-05-14T17:52:44.4960899+08:00",
  //   "EventId": "e3e1c9ec-f386-4bc3-9e5a-661bf3ed2fb2",
  //   "EventData": {
  //     ...
  //   }
  // }
})
```

## Develop

generator api and it's type:

```shell
SWAGGER_URL=http://localhost:1453/swagger/brec/swagger.json yarn gen-api
```

test

```
EXEC_PATH=/path/to/BililiveRecorder.Cli yarn test
```
