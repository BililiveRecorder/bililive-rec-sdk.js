//
// DO NOT EDIT THIS FILE
//
// It is automatically generated by "src/api-generator"
//
import { AxiosInstance, AxiosRequestConfig, Method } from "axios";

import {
  CreateRoomDto,
  DefaultConfig,
  FileApiResult,
  FileNameTemplateOutput,
  GenerateFileNameInput,
  GlobalConfigDto,
  RecorderVersion,
  RoomConfigDto,
  RoomDto,
  RoomIOStatsDto,
  RoomRecordingStatsDto,
  SetGlobalConfig,
  SetRoomConfig,
} from "./types.js";

const genApi = function (url: string, method: Method, pathParam?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (this: ApiInstance, resId: any, payload?: any): any {
    if (pathParam) {
      url = url.replace(`{${pathParam}}`, resId);
    } else {
      payload = resId;
    }

    const config: Partial<AxiosRequestConfig> = { method, url };

    if (method === "get") {
      config.params = payload;
    } else if (method === "post") {
      config.data = payload;
    }

    return this.axios.request(config).then((resp) => resp.data);
  };
};

export class ApiInstance {
  constructor(public axios: AxiosInstance) {}

  // 获取软件默认设置
  getDefaultConfig = genApi(
    "/api/config/default",
    "get",
  ) as () => Promise<DefaultConfig>;

  // 获取全局设置
  getGlobalConfig = genApi(
    "/api/config/global",
    "get",
  ) as () => Promise<GlobalConfigDto>;

  // 设置全局设置
  setGlobalConfig = genApi("/api/config/global", "post") as (
    payload: Partial<SetGlobalConfig>,
  ) => Promise<GlobalConfigDto>;

  // 获取录播目录文件信息
  getFile = genApi("/api/file", "get", "path") as (
    path: string,
  ) => Promise<FileApiResult>;

  // 根据传入参数生成录播文件名
  generateFilename = genApi("/api/misc/generatefilename", "post") as (
    payload: GenerateFileNameInput,
  ) => Promise<FileNameTemplateOutput>;

  // 列出所有直播间
  listRooms = genApi("/api/room", "get") as () => Promise<RoomDto[]>;

  // 添加直播间
  addRoom = genApi("/api/room", "post") as (
    payload: CreateRoomDto,
  ) => Promise<RoomDto>;

  // 删除直播间
  removeRoomByRoomId = genApi("/api/room/{roomId}", "delete", "roomId") as (
    roomId: number,
  ) => Promise<RoomDto>;

  // 读取一个直播间
  getRoomByRoomId = genApi("/api/room/{roomId}", "get", "roomId") as (
    roomId: number,
  ) => Promise<RoomDto>;

  // 删除直播间
  removeRoomByObjectId = genApi(
    "/api/room/{objectId}",
    "delete",
    "objectId",
  ) as (objectId: string) => Promise<RoomDto>;

  // 读取一个直播间
  getRoomByObjectId = genApi("/api/room/{objectId}", "get", "objectId") as (
    objectId: string,
  ) => Promise<RoomDto>;

  // 读取直播间录制统计信息
  getRoomRecordingStatsByRoomId = genApi(
    "/api/room/{roomId}/stats",
    "get",
    "roomId",
  ) as (roomId: number) => Promise<RoomRecordingStatsDto>;

  // 读取直播间录制统计信息
  getRoomRecordingStatsByObjectId = genApi(
    "/api/room/{objectId}/stats",
    "get",
    "objectId",
  ) as (objectId: string) => Promise<RoomRecordingStatsDto>;

  // 读取直播间 IO 统计信息
  getRoomIoStatsByRoomId = genApi(
    "/api/room/{roomId}/iostats",
    "get",
    "roomId",
  ) as (roomId: number) => Promise<RoomIOStatsDto>;

  // 读取直播间 IO 统计信息
  getRoomIoStatsByObjectId = genApi(
    "/api/room/{objectId}/iostats",
    "get",
    "objectId",
  ) as (objectId: string) => Promise<RoomIOStatsDto>;

  // 读取直播间设置
  getRoomConfigByRoomId = genApi(
    "/api/room/{roomId}/config",
    "get",
    "roomId",
  ) as (roomId: number) => Promise<RoomConfigDto>;

  // 修改直播间设置
  setRoomConfigByRoomId = genApi(
    "/api/room/{roomId}/config",
    "post",
    "roomId",
  ) as (
    roomId: number,
    payload: Partial<SetRoomConfig>,
  ) => Promise<RoomConfigDto>;

  // 读取直播间设置
  getRoomConfigByObjectId = genApi(
    "/api/room/{objectId}/config",
    "get",
    "objectId",
  ) as (objectId: string) => Promise<RoomConfigDto>;

  // 修改直播间设置
  setRoomConfigByObjectId = genApi(
    "/api/room/{objectId}/config",
    "post",
    "objectId",
  ) as (
    objectId: string,
    payload: Partial<SetRoomConfig>,
  ) => Promise<RoomConfigDto>;

  // 开始录制
  startRecordByRoomId = genApi(
    "/api/room/{roomId}/start",
    "post",
    "roomId",
  ) as (roomId: number) => Promise<RoomDto>;

  // 开始录制
  startRecordByObjectId = genApi(
    "/api/room/{objectId}/start",
    "post",
    "objectId",
  ) as (objectId: string) => Promise<RoomDto>;

  // 停止录制
  stopRecordByRoomId = genApi("/api/room/{roomId}/stop", "post", "roomId") as (
    roomId: number,
  ) => Promise<RoomDto>;

  // 停止录制
  stopRecordByObjectId = genApi(
    "/api/room/{objectId}/stop",
    "post",
    "objectId",
  ) as (objectId: string) => Promise<RoomDto>;

  // 手动分段
  splitRecordByRoomId = genApi(
    "/api/room/{roomId}/split",
    "post",
    "roomId",
  ) as (roomId: number) => Promise<RoomDto>;

  // 手动分段
  splitRecordByObjectId = genApi(
    "/api/room/{objectId}/split",
    "post",
    "objectId",
  ) as (objectId: string) => Promise<RoomDto>;

  // 刷新直播间信息
  refreshRoomByRoomId = genApi(
    "/api/room/{roomId}/refresh",
    "post",
    "roomId",
  ) as (roomId: number) => Promise<RoomDto>;

  // 刷新直播间信息
  refreshRoomByObjectId = genApi(
    "/api/room/{objectId}/refresh",
    "post",
    "objectId",
  ) as (objectId: string) => Promise<RoomDto>;

  // 读取软件版本信息
  getVersion = genApi("/api/version", "get") as () => Promise<RecorderVersion>;
}
