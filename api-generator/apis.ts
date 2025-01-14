import fs from "fs";

import type { OpenAPIV3_1 as OA } from "openapi-types";

import { apiRenameMap, tab } from "./config.js";
import { parseType, RawShema } from "./types.js";

const generateApiCode = (
  name: string,
  path: string,
  method: OA.HttpMethods,
  def: OA.OperationObject,
): { lines: string[]; refTypes: string[] } => {
  const params: string[] = [];
  const refTypes: string[] = [];

  const parameters = def.parameters as [OA.ParameterObject];
  const requestBody = def.requestBody as OA.RequestBodyObject;
  const responses = def.responses as Record<string, OA.ResponseObject>;

  let pathParam = "";
  if (parameters) {
    if (parameters.length > 1) throw `refactor it, bro`;
    const { schema, name } = parameters[0];
    const [type, refs] = parseType(schema as RawShema);
    if (refs) refTypes.push(...refs);
    params.push(`${name}: ${type}`);

    pathParam = name;
  }

  const bodyDef = requestBody?.content["application/json"];
  if (bodyDef) {
    const [type, refs] = parseType(bodyDef.schema as RawShema);
    if (refs) refTypes.push(...refs);
    if (
      name === "setGlobalConfig" ||
      name === "setRoomConfigByRoomId" ||
      name === "setRoomConfigByObjectId"
    ) {
      params.push(`payload: Partial<${type}>`);
    } else {
      params.push(`payload: ${type}`);
    }
  }

  let responseType = "void";
  const responseDef = responses?.[200]?.content?.["application/json"];
  if (responseDef) {
    const [type, refs] = parseType(responseDef.schema as RawShema);
    responseType = type;
    if (refs) refTypes.push(...refs);
  }

  const _params = params.join(", ");
  const lines: string[] = [];
  lines.push(`// ${def.summary}`);
  if (pathParam) {
    lines.push(
      `${name} = genApi("${path}", "${method}", "${pathParam}") as (${_params}) => Promise<${responseType}>`,
    );
  } else {
    lines.push(
      `${name} = genApi("${path}", "${method}") as (${_params}) => Promise<${responseType}>`,
    );
  }

  return { lines, refTypes };
};

export interface MethodItem {
  name: string;
  path: string;
  summary: string;
}
export const generateApiFile = (paths: OA.PathsObject) => {
  const refTypes = new Set<string>();
  const methodLines: string[] = [];
  const methods: MethodItem[] = [];

  for (const path in paths) {
    const methodMap = paths[path] as OA.PathItemObject;
    for (const _method in methodMap) {
      const method = _method as OA.HttpMethods;

      const key = `${path}.${method}`;

      const name = apiRenameMap[key];
      if (!name) throw `unknown path or method: ${key}`;

      const methodDef = methodMap[method] as OA.OperationObject;
      if (!methodDef) throw `unexpected methodDef: ${key}`;

      const result = generateApiCode(name, path, method, methodDef);
      methodLines.push("");
      methodLines.push(...result.lines);

      methods.push({ name, path, summary: methodDef.summary || "-" });

      result.refTypes.forEach((i) => refTypes.add(i));
    }
  }

  let code = fs.readFileSync("api-generator/api-ts.tmpl", "utf-8");

  code = code.replace("__ref_types__", [...refTypes].sort().join(`,\n${tab}`));
  code = code.replace(
    "__methods__",
    methodLines.map((line) => (line ? `${tab}${line}` : "")).join(`\n`),
  );

  return [code, methods] as const;
};
