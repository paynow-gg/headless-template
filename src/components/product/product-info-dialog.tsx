"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import type { RouterOutputs } from "~/trpc/react";

type Props = {
  product: RouterOutputs["paynow"]["getProducts"][number];
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ProductInfoDialog({ product, open, setOpen }: Props) {
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        {product?.description && (
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: n/a
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
