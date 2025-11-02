"use client";

import type Module from "~/server/api/types/paynow/module";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  module: Module<"payment_goal">;
}

export default function PaymentGoalCard({ module }: Props) {
  const { data: store } = api.paynow.getStore.useQuery();

  const goal = (module.data.settings.goalTarget / 100).toFixed(2);
  const revenue = (+(module.data.revenue ?? "0") / 100).toFixed(2);

  const percentCompleted = Math.min((+revenue / +goal) * 100, 100);

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="font-bold text-xl uppercase">
          {module.data.settings.header}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <h2 className="font-semibold text-xl uppercase">
          {revenue} {store?.currency.toUpperCase()}
        </h2>

        <div className="h-3 w-full rounded-full bg-secondary">
          <div
            className="h-3 rounded-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>

        <div className="flex items-center gap-6">
          <p className="flex-1">
            {goal} {store?.currency.toUpperCase()}
          </p>

          <p>{percentCompleted.toFixed(2)} %</p>
        </div>
      </CardContent>
    </Card>
  );
}
