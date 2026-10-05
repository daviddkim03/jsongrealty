import type { IconType } from "react-icons"
import { LuBuilding2, LuMail, LuMapPin, LuPhone } from "react-icons/lu"
import { SiInstagram } from "react-icons/si"

import { Separator } from "@/components/ui/separator"
import { mailtoHref, site, telHref } from "@/config/site"

interface Detail {
  icon: IconType
  label: string
  value: string
  href?: string
  external?: boolean
}

const details: Detail[] = [
  { icon: LuPhone, label: "Phone", value: site.contact.phone, href: telHref },
  { icon: LuMail, label: "Email", value: site.contact.email, href: mailtoHref },
  {
    icon: SiInstagram,
    label: "Instagram",
    value: site.contact.instagram.handle,
    href: site.contact.instagram.url,
    external: true,
  },
  { icon: LuBuilding2, label: "Brokerage", value: site.agent.brokerage },
  { icon: LuMapPin, label: "Service area", value: site.contact.serviceArea },
]

export function ContactDetails() {
  return (
    <div className="flex h-full flex-col">
      <ul className="flex flex-col gap-6">
        {details.map(({ icon: Icon, label, value, href, external }) => (
          <li key={label} className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
              <Icon className="size-[1.125rem]" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {label}
              </span>
              {href ? (
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  className="mt-1 block truncate text-base font-medium underline-offset-4 hover:underline"
                >
                  {value}
                </a>
              ) : (
                <span className="mt-1 block text-base font-medium">
                  {value}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <Separator className="mb-6" />
        <div className="flex items-center gap-3">
          <img
            src={site.agent.portrait}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-1 ring-foreground/10"
          />
          <div className="leading-tight">
            <p className="text-sm font-medium">{site.agent.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {site.agent.title} · {site.agent.brokerage}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
