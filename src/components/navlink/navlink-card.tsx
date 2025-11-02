import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import React from "react";
import { type RouterOutputs, api } from "~/trpc/react";
import HoverAnimateImage from "../hover-image";
import { Card, CardTitle } from "../ui/card";

interface Props {
  navlink: RouterOutputs["paynow"]["getNavlinks"][number];
}

export default function NavlinkCard({ navlink }: Props) {
  const { data: tags } = api.paynow.getTags.useQuery();

  const tag = tags?.find((x) => x.id === navlink.tag_id);

  return (
    <Link href={`/category/${navlink.tag_slug}`}>
      <Card className="group relative m-0 h-32 cursor-pointer overflow-hidden p-0">
        <CardTitle className="flex h-full items-center gap-8 px-12 py-8">
          {tag?.image_url && (
            <div className="shrink-0">
              <HoverAnimateImage
                src={tag.image_url}
                alt={tag.name}
                width={75}
                height={75}
                className="aspect-square h-[75px] w-[75px] object-cover"
              />
            </div>
          )}

          <div className="flex flex-1 items-center justify-between gap-4">
            <h1 className="truncate font-bold text-2xl">{navlink.name}</h1>

            <span className="shrink-0">
              <ArrowRightIcon
                className="opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100"
                size={24}
                weight="bold"
              />
            </span>
          </div>
        </CardTitle>
      </Card>
    </Link>
  );
}
