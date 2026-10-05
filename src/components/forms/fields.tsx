import { LuCircleAlert, LuCircleCheck } from "react-icons/lu"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SubmitStatus } from "./submission"

interface FieldShellProps {
  id: string
  label: string
  error?: string
  optional?: boolean
}

function fieldA11y(id: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  }
}

function LabelWithHint({ id, label, optional }: FieldShellProps) {
  return (
    <FieldLabel htmlFor={id}>
      {label}
      {optional && (
        <span className="font-normal text-muted-foreground">(optional)</span>
      )}
    </FieldLabel>
  )
}

export function TextField({
  id,
  label,
  error,
  optional,
  ...props
}: FieldShellProps & Omit<React.ComponentProps<"input">, "id">) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <LabelWithHint id={id} label={label} optional={optional} />
      <Input id={id} className="h-11" {...fieldA11y(id, error)} {...props} />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  )
}

export function TextAreaField({
  id,
  label,
  error,
  optional,
  ...props
}: FieldShellProps & Omit<React.ComponentProps<"textarea">, "id">) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <LabelWithHint id={id} label={label} optional={optional} />
      <Textarea
        id={id}
        className="min-h-32"
        {...fieldA11y(id, error)}
        {...props}
      />
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </Field>
  )
}

export function FormStatus({ status }: { status: SubmitStatus }) {
  if (status.state !== "success" && status.state !== "error") return null
  const Icon = status.state === "success" ? LuCircleCheck : LuCircleAlert

  return (
    <Alert variant={status.state === "error" ? "destructive" : "default"}>
      <Icon aria-hidden="true" />
      <AlertTitle>{status.title}</AlertTitle>
      <AlertDescription>{status.message}</AlertDescription>
    </Alert>
  )
}
