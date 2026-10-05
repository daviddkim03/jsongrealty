import { useState, type InputEvent, type SubmitEvent } from "react"
import { LuDownload } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { site } from "@/config/site"
import { FormStatus, TextField } from "./fields"
import {
  EMAIL_PATTERN,
  errorStatus,
  focusFirstError,
  postJson,
  type FieldErrors,
  type SubmitStatus,
} from "./submission"

const fieldOrder = ["name", "email"] as const
type FieldName = (typeof fieldOrder)[number]

function downloadGuide() {
  const { href, filename } = site.guides.seller
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
}

export function GuideForm() {
  const [errors, setErrors] = useState<FieldErrors<FieldName>>({})
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" })

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()

    const nextErrors: FieldErrors<FieldName> = {}
    if (!name) nextErrors.name = "Enter your name."
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
      if (site.forms.guideEndpoint) {
        await postJson(site.forms.guideEndpoint, {
          name,
          email,
          guide: "seller",
          source: "lead-magnet",
        })
      }
      downloadGuide()
      form.reset()
      setStatus({
        state: "success",
        title: "Your guide is downloading",
        message: "If the download doesn't start, use the link below.",
      })
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
          id="guide-name"
          name="name"
          label="Name"
          autoComplete="name"
          error={errors.name}
        />
        <TextField
          id="guide-email"
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
            {submitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <LuDownload aria-hidden="true" data-icon="inline-start" />
            )}
            {submitting ? "Preparing…" : "Send me the guide"}
          </Button>
          <FormStatus status={status} />
          {status.state === "success" && (
            <a
              href={site.guides.seller.href}
              download={site.guides.seller.filename}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Download the Atlanta Seller's Guide (PDF)
            </a>
          )}
        </Field>
      </FieldGroup>
    </form>
  )
}
