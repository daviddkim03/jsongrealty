import type { IconType } from "react-icons"
import {
  LuArrowRight,
  LuBath,
  LuBedDouble,
  LuPhone,
  LuRuler,
} from "react-icons/lu"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { telHref } from "@/config/site"
import type { Listing } from "@/data/listings"
import { formatNumber, formatPrice } from "@/lib/format"
import { imageSrcSet, imageUrl } from "@/lib/images"
import { cn } from "@/lib/utils"

const facts = (
  listing: Listing,
): { icon: IconType; label: string; value: string; unit: string }[] => [
  {
    icon: LuBedDouble,
    label: "Bedrooms",
    value: String(listing.beds),
    unit: "bd",
  },
  {
    icon: LuBath,
    label: "Bathrooms",
    value: String(listing.baths),
    unit: "ba",
  },
  {
    icon: LuRuler,
    label: "Living area",
    value: formatNumber(listing.sqft),
    unit: "sqft",
  },
]

export function ListingCard({ listing }: { listing: Listing }) {
  const location = `${listing.neighborhood} · ${listing.city}, ${listing.state} ${listing.zip}`

  return (
    <Dialog>
      <article className="group relative flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
          <img
            src={imageUrl(listing.photo, 800)}
            srcSet={imageSrcSet(listing.photo, [480, 800, 1200])}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <Badge
            variant={listing.status === "New" ? "default" : "secondary"}
            className="absolute top-3 left-3 h-6 px-2.5 shadow-sm"
          >
            {listing.status}
          </Badge>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <p className="font-heading text-2xl tracking-tight">
            {formatPrice(listing.price)}
          </p>
          <h3 className="mt-1.5 font-sans text-base font-medium">
            <DialogTrigger asChild>
              {/* Stretched over the whole card so the card itself is the target. */}
              <button
                type="button"
                className="text-left outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
              >
                {listing.street}
              </button>
            </DialogTrigger>
          </h3>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">{location}</p>
          <dl className="mt-auto flex gap-5 border-t pt-4 text-sm text-muted-foreground">
            {facts(listing).map(({ icon: Icon, label, value, unit }) => (
              <div key={label} className="flex items-center gap-1.5">
                <dt className="sr-only">{label}</dt>
                <Icon className="size-4" aria-hidden="true" />
                <dd>
                  <span className="font-medium text-foreground">{value}</span>{" "}
                  {unit}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      <DialogContent className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto p-0 *:data-[slot=dialog-close]:bg-background/70 *:data-[slot=dialog-close]:backdrop-blur *:data-[slot=dialog-close]:hover:bg-background sm:max-w-2xl">
        <div className="aspect-[16/9] bg-muted">
          <img
            src={imageUrl(listing.photo, 1200)}
            srcSet={imageSrcSet(listing.photo, [800, 1200, 1600])}
            sizes="(min-width: 640px) 672px, 100vw"
            alt=""
            className="size-full object-cover"
          />
        </div>
        <div className="grid gap-6 p-6 sm:p-8">
          <DialogHeader className="gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={listing.status === "New" ? "default" : "secondary"}
              >
                {listing.status}
              </Badge>
              <Badge variant="outline">{listing.type}</Badge>
            </div>
            <DialogTitle className="text-3xl leading-tight tracking-tight">
              {listing.street}
            </DialogTitle>
            <DialogDescription className="text-base">
              {location}
            </DialogDescription>
          </DialogHeader>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
            <div className="bg-popover p-4">
              <dt className="text-xs text-muted-foreground">List price</dt>
              <dd className="mt-1 font-heading text-xl tracking-tight">
                {formatPrice(listing.price)}
              </dd>
            </div>
            {facts(listing).map(({ label, value, unit }) => (
              <div key={label} className="bg-popover p-4">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-heading text-xl tracking-tight">
                  {value}
                  {unit === "sqft" && (
                    <span className="ml-1 font-sans text-sm text-muted-foreground">
                      sqft
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-base leading-relaxed text-muted-foreground">
            {listing.summary}
          </p>

          <DialogFooter className="gap-3">
            <a
              href={telHref}
              className={cn(buttonVariants({ variant: "outline", size: "xl" }))}
            >
              <LuPhone aria-hidden="true" data-icon="inline-start" />
              Call Joshua
            </a>
            <a
              href={`/contact/?listing=${listing.id}`}
              className={cn(buttonVariants({ size: "xl" }))}
            >
              Request a showing
              <LuArrowRight aria-hidden="true" data-icon="inline-end" />
            </a>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
