import { site } from "@/config/site"

export type SubmitStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" | "error"; title: string; message: string }

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function postJson(
  endpoint: string,
  payload: Record<string, string>,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Form endpoint responded with ${response.status}`)
  }
}

/** Opens the visitor's email app with a pre-filled draft addressed to Joshua. */
export function openEmailDraft(subject: string, lines: string[]) {
  // RFC 6068: line breaks in a mailto body are CRLF.
  const params = new URLSearchParams({ subject, body: lines.join("\r\n") })
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  window.location.href = `mailto:${site.contact.email}?${params.toString().replace(/\+/g, "%20")}`
}

export const emailDraftStatus: SubmitStatus = {
  state: "success",
  title: "Your email app should open now",
  message: `Your message is ready to send from there. If nothing opened, email ${site.contact.email} or call ${site.contact.phone}.`,
}

export const errorStatus: SubmitStatus = {
  state: "error",
  title: "Your message didn't send",
  message: `Please try again, or call ${site.contact.phone} or email ${site.contact.email} directly.`,
}

/** Maps field names to messages; returns an empty object when valid. */
export type FieldErrors<K extends string> = Partial<Record<K, string>>

export function focusFirstError<K extends string>(
  form: HTMLFormElement,
  order: readonly K[],
  errors: FieldErrors<K>,
) {
  const first = order.find((name) => errors[name])
  if (!first) return
  const control = form.elements.namedItem(first)
  if (control instanceof HTMLElement) control.focus()
}
