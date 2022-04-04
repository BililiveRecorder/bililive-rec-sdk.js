import {
  CreateRoomDto,
  RoomConfigDto,
  RoomDto,
  SetGlobalConfig,
  SetRoomConfig,
} from "../api";

import { SdkCtxOptions, SdkBase, SdkContext } from "./base";

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
  get stats() {
    return this.roomInfo.stats;
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
  async refreshStats() {
    this.roomInfo.stats = await this.ctx.api.statsRoomByObjectId(this.objectId);
    return this.stats;
  }
  getConfig() {
    if (this.config) return this.config;
    return this.ctx.api.getRoomConfigByObjectId(this.objectId);
  }
  setConfig(config: SetRoomConfig) {
    return this.ctx.api.setRoomConfigByObjectId(this.objectId, config);
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
  constructor(private recInstance: BililiveRec) {}
  add(d: RoomDto): Room {
    const room = new Room(this.recInstance, d);
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
  setConfig(config: SetGlobalConfig) {
    return this.ctx.api.setGlobalConfig(config);
  }
  listRooms(): Promise<Room[]> {
    return this.ctx.api
      .listRooms()
      .then((l) => l.map((d) => this.roomCache.add(d)));
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
}
