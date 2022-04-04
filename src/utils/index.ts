import dayjs from "dayjs";

export const getRoomId = (roomId: string | number): number => {
  if (typeof roomId === "number") return roomId;
  if (Number.isInteger(Number(roomId))) return Number(roomId);
  if (roomId.includes("live.bilibili.com")) {
    const match = roomId.match(/(\d+)/);
    if (match) return Number(match[1]);
  }
  throw "get roomid failed";
};

export const validateCookie = (cookie: string): boolean => {
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
};

export const generateExampleFilename = (template: string) => {
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
};
