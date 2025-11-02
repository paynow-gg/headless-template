"use client";

import { GiftIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatCents } from "~/lib/money";
import { useCartSidebar } from "~/stores/useCartSidebar";
import type { RouterOutputs } from "~/trpc/react";
import { Button } from "../ui/button";
import ProductInfoDialog from "./product-info-dialog";

type Props = {
  product: RouterOutputs["paynow"]["getProducts"][number];

  addToCart: (
    product: RouterOutputs["paynow"]["getProducts"][number],
    subscription: boolean,
    gift: boolean,
  ) => void;
};

export default function ProductCard({ product, addToCart }: Props) {
  const cartSidebar = useCartSidebar();

  const [preview, setPreview] = React.useState<boolean>(false);

  return (
    <>
      <Card
        key={product.id}
        className="flex cursor-pointer flex-col gap-6 p-3 text-center"
        onClick={(event) => {
          event.stopPropagation();

          setPreview(true);
        }}
      >
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="mx-auto mt-3 aspect-square shrink-0 rounded-sm"
            height={128}
            width={128}
          />
        )}

        <CardHeader className="p-0">
          <CardTitle>
            <h2>{product.name}</h2>
          </CardTitle>
        </CardHeader>

        <CardContent className="grow">
          {product.pricing?.active_sale && (
            <p className="font-semibold text-red-500 text-sm line-through sm:text-base">
              {formatCents(product.pricing.price_original, product.currency)}
            </p>
          )}

          <p className="font-semibold text-green-500 text-sm sm:text-base">
            {formatCents(product.pricing?.price_final ?? 0, product.currency)}
          </p>
        </CardContent>

        <div className="mt-auto space-y-3">
          {product.allow_subscription && (
            <Button
              size="default"
              variant="outline"
              className="w-full whitespace-nowrap font-semibold text-sm"
              onClick={(event) => {
                event.stopPropagation();

                addToCart(product, true, false);
              }}
              disabled={cartSidebar.pendingItemLoading}
            >
              Subscribe
            </Button>
          )}

          {product.allow_one_time_purchase && (
            <div className="flex items-center gap-3">
              <Button
                size="default"
                variant="default"
                className="w-full flex-1 whitespace-nowrap font-semibold text-sm"
                onClick={(event) => {
                  event.stopPropagation();

                  addToCart(product, false, false);
                }}
                disabled={cartSidebar.pendingItemLoading}
              >
                Add to Cart
              </Button>

              <Button
                size="default"
                variant="default"
                className="whitespace-nowrap font-semibold text-sm"
                onClick={(event) => {
                  event.stopPropagation();

                  addToCart(product, false, true);
                }}
                disabled={cartSidebar.pendingItemLoading}
                aria-label="Gift this product"
              >
                <GiftIcon weight="bold" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <ProductInfoDialog
        product={product}
        open={preview}
        setOpen={setPreview}
      />
    </>
  );
}
