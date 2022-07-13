import fs from "fs";

import axios from "axios";

import { generateApiFile } from "./apis.js";
import { header, swaggerUrl } from "./config.js";
import { generateTypeFile } from "./types.js";

const writeFile = (file: string, content: string) => {
  fs.writeFileSync(file, header + content);
  console.log(`=> ${file}`);
};

const build = async () => {
  const { data: apiJson } = await axios.get(swaggerUrl);

  writeFile("src/api/types.ts", generateTypeFile(apiJson.components.schemas));
  const [apiCode, apiMap] = generateApiFile(apiJson.paths)
  writeFile("src/api/api.ts", apiCode);

  fs.writeFileSync("sdk-map.json", JSON.stringify({ version: apiJson.version, api_map: apiMap }))
};

build();
