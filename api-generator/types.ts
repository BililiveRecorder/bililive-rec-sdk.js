import { OpenAPIV3_1 as OA } from "openapi-types";

import { knownEnums, tab } from "./config.js";

export type RawShema = OA.SchemaObject & {
  $ref?: string;
  properties?: {
    [name: string]: RawShema;
  };
};

export type ParsedResult = [type: string, refs?: string[]];

const tryIfBlOptional = (def: OA.SchemaObject): ParsedResult | false => {
  const type = def.type;
  const properties = def.properties as { [s: string]: OA.SchemaObject };
  if (
    type === "object" &&
    Object.keys(properties).length === 2 &&
    properties.hasValue?.type === "boolean" &&
    properties.value
  ) {
    const [type, refs] = parseType(properties.value);
    return [`BlOptional<${type}>`, refs];
  }
  return false;
};

export const parseType = (def: RawShema, depth = 0): ParsedResult => {
  if (def.type === "array") {
    const [innerType, refs] = parseType(def.items, depth + 1);
    return [`${innerType}[]`, refs];
  }

  if (def.$ref) {
    const prefix = "#/components/schemas/";
    if (def.$ref.startsWith(prefix)) {
      const type = def.$ref.split(prefix)[1];
      if (type === undefined) throw "no way";
      const replaceType = blOptionalTypeMap[type];
      if (replaceType) return [replaceType, ["BlOptional"]];
      return [type, [type]];
    }
    console.error("renderType.$ref:", def);
    return ["unknown"];
  }

  if (!("type" in def)) {
    console.error("renderType.type:", def);
    return ["unknown"];
  }

  if (def.type === "object") {
    const blDef = tryIfBlOptional(def);
    if (blDef) return blDef;
    const curTabs = tab.repeat(depth);
    const innerTabs = tab.repeat(depth + 1);
    if (!def.properties) {
      console.error("renderType.object:", def);
      return ["unknown"];
    }
    return [
      `{
${Object.entries(def.properties)
  .map(([k, v]) => `${k}: ${parseType(v, depth + 1)[0]};`)
  .map((i) => innerTabs + i)
  .join("\n")}
${curTabs}}`,
    ];
  }

  if (def.enum) {
    if (def.type === "integer") return [def.enum.join(" | ")];
    if (def.type === "string")
      return [def.enum.map((i) => `"${i}"`).join(" | ")];
    console.error("renderType.enum:", def);
    return ["unknown"];
  }

  if (def.type === "boolean") return ["boolean"];
  if (def.type === "integer") return ["number"];
  if (def.type === "number") return ["number"];
  if (def.type === "string") return ["string"];

  console.error("renderType.final:", def);
  return ["unknown"];
};

const blOptionalTypeMap: Record<string, string> = {};

const generateTypeDef = (
  name: string,
  schema: RawShema
): string | undefined => {
  const [type] = parseType(schema);

  if (type.startsWith("BlOptional<")) {
    blOptionalTypeMap[name] = type;
    return;
  }

  if (schema.type === "object") return `export interface ${name} ${type}`;

  if (schema.enum) {
    if (knownEnums[name]) return knownEnums[name];

    console.log("unknown enum:", name, schema);
    return `export type ${name} = ${type}`;
  }

  console.log(schema.type, name, schema);
  return "";
};

export const generateTypeFile = (schemas: { [type: string]: RawShema }) => {
  let body = `export interface BlOptional<T> {
  hasValue: boolean;
  value: null | T;
}
`;

  Object.entries(schemas).map(([name, schema]) =>
    generateTypeDef(name, schema)
  );

  body += Object.entries(schemas)
    .map(([name, schema]) => generateTypeDef(name, schema))
    .filter((i) => i)
    .join("\n\n");

  return body;
};
