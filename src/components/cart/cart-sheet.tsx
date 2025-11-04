"use client";

import PaynowJS from "@paynow-gg/paynow.js";
import {
  RepeatIcon,
  ShoppingBagOpenIcon,
  SignOutIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { formatCents } from "~/lib/money";
import { useCartSidebar } from "~/stores/useCartSidebar";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function CartSheet() {
  const utils = api.useUtils();

  const cartSidebar = useCartSidebar();

  const { data: cart, isFetching: cartLoading } = api.paynow.getCart.useQuery();

  const updateCartMutation = api.paynow.updateCartItem.useMutation({
    onSuccess: async () => {
      await utils.paynow.getCart.invalidate();
    },
  });

  const checkoutMutation = api.paynow.checkoutFromCart.useMutation({
    onSuccess: (result) => {
      cartSidebar.setOpen(false);

      PaynowJS.checkout.open({ token: result.token });
    },
    onError: (result) => {
      toast(result.message);
    },
  });

  const logoutMutation = api.paynow.logout.useMutation({
    onSuccess: async () => {
      await utils.paynow.getAuth.reset();

      cartSidebar.setOpen(false);
    },
  });

  const totalCents = React.useMemo(
    () =>
      cart?.lines?.reduce((sum, line) => sum + line.quantity * line.price, 0) ||
      0,
    [cart?.lines],
  );

  return (
    <Sheet open={cartSidebar.isOpen} onOpenChange={cartSidebar.setOpen}>
      <SheetContent className="[&>button:first-of-type]:hidden">
        <SheetHeader>
          <div className="flex items-center gap-6">
            <SheetTitle className="flex-1">Cart</SheetTitle>

            <Button
              variant={"outline"}
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <SignOutIcon weight="bold" />
              {logoutMutation.isPending ? "Logging out..." : "Log out"}
            </Button>
          </div>

          {cartLoading ? (
            <Skeleton className="mt-3 h-28 w-full rounded-sm" />
          ) : (
            <div className="mt-3 space-y-3">
              {cart?.lines.map((cartLine) => (
                <Card key={cartLine.line_key} className="gap-1">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <CardHeader>
                        <CardTitle>
                          <h4>{cartLine.name}</h4>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex flex-col space-y-3">
                        <p className="font-semibold text-green-500">
                          {formatCents(
                            cartLine.price * cartLine.quantity,
                            cart.currency,
                          )}
                        </p>

                        {cartLine.subscription && (
                          <Badge variant="default">
                            <RepeatIcon weight="bold" />
                            Subscription
                          </Badge>
                        )}
                      </CardContent>
                    </div>

                    <div className="mr-6 flex items-center gap-1">
                      <Button
                        type="button"
                        variant={"outline"}
                        size="sm"
                        disabled={updateCartMutation.isPending}
                        onClick={() =>
                          updateCartMutation.mutate({
                            product_id: cartLine.product_id,
                            gameserver_id: cartLine.selected_gameserver_id,
                            quantity: -1,
                            increment: true,
                          })
                        }
                      >
                        -
                      </Button>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            size="sm"
                            className="text-xs"
                            disabled={updateCartMutation.isPending}
                          >
                            {cartLine.quantity}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="grid w-28 grid-cols-2">
                          {[1, 2, 3, 4, 5, 10, 15, 20].map((quantity) => (
                            <Button
                              size={"sm"}
                              variant={"ghost"}
                              key={quantity}
                              className="mx-auto text-sm"
                              disabled={updateCartMutation.isPending}
                              onClick={() =>
                                updateCartMutation.mutate({
                                  product_id: cartLine.product_id,
                                  gameserver_id:
                                    cartLine.selected_gameserver_id,
                                  quantity,
                                  increment: false,
                                })
                              }
                            >
                              {quantity}
                            </Button>
                          ))}
                        </PopoverContent>
                      </Popover>

                      <Button
                        type="button"
                        variant={"outline"}
                        size="sm"
                        disabled={updateCartMutation.isPending}
                        onClick={() =>
                          updateCartMutation.mutate({
                            product_id: cartLine.product_id,
                            gameserver_id: cartLine.selected_gameserver_id,
                            quantity: 1,
                            increment: true,
                          })
                        }
                      >
                        +
                      </Button>

                      <Button
                        variant={"destructive"}
                        className="text-xs"
                        size="sm"
                        disabled={updateCartMutation.isPending}
                        onClick={() =>
                          updateCartMutation.mutate({
                            product_id: cartLine.product_id,
                            quantity: 0,
                            increment: false,
                          })
                        }
                      >
                        <TrashIcon weight="bold" className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {!cart?.lines.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <ShoppingBagOpenIcon className="text-7xl" />

                  <p>Your cart is empty. Get shopping!</p>
                </div>
              )}
            </div>
          )}
        </SheetHeader>

        <SheetFooter className="space-y-1">
          <div className="flex items-center gap-6">
            <p className="flex-1 font-bold">Total</p>

            <p>{formatCents(totalCents, cart?.currency)}</p>
          </div>

          <Button
            variant={"default"}
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending || !cart || !cart.lines.length}
          >
            {checkoutMutation.isPending ? "Checking Out..." : "Checkout"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
