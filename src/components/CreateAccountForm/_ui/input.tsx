import type { FieldValues, Path, UseFormRegister } from 'react-hook-form'

import React from 'react'

type Props<TFieldValues extends FieldValues = FieldValues> = {
  error:
    | {
        message?: string
        type?: string
      }
    | undefined
  label: string
  name: Path<TFieldValues>
  register: UseFormRegister<TFieldValues>
  required?: boolean
  type?: 'email' | 'number' | 'password' | 'text'
  validate?: (value: string) => boolean | string
}

export const Input = <TFieldValues extends FieldValues = FieldValues>({
  name,
  type = 'text',
  error,
  label,
  register,
  required,
  validate,
}: Props<TFieldValues>) => {
  return (
    <div className="input-wrap">
      <label className="label" htmlFor={name}>
        {`${label} ${required ? '*' : ''}`}
      </label>
      <input
        // className={[classes.input, error && classes.error].filter(Boolean).join(' ')}
        {...{ type }}
        {...register(name, {
          required,
          validate,
          ...(type === 'email'
            ? {
                pattern: {
                  message: 'Please enter a valid email',
                  value: /\S[^\s@]*@\S+\.\S+/,
                },
              }
            : {}),
        })}
      />
      {error && (
        <div className="error-message">
          {!error?.message && error?.type === 'required'
            ? 'This field is required'
            : error?.message}
        </div>
      )}
    </div>
  )
}
