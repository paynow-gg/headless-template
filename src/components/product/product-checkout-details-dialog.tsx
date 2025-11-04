"use client";

import { ShoppingCartIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type RouterOutputs, api } from "~/trpc/react";

export type ProductCheckoutDetails = {
  productId: string;
  subscription: boolean;
  gift: boolean;
  gameServerId?: string;
  giftUsernameOrSteamId?: string;
};

type Props = {
  product?: RouterOutputs["paynow"]["getProducts"][number];
  details: ProductCheckoutDetails | null;
  setDetails: (value: ProductCheckoutDetails | null) => void;
  onConfirm: (details: ProductCheckoutDetails) => void;
};

type FormData = {
  gameServerId?: string;
  giftUsernameOrSteamId?: string;
};

export default function ProductCheckoutDetailsDialog({
  product,
  details,
  setDetails,
  onConfirm,
}: Props) {
  const { data: store } = api.paynow.getStore.useQuery();

  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      gameServerId: undefined,
      giftUsernameOrSteamId: undefined,
    },
  });

  useEffect(() => {
    if (details) {
      setOpen(true);

      form.reset({
        gameServerId: details.gameServerId || undefined,
        giftUsernameOrSteamId: details.giftUsernameOrSteamId || undefined,
      });

      return;
    }

    handleClose();
  }, [details, form]);

  const onSubmit = (formData: FormData) => {
    if (!details) return;

    const updatedDetails: ProductCheckoutDetails = {
      ...details,
      gameServerId: formData.gameServerId,
      giftUsernameOrSteamId: formData.giftUsernameOrSteamId,
    };

    handleClose();

    onConfirm(updatedDetails);
  };

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      setDetails(null);

      form.reset({
        gameServerId: undefined,
        giftUsernameOrSteamId: undefined,
      });
    }, 200);
  };

  const canConfirm = () => {
    const hasServer =
      !product?.single_game_server_only || !!form.watch("gameServerId");

    const hasGiftInfo =
      !details?.gift || !!form.watch("giftUsernameOrSteamId")?.trim();

    return hasServer && hasGiftInfo;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {details?.gift ? "Gift Details" : "Additional Details"}
            </DialogTitle>

            <DialogDescription>
              {details?.gift
                ? "Please provide gift recipient details."
                : "This product requires additional information."}
            </DialogDescription>
          </DialogHeader>

          {product?.single_game_server_only && (
            <div className="space-y-2">
              <Label htmlFor="gameserver-select">Game Server</Label>

              <Select
                value={form.watch("gameServerId") || ""}
                onValueChange={(value) =>
                  form.setValue("gameServerId", value || undefined)
                }
              >
                <SelectTrigger id="gameserver-select" className="w-full">
                  <SelectValue placeholder="Select a Server" />
                </SelectTrigger>

                <SelectContent>
                  {product.gameservers.map((gs) => (
                    <SelectItem key={gs.id} value={gs.id}>
                      {gs.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {details?.gift && (
            <div className="space-y-2">
              <Label>
                {store?.platform?.includes("minecraft")
                  ? "Please enter the Recipients Username"
                  : "Please Enter the Recipients SteamID64"}
              </Label>

              <Input
                type="text"
                placeholder={
                  store?.platform?.includes("minecraft")
                    ? "Recipients Username"
                    : "Recipients SteamID64"
                }
                {...form.register("giftUsernameOrSteamId", {
                  required: details?.gift
                    ? "Recipient information is required"
                    : false,
                })}
                autoFocus={details?.gift}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={!canConfirm()}>
              <ShoppingCartIcon weight="bold" />
              {details?.gift ? "Checkout" : "Add to Cart"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
