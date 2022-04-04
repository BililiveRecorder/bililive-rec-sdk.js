import { OpenAPIV3_1 as OA } from "openapi-types";

import { knownEnums, tab } from "./config";

export type RawShema = OA.SchemaObject & {
  $ref?: string;
  properties?: {
    [name: string]: RawShema;
  };
};

export const parseType = (
  def: RawShema,
  depth = 0
): [type: string, refs?: string[]] => {
  if (def.type === "array") {
    const [innerType, refs] = parseType(def.items, depth + 1);
    return [`${innerType}[]`, refs];
  }

  if (def.$ref) {
    const prefix = "#/components/schemas/";
    if (def.$ref.startsWith(prefix)) {
      const type = def.$ref.split(prefix)[1];
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

const generateTypeDef = (name: string, schema: RawShema): string => {
  if (schema.type === "object")
    return `export interface ${name} ${parseType(schema)[0]}`;

  if (schema.enum) {
    if (knownEnums[name]) return knownEnums[name];

    console.log("unknown enum:", name, schema);
    return `export type ${name} = ${parseType(schema)[0]}`;
  }

  console.log(schema.type, name, schema);
  return "";
};

export const generateTypeFile = (schemas: { [type: string]: RawShema }) => {
  return Object.entries(schemas)
    .map(([name, schema]) => generateTypeDef(name, schema))
    .join("\n\n");
};
