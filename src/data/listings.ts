/**
 * Curated listings shown on the home page (first three) and /listings/.
 * These are sample homes; replace them with real listings as they come up.
 */
export interface Listing {
  id: string
  status: "New" | "For sale"
  price: number
  beds: number
  baths: number
  sqft: number
  type: "Single Family" | "Condo" | "Townhouse"
  neighborhood: string
  street: string
  city: string
  state: string
  zip: string
  /** Unsplash photo id, or an image URL / path under public/ (see lib/images.ts) */
  photo: string
  summary: string
}

export const listings: Listing[] = [
  {
    id: "1240-piedmont-ave-ne",
    status: "New",
    price: 749000,
    beds: 4,
    baths: 3,
    sqft: 2840,
    type: "Single Family",
    neighborhood: "Midtown",
    street: "1240 Piedmont Ave NE",
    city: "Atlanta",
    state: "GA",
    zip: "30309",
    photo: "photo-1568605114967-8130f3a36994",
    summary:
      "Midtown craftsman with a reimagined kitchen, screened porch, and two-car garage.",
  },
  {
    id: "88-virginia-highland",
    status: "For sale",
    price: 1245000,
    beds: 5,
    baths: 4,
    sqft: 3910,
    type: "Single Family",
    neighborhood: "Virginia-Highland",
    street: "88 Virginia Highland",
    city: "Atlanta",
    state: "GA",
    zip: "30306",
    photo: "photo-1564013799919-ab600027ffc6",
    summary:
      "Renovated Va-Hi bungalow with a chef's kitchen and full-finished basement.",
  },
  {
    id: "210-peachtree-st",
    status: "For sale",
    price: 525000,
    beds: 3,
    baths: 2,
    sqft: 1980,
    type: "Condo",
    neighborhood: "Downtown",
    street: "210 Peachtree St",
    city: "Atlanta",
    state: "GA",
    zip: "30303",
    photo: "photo-1545324418-cc1a3fa10c00",
    summary:
      "Downtown high-rise with skyline views, walkable to Centennial Olympic Park.",
  },
  {
    id: "45-inman-park",
    status: "For sale",
    price: 899000,
    beds: 4,
    baths: 3,
    sqft: 3120,
    type: "Single Family",
    neighborhood: "Inman Park",
    street: "45 Inman Park",
    city: "Atlanta",
    state: "GA",
    zip: "30307",
    photo: "photo-1600596542815-ffad4c1539a9",
    summary:
      "Inman Park Victorian steps from the BeltLine with an entertainer's backyard.",
  },
  {
    id: "3712-peachtree-rd",
    status: "For sale",
    price: 1495000,
    beds: 5,
    baths: 5,
    sqft: 4680,
    type: "Single Family",
    neighborhood: "Buckhead",
    street: "3712 Peachtree Rd",
    city: "Atlanta",
    state: "GA",
    zip: "30319",
    photo: "photo-1613490493576-7fde63acd811",
    summary:
      "Buckhead new-construction with designer finishes and a detached guest suite.",
  },
  {
    id: "612-westside-way",
    status: "For sale",
    price: 435000,
    beds: 2,
    baths: 2,
    sqft: 1420,
    type: "Townhouse",
    neighborhood: "Westside",
    street: "612 Westside Way",
    city: "Atlanta",
    state: "GA",
    zip: "30318",
    photo: "photo-1570129477492-45c003edd2be",
    summary:
      "Westside townhome with a rooftop terrace minutes from the BeltLine.",
  },
]
