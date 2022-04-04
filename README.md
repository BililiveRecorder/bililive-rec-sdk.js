# bililive-rec-sdk.js

typescript sdk for Bililive/BililiveRecorder

TODO:

- [ ] Optional Types
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

## Develop

generator api and it's type:

```shell
SWAGGER_URL=http://localhost:1453/swagger/brec/swagger.json yarn gen-api
```

test

```
EXEC_PATH=/path/to/BililiveRecorder.Cli yarn test
```
