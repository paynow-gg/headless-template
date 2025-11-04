"use client";

import { use, useMemo, useState } from "react";
import ProductCard from "~/components/product/product-card";
import ProductCheckoutDetailsDialog, {
  type ProductCheckoutDetails,
} from "~/components/product/product-checkout-details-dialog";
import { useCartSidebar } from "~/stores/useCartSidebar";
import { type RouterOutputs, api } from "~/trpc/react";

type Product = RouterOutputs["paynow"]["getProducts"][number];

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const cartSidebar = useCartSidebar();

  const { data: navlinks } = api.paynow.getNavlinks.useQuery();
  const { data: products } = api.paynow.getProducts.useQuery();

  const navlink = useMemo(() => {
    if (!navlinks) {
      return undefined;
    }

    const allNavlinks = navlinks.flatMap((nav) => [nav, ...nav.children]);

    return allNavlinks.find((nav) => nav.tag_slug === slug);
  }, [slug, navlinks]);

  const navlinkProducts = useMemo(() => {
    if (!navlink || !products) {
      return [];
    }

    return products.filter((product) =>
      navlink.tag_query.every((tagQuery) =>
        product.tags.some((tag) => tag.slug === tagQuery),
      ),
    );
  }, [navlink, products]);

  const [checkoutDetails, setCheckoutDetails] =
    useState<ProductCheckoutDetails | null>(null);

  const addToCart = (
    product: Product,
    subscription: boolean,
    gift: boolean,
  ) => {
    if (product.single_game_server_only || gift) {
      setCheckoutDetails({
        productId: product.id,
        subscription,
        gift,
        gameServerId: undefined,
        giftUsernameOrSteamId: undefined,
      });

      return;
    }

    cartSidebar.setPendingItem({
      productId: product.id,
      quantity: 1,
      subscription,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {navlinkProducts.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}

      <ProductCheckoutDetailsDialog
        details={checkoutDetails}
        setDetails={setCheckoutDetails}
        product={products?.find((x) => x.id === checkoutDetails?.productId)}
        onConfirm={(details) =>
          cartSidebar.setPendingItem({
            productId: details.productId,
            quantity: 1,
            subscription: details.subscription,
            gameServerId: details.gameServerId,
            giftUsernameOrSteamId: details.giftUsernameOrSteamId,
          })
        }
      />
    </div>
  );
}
