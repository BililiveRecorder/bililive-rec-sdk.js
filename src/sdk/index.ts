import {
  CreateRoomDto,
  FileNameTemplateContextDto,
  FileNameTemplateOutput,
  RoomConfigDto,
  RoomDto,
  SetGlobalConfig,
  SetRoomConfig,
} from "../api";

import { SdkBase, SdkContext, SdkCtxOptions } from "./base";
import { rawBiliLiveData } from "./raw-data.js";

export class Room extends SdkBase implements RoomDto {
  private config?: RoomConfigDto;
  constructor(public parent: BililiveRec, private roomInfo: RoomDto) {
    super(parent.ctx);
  }

  get objectId() {
    return this.roomInfo.objectId;
  }
  get roomId() {
    return this.roomInfo.roomId;
  }
  get autoRecord() {
    return this.roomInfo.autoRecord;
  }
  get shortId() {
    return this.roomInfo.shortId;
  }
  get name() {
    return this.roomInfo.name;
  }
  get title() {
    return this.roomInfo.title;
  }
  get areaNameParent() {
    return this.roomInfo.areaNameParent;
  }
  get areaNameChild() {
    return this.roomInfo.areaNameChild;
  }
  get recording() {
    return this.roomInfo.recording;
  }
  get streaming() {
    return this.roomInfo.streaming;
  }
  get danmakuConnected() {
    return this.roomInfo.danmakuConnected;
  }
  get autoRecordForThisSession() {
    return this.roomInfo.autoRecordForThisSession;
  }
  get recordingStats() {
    return this.roomInfo.recordingStats;
  }
  get ioStats() {
    return this.roomInfo.ioStats;
  }

  async transferTo(target: BililiveRec, newConfig?: Partial<SetRoomConfig>) {
    if (target.ctx === this.parent.ctx)
      throw `can't transfer to same instance: ${target.ctx.identity}`;
    const config = { ...newConfig, ...(await this.getConfig()) };

    const { recording } = await this.refresh();
    if (recording) throw `recording`;

    const roomInfo = await target.ctx.api.addRoom({
      roomId: this.roomId,
      autoRecord: false,
    });
    const latestConfig = await target.ctx.api.setRoomConfigByRoomId(
      this.roomId,
      config
    );

    await this.remove();

    this.parent = target;
    this.ctx = target.ctx;
    this.config = latestConfig;
    this.roomInfo = roomInfo;
    this.parent.roomCache.cache[this.roomId] = this;
  }

  async remove() {
    const result = await this.ctx.api.removeRoomByObjectId(this.objectId);
    this.parent.roomCache.clear(this.roomId);
    return result;
  }
  async refresh() {
    this.roomInfo = await this.ctx.api.getRoomByObjectId(this.objectId);
    return this;
  }
  async refreshRecordingStats() {
    return this.roomInfo.recordingStats = await this.ctx.api.getRoomRecordingStatsByObjectId(this.objectId);
  }
  async refreshIoStats() {
    return this.roomInfo.ioStats = await this.ctx.api.getRoomIoStatsByObjectId(this.objectId);
  }
  getConfig() {
    if (this.config) return this.config;
    return this.ctx.api.getRoomConfigByObjectId(this.objectId);
  }
  async setConfig(config: Partial<SetRoomConfig>) {
    const result = await this.ctx.api.setRoomConfigByObjectId(this.objectId, config);
    delete this.config
    return result
  }
  async start() {
    this.roomInfo = await this.ctx.api.startRecordByObjectId(this.objectId);
    return this;
  }
  async stop() {
    this.roomInfo = await this.ctx.api.stopRecordByObjectId(this.objectId);
    return this;
  }
  async split() {
    this.roomInfo = await this.ctx.api.splitRecordByObjectId(this.objectId);
    return this;
  }
}

class RoomCache {
  public cache: Record<number, Room> = [];
  constructor(private recInstance: BililiveRec) { }
  add(d: RoomDto): Room {
    let room = this.cache[d.roomId];
    if (room) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.assign(room.roomInfo, d)
      return room
    }

    room = new Room(this.recInstance, d);
    this.cache[room.roomId] = room;
    return room;
  }
  get(roomId: number) {
    return this.cache[roomId];
  }
  clear(roomId: number) {
    delete this.cache[roomId];
  }
}

export class BililiveRec extends SdkBase {
  public roomCache = new RoomCache(this);
  constructor(opts: SdkCtxOptions) {
    super(new SdkContext(opts));
  }
  defaultConfig() {
    return this.ctx.api.getDefaultConfig();
  }
  getConfig() {
    return this.ctx.api.getGlobalConfig();
  }
  setConfig(config: Partial<SetGlobalConfig>) {
    return this.ctx.api.setGlobalConfig(config);
  }
  listRooms(): Promise<Room[]> {
    return this.ctx.api
      .listRooms()
      .then((l) => l.map((d) => this.roomCache.add(d)));
  }
  async refreshRooms(): Promise<void> {
    await this.listRooms()
  }
  addRoom(config: CreateRoomDto) {
    return this.ctx.api.addRoom(config).then((d) => this.roomCache.add(d));
  }
  async fetchRoom(roomId: number) {
    return (
      this.roomCache.get(roomId) ||
      this.roomCache.add(await this.ctx.api.getRoomByRoomId(roomId))
    );
  }
  version() {
    return this.ctx.api.getVersion();
  }
  generateFilename({ template, context }: { template: string, context?: Partial<FileNameTemplateContextDto> }): Promise<FileNameTemplateOutput> {
    return this.ctx.api.generateFilename({
      template,
      context: {
        roomId: 8760033,
        shortId: 1453,
        name: "小司无常",
        title: "【小司无常】今天来教大家计算 20 - 1",
        areaParent: "电台",
        areaChild: "聊天电台",
        qn: 10000,
        json: JSON.stringify(rawBiliLiveData),
        ...context,
      }
    })
  }
  getFile(path: string) {
    return this.ctx.api.getFile(path);
  }
}
