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
      .map(([k, v]) => [k?.trim(), v])
  );
  return !!(
    Number.isInteger(Number(result.DedeUserID)) &&
    result.SESSDATA &&
    result.bili_jct
  );
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
