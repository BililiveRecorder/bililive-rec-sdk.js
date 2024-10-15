import axios, { AxiosInstance } from "axios";

import { ApiInstance } from "../api/index.js";

export interface SdkCtxOptions {
  httpUrl?: string;
}

export class SdkContext {
  axios: AxiosInstance;
  api: ApiInstance;
  constructor(public opts: SdkCtxOptions) {
    this.axios = axios.create({ baseURL: opts.httpUrl });
    this.api = new ApiInstance(this.axios);
  }
  get identity() {
    return `{ httpUrl: ${this.opts.httpUrl} }`;
  }
}

export abstract class SdkBase {
  constructor(public ctx: SdkContext) {}
}
