"use client";

import * as React from "react";

import { api } from "~/trpc/react";

import {
  ArrowRightIcon,
  ShoppingBagOpenIcon,
  SteamLogoIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { formatCents } from "~/lib/money";
import { useAuthDialog } from "~/stores/useAuthDialog";
import { useCartSidebar } from "~/stores/useCartSidebar";

export default function AuthCard() {
  const authDialog = useAuthDialog();
  const cartSidebar = useCartSidebar();

  const { data: auth } = api.paynow.getAuth.useQuery();
  const { data: cart } = api.paynow.getCart.useQuery();
  const { data: store } = api.paynow.getStore.useQuery();

  const totalItems = React.useMemo(
    () =>
      cart?.lines?.map((x) => x.quantity).reduce((sum, qty) => sum + qty, 0) ||
      0,
    [cart?.lines],
  );

  const totalCents = React.useMemo(
    () =>
      cart?.lines?.reduce((sum, line) => sum + line.quantity * line.price, 0) ||
      0,
    [cart?.lines],
  );

  return (
    <button
      type="button"
      className="group w-full hover:cursor-pointer"
      onClick={() => {
        if (auth) {
          cartSidebar.setOpen(true);

          return;
        }

        authDialog.setOpen(true);
      }}
    >
      <div className="flex min-h-16 items-center rounded-sm border border-border bg-card px-6">
        {auth?.profile?.avatar_url && (
          <img
            src={auth.profile.avatar_url}
            height={32}
            width={32}
            alt={auth.name ?? ""}
            className="rounded-xs"
          />
        )}

        {auth ? (
          <>
            <div className="p-4 text-left text-sm">
              <p className="font-semibold">{auth.name}</p>

              <p>
                {totalItems} item(s) • {formatCents(totalCents, cart?.currency)}
              </p>
            </div>

            <ShoppingBagOpenIcon
              weight="bold"
              className="ml-auto"
              height={24}
              width={24}
            />
          </>
        ) : (
          <>
            <p className="flex items-center gap-3 py-4 font-semibold text-sm">
              {store?.game?.includes("minecraft") ? (
                <UserIcon className="h-6 w-6" />
              ) : (
                <SteamLogoIcon className="h-6 w-6" />
              )}
              Login
            </p>

            <ArrowRightIcon
              weight="bold"
              className="ml-auto transition-transform duration-200 group-hover:translate-x-1"
              height={24}
              width={24}
            />
          </>
        )}
      </div>
    </button>
  );
}
