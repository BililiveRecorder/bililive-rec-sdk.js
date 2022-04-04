//
// DO NOT EDIT THIS FILE
//
// It is automatically generated by "src/api-generator"
//
export interface BlOptional<T> {
  hasValue: boolean;
  value: null | T;
}
export interface CreateRoomDto {
  roomId: number;
  autoRecord: boolean;
}

export enum CuttingMode {
  // 禁用
  Disabled = 0,
  // 根据时间切割
  ByTime = 1,
  // 根据文件大小切割
  BySize = 2,
}

export interface DefaultConfig {
  recordMode: RecordMode;
  cuttingMode: CuttingMode;
  cuttingNumber: number;
  recordDanmaku: boolean;
  recordDanmakuRaw: boolean;
  recordDanmakuSuperChat: boolean;
  recordDanmakuGift: boolean;
  recordDanmakuGuard: boolean;
  recordingQuality: string;
  recordFilenameFormat: string;
  webHookUrls: string;
  webHookUrlsV2: string;
  wpfShowTitleAndArea: boolean;
  cookie: string;
  liveApiHost: string;
  timingCheckInterval: number;
  timingStreamRetry: number;
  timingStreamRetryNoQn: number;
  timingStreamConnect: number;
  timingDanmakuRetry: number;
  timingWatchdogTimeout: number;
  recordDanmakuFlushInterval: number;
}

export interface GlobalConfigDto {
  optionalRecordMode: BlOptional<RecordMode>;
  optionalCuttingMode: BlOptional<CuttingMode>;
  optionalCuttingNumber: BlOptional<number>;
  optionalRecordDanmaku: BlOptional<boolean>;
  optionalRecordDanmakuRaw: BlOptional<boolean>;
  optionalRecordDanmakuSuperChat: BlOptional<boolean>;
  optionalRecordDanmakuGift: BlOptional<boolean>;
  optionalRecordDanmakuGuard: BlOptional<boolean>;
  optionalRecordingQuality: BlOptional<string>;
  optionalRecordFilenameFormat: BlOptional<string>;
  optionalWebHookUrls: BlOptional<string>;
  optionalWebHookUrlsV2: BlOptional<string>;
  optionalWpfShowTitleAndArea: BlOptional<boolean>;
  optionalCookie: BlOptional<string>;
  optionalLiveApiHost: BlOptional<string>;
  optionalTimingCheckInterval: BlOptional<number>;
  optionalTimingStreamRetry: BlOptional<number>;
  optionalTimingStreamRetryNoQn: BlOptional<number>;
  optionalTimingStreamConnect: BlOptional<number>;
  optionalTimingDanmakuRetry: BlOptional<number>;
  optionalTimingWatchdogTimeout: BlOptional<number>;
  optionalRecordDanmakuFlushInterval: BlOptional<number>;
}

export enum RecordMode {
  Standard = 0,
  RawData = 1,
}

export interface RecorderVersion {
  major: string;
  minor: string;
  patch: string;
  preReleaseTag: string;
  preReleaseTagWithDash: string;
  preReleaseLabel: string;
  preReleaseLabelWithDash: string;
  preReleaseNumber: string;
  weightedPreReleaseNumber: string;
  buildMetaData: string;
  buildMetaDataPadded: string;
  fullBuildMetaData: string;
  majorMinorPatch: string;
  semVer: string;
  legacySemVer: string;
  legacySemVerPadded: string;
  assemblySemVer: string;
  assemblySemFileVer: string;
  fullSemVer: string;
  informationalVersion: string;
  branchName: string;
  escapedBranchName: string;
  sha: string;
  shortSha: string;
  nuGetVersionV2: string;
  nuGetVersion: string;
  nuGetPreReleaseTagV2: string;
  nuGetPreReleaseTag: string;
  versionSourceSha: string;
  commitsSinceVersionSource: string;
  commitsSinceVersionSourcePadded: string;
  uncommittedChanges: string;
  commitDate: string;
}

export interface RestApiError {
  code: RestApiErrorCode;
  message: string;
}

export enum RestApiErrorCode {
  // 错误
  Unknown = -1,
  // 房间号不在允许的范围内
  RoomidOutOfRange = -2,
  // 房间已存在
  RoomExist = -3,
  // 房间不存在
  RoomNotFound = -4,
}

export interface RoomConfigDto {
  autoRecord: boolean;
  optionalRecordMode: BlOptional<RecordMode>;
  optionalCuttingMode: BlOptional<CuttingMode>;
  optionalCuttingNumber: BlOptional<number>;
  optionalRecordDanmaku: BlOptional<boolean>;
  optionalRecordDanmakuRaw: BlOptional<boolean>;
  optionalRecordDanmakuSuperChat: BlOptional<boolean>;
  optionalRecordDanmakuGift: BlOptional<boolean>;
  optionalRecordDanmakuGuard: BlOptional<boolean>;
  optionalRecordingQuality: BlOptional<string>;
}

export interface RoomDto {
  objectId: string;
  roomId: number;
  autoRecord: boolean;
  shortId: number;
  name: string;
  title: string;
  areaNameParent: string;
  areaNameChild: string;
  recording: boolean;
  streaming: boolean;
  danmakuConnected: boolean;
  autoRecordForThisSession: boolean;
  stats: RoomStatsDto;
}

export interface RoomStatsDto {
  sessionDuration: number;
  sessionMaxTimestamp: number;
  fileMaxTimestamp: number;
  durationRatio: number;
  totalInputBytes: number;
  totalOutputBytes: number;
  networkMbps: number;
}

export interface SetGlobalConfig {
  optionalRecordMode: BlOptional<RecordMode>;
  optionalCuttingMode: BlOptional<CuttingMode>;
  optionalCuttingNumber: BlOptional<number>;
  optionalRecordDanmaku: BlOptional<boolean>;
  optionalRecordDanmakuRaw: BlOptional<boolean>;
  optionalRecordDanmakuSuperChat: BlOptional<boolean>;
  optionalRecordDanmakuGift: BlOptional<boolean>;
  optionalRecordDanmakuGuard: BlOptional<boolean>;
  optionalRecordingQuality: BlOptional<string>;
  optionalRecordFilenameFormat: BlOptional<string>;
  optionalWebHookUrls: BlOptional<string>;
  optionalWebHookUrlsV2: BlOptional<string>;
  optionalWpfShowTitleAndArea: BlOptional<boolean>;
  optionalCookie: BlOptional<string>;
  optionalLiveApiHost: BlOptional<string>;
  optionalTimingCheckInterval: BlOptional<number>;
  optionalTimingStreamRetry: BlOptional<number>;
  optionalTimingStreamRetryNoQn: BlOptional<number>;
  optionalTimingStreamConnect: BlOptional<number>;
  optionalTimingDanmakuRetry: BlOptional<number>;
  optionalTimingWatchdogTimeout: BlOptional<number>;
  optionalRecordDanmakuFlushInterval: BlOptional<number>;
}

export interface SetRoomConfig {
  autoRecord: boolean;
  optionalRecordMode: BlOptional<RecordMode>;
  optionalCuttingMode: BlOptional<CuttingMode>;
  optionalCuttingNumber: BlOptional<number>;
  optionalRecordDanmaku: BlOptional<boolean>;
  optionalRecordDanmakuRaw: BlOptional<boolean>;
  optionalRecordDanmakuSuperChat: BlOptional<boolean>;
  optionalRecordDanmakuGift: BlOptional<boolean>;
  optionalRecordDanmakuGuard: BlOptional<boolean>;
  optionalRecordingQuality: BlOptional<string>;
}