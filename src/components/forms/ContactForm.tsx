import {
  useEffect,
  useRef,
  useState,
  type InputEvent,
  type SubmitEvent,
} from "react"
import { LuSend } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { site } from "@/config/site"
import { FormStatus, TextAreaField, TextField } from "./fields"
import {
  EMAIL_PATTERN,
  emailDraftStatus,
  errorStatus,
  focusFirstError,
  openEmailDraft,
  postJson,
  type FieldErrors,
  type SubmitStatus,
} from "./submission"

const interests = [
  "Buying a home",
  "Selling a home",
  "Getting a home valuation (CMA)",
  "Investment / rental property",
  "Just have a question",
]

const fieldOrder = ["firstName", "lastName", "email", "message"] as const
type FieldName = (typeof fieldOrder)[number]

interface ContactFormProps {
  /** Listings that can be referenced via /contact/?listing=<id>. */
  listings: { id: string; label: string }[]
}

export function ContactForm({ listings }: ContactFormProps) {
  const [interest, setInterest] = useState(interests[0])
  const [errors, setErrors] = useState<FieldErrors<FieldName>>({})
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" })
  const messageRef = useRef<HTMLTextAreaElement>(null)

  // Arriving from a listing's "Request a showing" button pre-fills the message.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("listing")
    const listing = listings.find((item) => item.id === id)
    if (!listing) return
    setInterest("Buying a home")
    const message = messageRef.current
    if (message && !message.value) {
      message.value = `I'd like to schedule a showing for ${listing.label}.`
    }
  }, [listings])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const value = (name: string) => String(data.get(name) ?? "").trim()
    const values = {
      firstName: value("firstName"),
      lastName: value("lastName"),
      email: value("email"),
      phone: value("phone"),
      interest,
      message: value("message"),
    }

    const nextErrors: FieldErrors<FieldName> = {}
    if (!values.firstName) nextErrors.firstName = "Enter your first name."
    if (!values.lastName) nextErrors.lastName = "Enter your last name."
    if (!EMAIL_PATTERN.test(values.email)) {
      nextErrors.email = values.email
        ? "Enter a valid email address."
        : "Enter your email address."
    }
    if (!values.message) nextErrors.message = "Add a short message."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(form, fieldOrder, nextErrors)
      return
    }

    setStatus({ state: "submitting" })
    try {
      if (site.forms.contactEndpoint) {
        await postJson(site.forms.contactEndpoint, {
          ...values,
          source: "contact",
        })
        form.reset()
        setInterest(interests[0])
        setStatus({
          state: "success",
          title: "Message sent",
          message: `Thanks, ${values.firstName}. ${site.agent.firstName} will be in touch within one business day.`,
        })
      } else {
        openEmailDraft(`Website inquiry: ${values.interest}`, [
          values.message,
          "",
          `${values.firstName} ${values.lastName}`,
          values.email,
          ...(values.phone ? [values.phone] : []),
        ])
        setStatus(emailDraftStatus)
      }
    } catch {
      setStatus(errorStatus)
    }
  }

  function clearError(event: InputEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as FieldName
    if (errors[name])
      setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const submitting = status.state === "submitting"

  return (
    <form noValidate onSubmit={handleSubmit} onInput={clearError}>
      <FieldGroup className="gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id="contact-first-name"
            name="firstName"
            label="First name"
            autoComplete="given-name"
            error={errors.firstName}
          />
          <TextField
            id="contact-last-name"
            name="lastName"
            label="Last name"
            autoComplete="family-name"
            error={errors.lastName}
          />
        </div>
        <TextField
          id="contact-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email}
        />
        <TextField
          id="contact-phone"
          name="phone"
          type="tel"
          label="Phone"
          autoComplete="tel"
          optional
        />
        <Field>
          <FieldLabel htmlFor="contact-interest">I'm interested in</FieldLabel>
          <Select name="interest" value={interest} onValueChange={setInterest}>
            <SelectTrigger id="contact-interest" className="h-11! w-full">
              {/* Explicit label so the server-rendered trigger isn't blank. */}
              <SelectValue>{interest}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {interests.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <TextAreaField
          ref={messageRef}
          id="contact-message"
          name="message"
          label="Message"
          rows={5}
          placeholder="A line or two about your timeline, neighborhoods, or questions…"
          error={errors.message}
        />
        <Field className="gap-4">
          <Button
            type="submit"
            size="xl"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <LuSend aria-hidden="true" data-icon="inline-start" />
            )}
            {submitting ? "Sending…" : "Send message"}
          </Button>
          <FormStatus status={status} />
          <FieldDescription>
            Your information is kept strictly confidential and is never shared.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
