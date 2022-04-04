import dayjs from "dayjs";

export function getRoomId(roomId: string | number): number {
  if (typeof roomId === "number") return roomId;
  if (Number.isInteger(Number(roomId))) return Number(roomId);
  if (roomId.includes("live.bilibili.com")) {
    const match = roomId.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  throw "get roomid failed";
}

export function validateCookie(cookie: string): boolean {
  const result = Object.fromEntries(
    cookie
      .split(";")
      .map((i) => i.split(/=(.+)/))
      .map(([k, v]) => [k.trim(), v])
  );
  return !!(
    Number.isInteger(Number(result.DedeUserID)) &&
    result.SESSDATA &&
    result.bili_jct
  );
}

export function generateExampleFilename(template: string) {
  // TODO: Path.GetInvalidFileNameChars
  const date = dayjs();
  const random = Math.floor(Math.random() * (999 - 100)) + 100;
  let filename = template
    .replace(/{date}/g, date.format("YYYYMMDD"))
    .replace(/{time}/g, date.format("HHmmss"))
    .replace(/{ms}/g, date.format("SSS"))
    .replace(/{roomid}/g, "14846654")
    .replace(/{title}/g, "【小司无常】今天来教大家计算 20 - 1")
    .replace(/{name}/g, "小司无常")
    .replace(/{parea}/g, "电台")
    .replace(/{area}/g, "聊天电台")
    .replace(/{random}/g, random + "");

  if (!filename.endsWith(".flv")) filename += ".flv";
  return filename;
}

export function env(key: string, type: "int"): null | number;
export function env(key: string, type?: "string"): null | string;
export function env(
  key: string,
  type: "int" | "string" = "string"
): null | number | string {
  const value = process.env[key];
  if (!value) return null;
  if (value.length === 0) return null;

  if (type === "string") return value;
  if (type === "int") {
    const num = Number(value);
    if (!Number.isInteger(num)) throw `${value} is not an integer`;
    return num;
  }

  return null;
}

export interface SeparatedPromise<T> {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (v?: unknown) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function empty() {}
export function separatedPromise<T>(): SeparatedPromise<T> {
  let resolve: (v: T) => void = empty;
  let reject: (v: unknown) => void = empty;
  const promise = new Promise<T>((r, rj) => {
    resolve = r;
    reject = rj;
  });
  return { promise, resolve, reject };
}
