import fs from "fs";

import axios from "axios";

import { generateApiFile } from "./apis";
import { header, swaggerUrl } from "./config";
import { generateTypeFile } from "./types";

const writeFile = (file: string, content: string) => {
  fs.writeFileSync(file, header + content);
  console.log(`=> ${file}`);
};

const build = async () => {
  const { data: apiJson } = await axios.get(swaggerUrl);

  writeFile("src/api/types.ts", generateTypeFile(apiJson.components.schemas));
  writeFile("src/api/api.ts", generateApiFile(apiJson.paths));
};

build();
