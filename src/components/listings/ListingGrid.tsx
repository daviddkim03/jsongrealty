import type { Listing } from "@/data/listings"
import { cn } from "@/lib/utils"
import { ListingCard } from "./ListingCard"

interface ListingGridProps {
  listings: Listing[]
  /** Featured strips hide a lone trailing card while the grid has two columns. */
  featured?: boolean
}

export function ListingGrid({ listings, featured = false }: ListingGridProps) {
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <li
          key={listing.id}
          className={cn(featured && "sm:max-lg:last:odd:hidden")}
        >
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  )
}
