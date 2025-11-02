import { initTRPC } from "@trpc/server";
import { env } from "~/env";

import superjson from "superjson";

import { ZodError } from "zod";

import type Context from "./types/context";

import isValidCountryCode from "./utils/countryCode";
import isValidPublicIP from "./utils/ip";

import { createStorefrontClient } from "@paynow-gg/typescript-sdk";

export const createTRPCContext = async ({
  headers,
  resHeaders,
}: {
  headers: Headers;
  resHeaders: Headers;
}): Promise<Context> => {
  // IP Address & Country Code Forwarding

  const ipAddress =
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  const countryCode = headers.get("cf-ipcountry")?.toString();

  const customerToken = headers
    .get("cookie")
    ?.split(";")
    ?.find((cookie) => cookie.trim().startsWith("pn_token="))
    ?.split("=")[1];

  const paynowStorefrontClient = createStorefrontClient(
    env.NEXT_PUBLIC_PAYNOW_STORE_ID,
    customerToken,
    {
      headers: {
        "x-paynow-customer-ip": isValidPublicIP(ipAddress)
          ? ipAddress
          : undefined,

        "x-paynow-customer-countrycode": isValidCountryCode(countryCode)
          ? countryCode
          : undefined,
      },
    },
  );

  return {
    headers,
    resHeaders,
    paynowStorefrontClient,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
