"use client";

import { CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { env } from "~/env";

export default function AuthDialogSteam({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    if (open) {
      window.location.href = `${env.NEXT_PUBLIC_WEBSITE_URL}/auth/steam/login`;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in with Steam</DialogTitle>

          <DialogDescription>
            We're redirecting you to Steam to login. Sit tight!
          </DialogDescription>

          <CircleNotchIcon className="fade-in animation-duration-[1s] mt-2 animate-spin text-4xl duration-300" />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
