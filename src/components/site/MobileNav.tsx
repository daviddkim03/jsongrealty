import { useState } from "react"
import { LuMail, LuMenu, LuPhone } from "react-icons/lu"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { mailtoHref, navLinks, site, telHref } from "@/config/site"
import { cn } from "@/lib/utils"
import { Brand } from "./Brand"

const links = [...navLinks, { href: "/contact/", label: "Contact" }]

export function MobileNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 md:hidden"
          aria-label="Open menu"
        >
          <LuMenu aria-hidden="true" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0">
        <SheetHeader className="h-16 justify-center border-b px-6 py-0">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation and contact details
          </SheetDescription>
          <Brand className="self-start" />
        </SheetHeader>

        <nav aria-label="Mobile" className="flex flex-col p-3">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.href)
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-heading text-2xl tracking-tight text-foreground/70 transition-colors hover:bg-muted/50 hover:text-foreground aria-[current=page]:text-foreground"
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4 border-t p-6">
          <a
            href="/contact/"
            className={cn(buttonVariants({ size: "xl" }), "w-full")}
          >
            Schedule a consultation
          </a>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <a
              href={telHref}
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <LuPhone aria-hidden="true" className="size-4" />
              {site.contact.phone}
            </a>
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <LuMail aria-hidden="true" className="size-4" />
              {site.contact.email}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
