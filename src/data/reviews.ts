/**
 * Client testimonials. Pages show the first three, so order matters.
 */
export interface Review {
  quote: string
  author: string
  role: string
  rating: number
}

export const reviews: Review[] = [
  {
    quote:
      "Joshua treated our home search like research, not a sales funnel. We got real comps, real advice, and a house we actually love.",
    author: "A. & M.",
    role: "Morningside buyers",
    rating: 5,
  },
  {
    quote:
      "We'd been burned by a previous agent who pushed every house. Joshua did the opposite — he talked us out of the wrong ones until we found the right one.",
    author: "Priya R.",
    role: "Inman Park first-time buyer",
    rating: 5,
  },
  {
    quote:
      "Clear data, no games. The comp sheet he sent before our offer was sharper than what our lender pulled.",
    author: "D. Chen",
    role: "Buckhead buyer",
    rating: 5,
  },
  {
    quote:
      "Sold our craftsman in nine days at over asking. Joshua's pricing strategy was the whole reason — he was patient and let the data argue for itself.",
    author: "The Williams family",
    role: "Virginia-Highland sellers",
    rating: 5,
  },
  {
    quote:
      "Responsive in a way I didn't expect. Texts answered in minutes, never hours. Made the closing window way less stressful.",
    author: "Marcus T.",
    role: "Decatur buyer",
    rating: 5,
  },
  {
    quote:
      "He flagged a foundation issue at the inspection that two other agents had glossed over. We walked away from that house and saved ourselves a nightmare.",
    author: "K. & J.",
    role: "Old Fourth Ward buyers",
    rating: 5,
  },
]
