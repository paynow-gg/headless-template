"use client";

import type Module from "~/server/api/types/paynow/module";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function RecentPaymentsCard({
  module,
}: { module: Module<"recent_payments"> }) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="font-bold text-xl uppercase">
          {module.data.settings.header}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {module.data.orders?.map((order, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: n/a
          <div key={idx} className="flex items-center gap-4">
            <img
              src={
                order.customer.profile?.avatar_url ??
                order.customer.steam?.avatar_url
              }
              alt={order.customer?.name ?? "Order Avatar"}
              height={32}
              width={32}
              className="rounded-sm"
            />

            <div className="flex-1 text-sm">
              <p className="font-semibold">
                {order.customer.steam?.name || order.customer.profile?.name}
              </p>

              {order.lines?.map((orderLine, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: n/a
                <p key={idx} className="text-secondary-foreground">
                  {orderLine.product_name}
                </p>
              ))}
            </div>

            {module.data.settings.displayPriceOfPurchase && (
              <p className="font-semibold text-green-500 text-xs">
                {order.total_amount === 0 ? (
                  <>FREE</>
                ) : (
                  <>
                    {order.total_amount_str} {order.currency.toUpperCase()}
                  </>
                )}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
