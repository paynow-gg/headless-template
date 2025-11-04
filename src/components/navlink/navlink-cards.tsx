"use client";

import React from "react";
import { api } from "~/trpc/react";
import NavlinkCard from "./navlink-card";

export default function NavlinkCards() {
  const { data: navlinks } = api.paynow.getNavlinks.useQuery();

  if (!navlinks || !navlinks.length) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {navlinks.map((navlink) => (
        <NavlinkCard key={navlink.node_id} navlink={navlink} />
      ))}
    </div>
  );
}
