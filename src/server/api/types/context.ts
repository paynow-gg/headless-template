import type { createStorefrontClient } from "@paynow-gg/typescript-sdk";

export default interface Context {
  headers: Headers;
  resHeaders: Headers;

  paynowStorefrontClient: ReturnType<typeof createStorefrontClient>;
}
