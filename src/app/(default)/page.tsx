"use client";

export const runtime = "edge";

import NavlinkCards from "~/components/navlink/navlink-cards";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="inline-block font-extrabold text-3xl">
            PayNow Store
          </CardTitle>

          <CardDescription className="hidden" />
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="font-light">
            <p>
              From this page you can buy ranks and other perks to help support
              the server.
            </p>

            <p>
              This store doesn't provide real rewards and is only a demo
              template.
            </p>
          </div>

          <div className="space-y-1">
            <h2 className="font-bold text-2xl">
              What payment methods do you accept?
            </h2>

            <p className="font-light">
              We accept a variety of payment methods, including PayPal, credit
              cards, and more.
            </p>
          </div>
        </CardContent>
      </Card>

      <NavlinkCards />
    </div>
  );
}
