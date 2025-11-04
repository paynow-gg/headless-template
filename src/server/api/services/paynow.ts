import { TRPCError } from "@trpc/server";
import { Cookie } from "tough-cookie";
import { env } from "~/env";

import type Context from "../types/context";

import axios from "axios";

import {
  type ManagementSchemas,
  createManagementClient,
  isPayNowError,
} from "@paynow-gg/typescript-sdk";
import type Module from "../types/paynow/module";

const management = createManagementClient(
  env.NEXT_PUBLIC_PAYNOW_STORE_ID,
  env.PAYNOW_API_KEY,
);

export default class PayNowService {
  public static async getStore(ctx: Context) {
    const request = await ctx.paynowStorefrontClient.store.getStorefrontStore();

    return request.data;
  }

  public static async getProducts(ctx: Context) {
    const request =
      await ctx.paynowStorefrontClient.products.getStorefrontProducts();

    return request.data;
  }

  public static async getNavlinks(ctx: Context) {
    const request =
      await ctx.paynowStorefrontClient.navlinks.getStorefrontNavLinks();

    return request.data;
  }

  public static async getTags(ctx: Context) {
    const request = await ctx.paynowStorefrontClient.tags.getStorefrontTags();

    return request.data;
  }

  public static async getModules(_ctx: Context) {
    const request = await axios.get(
      `https://api.paynow.gg/v1/webstores/${env.NEXT_PUBLIC_PAYNOW_STORE_ID}/modules/prepared`,
    );

    return request.data as unknown as Module[];
  }

  public static async getAuth(ctx: Context) {
    try {
      const request =
        await ctx.paynowStorefrontClient.customer.getStorefrontCustomer();

      return request.data;
    } catch (err) {
      if (isPayNowError(err) && err.status === 401) {
        return null;
      }

      throw err;
    }
  }

  public static async getCart(ctx: Context) {
    try {
      const request = await ctx.paynowStorefrontClient.cart.getCart();

      return request.data;
    } catch (err) {
      if (isPayNowError(err) && err.status === 401) {
        return null;
      }

      throw err;
    }
  }

  public static async updateCartItem(
    ctx: Context,
    input: {
      product_id: string;
      quantity: number;
      gameserver_id?: string;
      increment?: boolean;
      subscription?: boolean;
    },
  ) {
    const request = await ctx.paynowStorefrontClient.cart.addLine({
      params: {
        product_id: input.product_id,
        quantity: input.quantity,
        gameserver_id: input.gameserver_id,
        increment: input.increment ? "1" : "0",
        subscription: input.subscription ? "1" : "0",
      },
    });

    return request.data;
  }

  public static async checkout(
    ctx: Context,
    input: {
      lines: Array<{
        product_id: string;
        quantity: number;
        gift_to?: {
          platform: ManagementSchemas["CustomerProfilePlatform"];
          id: string;
        };
        selected_gameserver_id?: string;
        subscription?: boolean;
      }>;
    },
  ) {
    try {
      const request =
        await ctx.paynowStorefrontClient.checkout.createCheckoutSession({
          data: input,
        });

      return request.data;
    } catch (err) {
      if (isPayNowError(err)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.response.data.message,
        });
      }

      throw err;
    }
  }

  public static async checkoutFromCart(ctx: Context) {
    try {
      const request =
        await ctx.paynowStorefrontClient.cart.createCartCheckout();

      return request.data;
    } catch (err) {
      if (isPayNowError(err)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.response.data.message,
        });
      }

      throw err;
    }
  }

  public static async findOrCreateMinecraftCustomer(
    username: string,
    platform: "bedrock" | "java",
  ): Promise<string> {
    try {
      const request = await management.customers.lookupCustomer({
        params:
          platform === "bedrock"
            ? { minecraft_bedrock_name: username }
            : { minecraft_java_name: username },
      });

      return request.data.id;
    } catch (err) {
      if (!(isPayNowError(err) && err.status === 404)) {
        throw err;
      }
    }

    try {
      const request = await management.customers.createCustomer({
        data: {
          name: username,
          minecraft_platform: platform,
        },
      });

      return request.data.id;
    } catch (err) {
      if (isPayNowError(err) && err.status === 404) {
        throw new TRPCError({
          message: `No account was found for given ${platform} account`,
          code: "NOT_FOUND",
        });
      }

      throw err;
    }
  }

  public static async findOrCreateSteamCustomer(steamId: string) {
    try {
      const request = await management.customers.lookupCustomer({
        params: {
          steam_id: steamId,
        },
      });

      return request.data.id;
    } catch (err) {
      if (!(isPayNowError(err) && err.status === 404)) {
        throw err;
      }
    }

    const request = await management.customers.createCustomer({
      data: {
        steam_id: steamId,
      },
    });

    return request.data.id;
  }

  public static async generateAuthToken(customerId: string): Promise<string> {
    if (!customerId) {
      throw new TRPCError({
        message: "No customer ID provided to generateAuthToken",
        code: "BAD_GATEWAY",
      });
    }

    const request = await management.customers.createCustomerToken({
      path: {
        customerId,
      },
    });

    return request.data.token;
  }

  public static setAuthCookie(ctx: Context, token: string): void {
    const expiryDate = new Date();

    expiryDate.setDate(expiryDate.getDate() + 7);

    ctx.resHeaders.set(
      "Set-Cookie",
      new Cookie({
        key: "pn_token",
        value: token,
        expires: expiryDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      }).toString(),
    );
  }

  public static logout(ctx: Context): void {
    ctx.resHeaders.set(
      "Set-Cookie",
      new Cookie({
        key: "pn_token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      }).toString(),
    );
  }

  public static async getGiftcardBalanceByCode(
    ctx: Context,
    code: string,
  ): Promise<number> {
    const request = await management.giftcards.getGiftCards({
      params: {
        code: code,
        limit: 1,
        include_canceled: false,
      },
    });

    const giftCard = request?.data?.[0];

    if (!giftCard) {
      throw new TRPCError({
        message: "Gift card was not found",
        code: "NOT_FOUND",
      });
    }

    return giftCard.balance;
  }
}
