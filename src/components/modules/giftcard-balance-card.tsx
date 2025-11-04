"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type Module from "~/server/api/types/paynow/module";
import { type RouterInputs, api } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

type GiftcardBalanceInput = RouterInputs["paynow"]["getGiftcardBalanceByCode"];

type Props = {
  module: Module<"giftcard_balance">;
};

export default function GiftcardBalanceCard({ module }: Props) {
  const form = useForm<GiftcardBalanceInput>({
    defaultValues: {
      code: "",
    },
  });

  const checkBalanceMutation = api.paynow.getGiftcardBalanceByCode.useMutation({
    onSuccess: (data) => {
      toast(`Gift card balance: ${(data / 100).toFixed(2)}`);

      form.reset();
    },
    onError: (err) => {
      toast(err.message);

      form.setFocus("code");
    },
  });

  const onSubmit = (data: GiftcardBalanceInput) => {
    checkBalanceMutation.mutate(data);
  };

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="font-bold text-xl uppercase">
          Giftcard Checker
        </CardTitle>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <CardContent className="space-y-3">
          <p className="text-sm">
            Enter your code below to check your balance.
          </p>

          <Input
            type="text"
            placeholder="Giftcard Code"
            {...form.register("code", {
              required: "Gift card code is required",
            })}
            required
          />
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full"
            size="lg"
            disabled={
              checkBalanceMutation.isPending || !form.watch("code").trim()
            }
          >
            {checkBalanceMutation.isPending ? "Checking..." : "Check Balance"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
