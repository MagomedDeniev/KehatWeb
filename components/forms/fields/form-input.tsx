import { Field, FieldDescription, FieldLabel, Input } from "@/components/ui"
import type { ComponentProps } from "react"

type FormInputProps = {
  label: string
  name: string
  error?: string
  type?: ComponentProps<typeof Input>["type"]
  defaultValue?: string
}

export function FormInput({
  label,
  name,
  error,
  type = "text",
  defaultValue,
}: FormInputProps) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={!!error}
      />
      {error ? (
        <FieldDescription className="text-sm text-red-500">
          {error}
        </FieldDescription>
      ) : null}
    </Field>
  )
}
