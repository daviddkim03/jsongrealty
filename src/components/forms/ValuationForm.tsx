import { useState, type InputEvent, type SubmitEvent } from "react"
import { LuArrowRight } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { site } from "@/config/site"
import { FormStatus, TextField } from "./fields"
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

const fieldOrder = ["address", "email"] as const
type FieldName = (typeof fieldOrder)[number]

export function ValuationForm() {
  const [errors, setErrors] = useState<FieldErrors<FieldName>>({})
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" })

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const address = String(data.get("address") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()

    const nextErrors: FieldErrors<FieldName> = {}
    if (!address) nextErrors.address = "Enter the property address."
    if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = email
        ? "Enter a valid email address."
        : "Enter your email address."
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(form, fieldOrder, nextErrors)
      return
    }

    setStatus({ state: "submitting" })
    try {
      if (site.forms.contactEndpoint) {
        await postJson(site.forms.contactEndpoint, {
          address,
          email,
          source: "home valuation",
        })
        form.reset()
        setStatus({
          state: "success",
          title: "Request received",
          message:
            "Your Comparative Market Analysis will arrive by email within 24 hours.",
        })
      } else {
        openEmailDraft("Home valuation request", [
          "I'd like a Comparative Market Analysis for my home.",
          "",
          `Property address: ${address}`,
          `Email: ${email}`,
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
        <TextField
          id="valuation-address"
          name="address"
          label="Property address"
          autoComplete="street-address"
          error={errors.address}
        />
        <TextField
          id="valuation-email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          error={errors.email}
        />
        <Field className="gap-4">
          <Button
            type="submit"
            size="xl"
            disabled={submitting}
            className="w-full"
          >
            {submitting && <Spinner data-icon="inline-start" />}
            {submitting ? "Sending…" : "Request my home value"}
            {!submitting && (
              <LuArrowRight aria-hidden="true" data-icon="inline-end" />
            )}
          </Button>
          <FormStatus status={status} />
        </Field>
      </FieldGroup>
    </form>
  )
}
