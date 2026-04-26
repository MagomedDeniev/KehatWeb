import {
  Field,
  FieldDescription,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { useState } from "react"

type FormDateProps = {
  label: string
  name: string
  error?: string
  defaultValue?: string
  startYear?: number
  yearsCount?: number
}

const months = [
  { value: "01", label: "Январь" },
  { value: "02", label: "Февраль" },
  { value: "03", label: "Март" },
  { value: "04", label: "Апрель" },
  { value: "05", label: "Май" },
  { value: "06", label: "Июнь" },
  { value: "07", label: "Июль" },
  { value: "08", label: "Август" },
  { value: "09", label: "Сентябрь" },
  { value: "10", label: "Октябрь" },
  { value: "11", label: "Ноябрь" },
  { value: "12", label: "Декабрь" },
]

export function FormDate({
  label,
  name,
  error,
  defaultValue,
  startYear = new Date().getFullYear(),
  yearsCount = 100,
}: FormDateProps) {
  // Разбиваем на "год", "месяц" и "день" дату который по умолчанию (на пример дата из БД в настройках пользователя)
  const [defaultYear = "", defaultMonth = "", defaultDay = ""] = defaultValue?.split("-") ?? []

  // Инициируем состояния, которые при необходимости берут значения даты по умолчанию
  const [day, setDay] = useState(defaultDay)
  const [month, setMonth] = useState(defaultMonth)
  const [year, setYear] = useState(defaultYear)

  // Формируем конечную дату который будет в отправляемом поле формы
  const value = year && month && day ? `${year}-${month}-${day}` : ""

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>

      <div className="grid grid-cols-3 gap-3">
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className="w-full" aria-invalid={!!error}>
            <SelectValue placeholder="День" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 31 }, (_, i) => {
              const dayValue = String(i + 1).padStart(2, "0")
              return (
                <SelectItem key={dayValue} value={dayValue}>
                  {dayValue}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-full" aria-invalid={!!error}>
            <SelectValue placeholder="Месяц" />
          </SelectTrigger>
          <SelectContent>
            {months.map((monthItem) => (
              <SelectItem key={monthItem.value} value={monthItem.value}>
                {monthItem.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-full" aria-invalid={!!error}>
            <SelectValue placeholder="Год" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: yearsCount }, (_, i) => {
              const yearValue = String(startYear - i)
              return (
                <SelectItem key={yearValue} value={yearValue}>
                  {yearValue}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <input type="hidden" name={name} value={value} />

      {error ? (
        <FieldDescription className="text-sm text-red-500">
          {error}
        </FieldDescription>
      ) : null}
    </Field>
  )
}
