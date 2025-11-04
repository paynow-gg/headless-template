import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import SteamService from "../services/steam";
import PayNowService from "./../services/paynow";

export const paynowRouter = createTRPCRouter({
  getStore: publicProcedure.query(({ ctx }) => PayNowService.getStore(ctx)),

  getProducts: publicProcedure.query(({ ctx }) =>
    PayNowService.getProducts(ctx),
  ),

  getNavlinks: publicProcedure.query(({ ctx }) =>
    PayNowService.getNavlinks(ctx),
  ),

  getTags: publicProcedure.query(({ ctx }) => PayNowService.getTags(ctx)),

  getModules: publicProcedure.query(({ ctx }) => PayNowService.getModules(ctx)),

  getAuth: publicProcedure.query(({ ctx }) => PayNowService.getAuth(ctx)),

  getCart: publicProcedure.query(({ ctx }) => PayNowService.getCart(ctx)),

  updateCartItem: publicProcedure
    .input(
      z.object({
        product_id: z.string(),
        quantity: z.number(),
        gameserver_id: z
          .string()
          .optional()
          .nullable()
          .transform((x) => x ?? undefined),
        increment: z.boolean().default(true),
        subscription: z.boolean().default(false),
      }),
    )
    .mutation(({ ctx, input }) => PayNowService.updateCartItem(ctx, input)),

  checkout: publicProcedure
    .input(
      z.object({
        subscription: z.boolean(),
        lines: z
          .object({
            product_id: z.string(),
            quantity: z.number(),
            gift_to: z
              .object({
                platform: z.enum(["steam", "minecraft", "paynow_name"]),
                id: z.string(),
              })
              .optional(),
            selected_gameserver_id: z.string().optional(),
          })
          .array(),
      }),
    )
    .mutation(({ ctx, input }) => PayNowService.checkout(ctx, input)),

  checkoutFromCart: publicProcedure.mutation(({ ctx }) =>
    PayNowService.checkoutFromCart(ctx),
  ),

  minecraftLogin: publicProcedure
    .input(
      z.object({
        username: z.string().trim().max(64),
        platform: z.enum(["bedrock", "java"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customerId = await PayNowService.findOrCreateMinecraftCustomer(
        input.username,
        input.platform,
      );

      const token = await PayNowService.generateAuthToken(customerId);

      PayNowService.setAuthCookie(ctx, token);
    }),

  steamLogin: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { query } = input;

      const steamId = await SteamService.resolveSteamIdFromOpenIdQS(query);

      const customerId = await PayNowService.findOrCreateSteamCustomer(steamId);

      const token = await PayNowService.generateAuthToken(customerId);

      return token;
    }),

  getSteamLoginUrl: publicProcedure.query(() => SteamService.getLoginUrl()),

  logout: publicProcedure.mutation(({ ctx }) => PayNowService.logout(ctx)),

  getGiftcardBalanceByCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Min 1 char").max(24, "Max 24 chars").trim(),
      }),
    )
    .mutation(({ ctx, input }) =>
      PayNowService.getGiftcardBalanceByCode(ctx, input.code),
    ),
});
