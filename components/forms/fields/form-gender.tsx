import {
  Field,
  FieldDescription,
  FieldLabel,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui"
import { useState } from "react"

type FormGenderProps = {
  label: string
  name: string
  error?: string
  defaultValue?: string
}

const genderOptions = [
  { value: "male", label: "Мужской" },
  { value: "female", label: "Женский" },
]

export function FormGender({
  label,
  name,
  error,
  defaultValue = "",
}: FormGenderProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <RadioGroup
        className="flex gap-6 pt-2"
        value={value}
        onValueChange={setValue}
      >
        {genderOptions.map((option) => {
          const id = `${name}-${option.value}`

          return (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={option.value}
                id={id}
                aria-invalid={!!error}
              />
              <Label htmlFor={id}>{option.label}</Label>
            </div>
          )
        })}
      </RadioGroup>
      <input type="hidden" name={name} value={value} />
      {error ? (
        <FieldDescription className="text-sm text-red-500">
          {error}
        </FieldDescription>
      ) : null}
    </Field>
  )
}
