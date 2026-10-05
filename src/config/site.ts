/**
 * Brand, contact, and form settings used across the site.
 * Everything here is rendered at build time; edit and redeploy.
 */
export const site = {
  name: "JSong Realty",
  url: "https://jsongrealty.com",
  description:
    "Joshua Song is an Atlanta REALTOR® with Keller Williams Realty. Intown neighborhoods, Buckhead, and the broader metro — handled with care and clear data.",
  agent: {
    name: "Joshua Song",
    firstName: "Joshua",
    initials: "JS",
    title: "REALTOR®",
    brokerage: "Keller Williams Realty",
    city: "Atlanta, GA",
    portrait: "/assets/img/joshua-portrait.jpg",
  },
  contact: {
    phone: "470-266-0046",
    email: "joshua@erichongrealty.com",
    instagram: {
      url: "https://www.instagram.com/jsongrealty/",
      handle: "@jsongrealty",
    },
    serviceArea: "Atlanta metro & Intown",
  },
  forms: {
    /**
     * POST endpoints (Formspree, Getform, Basin, ...) that accept JSON.
     * While empty, the contact and valuation forms open the visitor's email
     * app with the message pre-filled, and the guide form just downloads the PDF.
     */
    contactEndpoint: "",
    guideEndpoint: "",
  },
  guides: {
    seller: {
      href: "/assets/guides/jsong-atlanta-sellers-guide.pdf",
      filename: "JSong-Atlanta-Sellers-Guide.pdf",
    },
  },
} as const

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/listings/", label: "Listings" },
  { href: "/work-with-joshua/", label: "Services" },
] as const

export const telHref = `tel:+1${site.contact.phone.replace(/\D/g, "")}`
export const mailtoHref = `mailto:${site.contact.email}`
