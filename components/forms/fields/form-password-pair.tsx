import { Field, FieldDescription, FieldLabel, Input } from "@/components/ui"

type FormPasswordPairProps = {
  error?: string
  passwordLabel?: string
  passwordName?: string
  passwordId?: string
  confirmLabel?: string
  confirmName?: string
  confirmId?: string
}

export function FormPasswordPair({
  error,
  passwordLabel = "Пароль",
  passwordName = "password",
  passwordId = passwordName,
  confirmLabel = "Подтвердить пароль",
  confirmName = "confirmedPassword",
  confirmId = confirmName,
}: FormPasswordPairProps) {
  return (
    <Field>
      <Field className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor={passwordId}>{passwordLabel}</FieldLabel>
          <Input
            id={passwordId}
            name={passwordName}
            type="password"
            aria-invalid={!!error}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={confirmId}>{confirmLabel}</FieldLabel>
          <Input
            id={confirmId}
            name={confirmName}
            type="password"
            aria-invalid={!!error}
          />
        </Field>
      </Field>
      {error ? (
        <FieldDescription className="text-sm text-red-500">
          {error}
        </FieldDescription>
      ) : null}
    </Field>
  )
}
