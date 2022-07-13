export interface BililiveRecEventWrap<EventType extends string, EventData> {
  EventType: EventType;
  EventTimestamp: Date;
  EventId: string;
  EventData: EventData;
}

export interface SessionStartedData {
  SessionId: string;
  RoomId: number;
  ShortId: number;
  Name: string;
  Title: string;
  AreaNameParent: string;
  AreaNameChild: string;
  Recording: boolean;
  Streaming: boolean;
  DanmakuConnected: boolean;
}
export type SessionStartedEvent = BililiveRecEventWrap<
  "SessionStarted",
  SessionStartedData
>;

export type SessionEndedData = SessionStartedData;
export type SessionEndedEvent = BililiveRecEventWrap<
  "SessionEnded",
  SessionEndedData
>;

export interface FileOpeningData {
  RelativePath: string;
  FileOpenTime: Date;
  SessionId: string;
  RoomId: number;
  ShortId: number;
  Name: string;
  Title: string;
  AreaNameParent: string;
  AreaNameChild: string;
}
export type FileOpeningEvent = BililiveRecEventWrap<
  "FileOpening",
  FileOpeningData
>;

export interface FileClosedData extends FileOpeningData {
  FileSize: number;
  Duration: number;
  FileCloseTime: Date;
}
export type FileClosedEvent = BililiveRecEventWrap<
  "FileClosed",
  FileClosedData
>;

export type BililiveRecEventMap = {
  SessionStarted: SessionStartedEvent;
  SessionEnded: SessionEndedEvent;
  FileOpening: FileOpeningEvent;
  FileClosed: FileClosedEvent;
};

export type BililiveRecEvent =
  | SessionStartedEvent
  | SessionEndedEvent
  | FileOpeningEvent
  | FileClosedEvent;
