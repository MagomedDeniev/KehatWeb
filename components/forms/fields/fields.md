# Формы

⚠️ — обязательные пропсы для компонентов полей.

## FormDate

**Пропсы:**

`label` ⚠️ — подпись поля. Тип: `string`  
`name` ⚠️ — имя поля формы. Тип: `string`  
`error` — текст ошибки валидации. Тип: `string`  
`defaultValue` — начальная дата. Формат: `YYYY-MM-DD`, например `"1998-04-12"`  
`startYear` — год, с которого начинается список лет. По умолчанию: текущий год. Тип: `number`, например `2026`  
`yearsCount` — количество лет в списке. Тип: `number`, например `100`

**Пример:**


```tsx
<FormDate
  label="Дата рождения"
  name="birthDate"
  error={fieldErrors.birthDate}
  defaultValue={user.birthDate}
  startYear={2026}
  yearsCount={100}
/>
```

## FormInput

**Пропсы:**

`label` ⚠️ — подпись поля. Тип: `string`  
`name` ⚠️ — имя поля формы. Тип: `string`  
`error` — текст ошибки валидации. Тип: `string`  
`type` — тип инпута. По умолчанию: `"text"`  
`defaultValue` — начальное значение. Тип: `string`

**Пример:**

```tsx
<FormInput
  label="Электронная почта"
  name="email"
  type="email"
  error={fieldErrors.email}
  defaultValue="email@example.com"
/>
```

## FormGender

**Пропсы:**

`label` ⚠️ — подпись поля. Тип: `string`  
`name` ⚠️ — имя скрытого поля формы. Тип: `string`  
`error` — текст ошибки валидации. Тип: `string`  
`defaultValue` — начальное значение. Тип: `string`, например `"male"`

**Пример:**

```tsx
<FormGender
  label="Пол"
  name="gender"
  error={fieldErrors.gender}
  defaultValue={user.gender}
/>
```

## FormPasswordPair

**Пропсы:**

`error` — текст ошибки валидации. Тип: `string`  
`passwordLabel` — подпись первого поля. По умолчанию: `"Пароль"`  
`passwordName` — имя первого поля. По умолчанию: `"password"`  
`passwordId` — id первого поля. По умолчанию равен `passwordName`  
`confirmLabel` — подпись второго поля. По умолчанию: `"Подтвердить пароль"`  
`confirmName` — имя второго поля. По умолчанию: `"confirmedPassword"`  
`confirmId` — id второго поля. По умолчанию равен `confirmName`

**Пример:**

```tsx
<FormPasswordPair error={fieldErrors.password} />
```
