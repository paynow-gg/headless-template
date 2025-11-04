"use client";

import PaynowJS from "@paynow-gg/paynow.js";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthDialog } from "~/stores/useAuthDialog";
import { useCartSidebar } from "~/stores/useCartSidebar";
import { api } from "~/trpc/react";

export default function PendingCartHandler() {
  const authDialog = useAuthDialog();
  const cartSidebar = useCartSidebar();

  const utils = api.useUtils();

  const { data: auth } = api.paynow.getAuth.useQuery();
  const { data: store } = api.paynow.getStore.useQuery();

  const updateCartMutation = api.paynow.updateCartItem.useMutation({
    onSuccess: async () => {
      await utils.paynow.getCart.invalidate();

      cartSidebar.setOpen(true);
    },
    onError: (error) => {
      toast(error.message);
    },
    onSettled: () => {
      cartSidebar.setPendingItemLoading(false);
    },
  });

  const checkoutMutation = api.paynow.checkout.useMutation({
    onSuccess: (data) => {
      cartSidebar.setOpen(false);

      PaynowJS.checkout.open({
        token: data.token,
      });
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: n/a
  useEffect(() => {
    if (!cartSidebar.pendingItem) {
      return;
    }

    if (!auth) {
      authDialog.setOpen(true);

      return;
    }

    cartSidebar.setPendingItemLoading(true);

    const {
      productId,
      quantity,
      gameServerId,
      subscription,
      giftUsernameOrSteamId,
    } = cartSidebar.pendingItem;

    const handleDirectCheckout = () => {
      const customerProfilePlatform =
        store?.platform === "minecraft" ||
        store?.platform === "minecraft_offline" ||
        store?.platform === "minecraft_geyser"
          ? "paynow_name"
          : "steam";

      const giftTo =
        customerProfilePlatform && giftUsernameOrSteamId
          ? {
              platform: customerProfilePlatform as "steam" | "paynow_name",
              id: giftUsernameOrSteamId,
            }
          : undefined;

      checkoutMutation
        .mutateAsync({
          subscription,
          lines: [
            {
              product_id: productId,
              quantity,
              selected_gameserver_id: gameServerId,
              gift_to: giftTo,
            },
          ],
        })
        .finally(() => {
          cartSidebar.setPendingItem(null);
          cartSidebar.setPendingItemLoading(false);
        });
    };

    const handleAddToCart = () => {
      updateCartMutation
        .mutateAsync({
          product_id: productId,
          quantity,
          gameserver_id: gameServerId,
          subscription,
        })
        .then(() => {
          cartSidebar.setOpen(true);
        })
        .finally(() => {
          cartSidebar.setPendingItem(null);
          cartSidebar.setPendingItemLoading(false);
        });
    };

    if (giftUsernameOrSteamId) {
      handleDirectCheckout();
      return;
    }

    handleAddToCart();
  }, [auth, cartSidebar.pendingItem]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: n/a
  useEffect(() => {
    const onCompleted = () => {
      utils.paynow.getCart.invalidate();
    };

    PaynowJS.checkout.on("completed", onCompleted);

    return () => {
      PaynowJS.checkout.off("completed", onCompleted);
    };
  }, []);

  return null;
}
