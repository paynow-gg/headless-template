import { DiscordLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { env } from "~/env";

const USEFUL_LINKS = [
  {
    name: "Discord",
    href: env.NEXT_PUBLIC_DISCORD_INVITE_URL,
    target: "_blank",
    rel: "noreferrer",
  },
  {
    name: "User Agreement",
    href: "https://paynow.gg/user-agreement",
    target: "_blank",
    rel: "noreferrer",
  },
  {
    name: "Terms Of Use",
    href: "https://paynow.gg/terms-of-use",
    target: "_blank",
    rel: "noreferrer",
  },
  {
    name: "Privacy Policy",
    href: "https://paynow.gg/privacy-policy",
    target: "_blank",
    rel: "noreferrer",
  },
];

const Footer = () => {
  return (
    <div className="mt-32 flex flex-col border-t bg-card shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.5)]">
      <footer>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 px-6 py-12 md:grid-cols-3 xl:px-0">
            <div>
              <h6>About Us</h6>

              <p className="mt-4 text-muted-foreground text-sm">
                PayNow.gg Headless template - An integration of the PayNow.gg
                Headless API built with Create T3 App, Next.js 15 and React 19
                for kickstarting your next store.
              </p>
            </div>

            <div>
              <h6>Useful Links</h6>

              <ul className="mt-4 space-y-2 text-sm">
                {USEFUL_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={link.target}
                      rel={link.rel}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6>Contact Us</h6>

              <p className="mt-4 text-muted-foreground text-sm">
                If you have any questions or need assistance, feel free to reach
                out to us through our Discord server or via email.
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">
                &copy; All Rights Reserved. Powered by&nbsp;
                <Link href="https://paynow.gg" target="_blank">
                  PayNow.gg.
                </Link>
              </span>
            </div>

            <div className="flex items-center gap-5 text-muted-foreground">
              <Link href={env.NEXT_PUBLIC_DISCORD_INVITE_URL} target="_blank">
                <DiscordLogoIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
