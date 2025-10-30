'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Sun, Moon } from 'lucide-react'
import { useTheme } from '..'
import { Theme, themeLocalStorageKey } from './types'

export const ThemeSelector: React.FC = () => {
  const { setTheme } = useTheme()
  const [value, setValue] = useState<Theme | 'auto'>('auto')

  const onThemeChange = (themeToSet: Theme | 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (preference === 'dark' || preference === 'light') {
      setValue(preference)
    } else {
      setValue('auto')
    }
  }, [])

  const themes = [
    { value: 'auto' as const, icon: Monitor, label: 'System theme' },
    { value: 'light' as const, icon: Sun, label: 'Light theme' },
    { value: 'dark' as const, icon: Moon, label: 'Dark theme' },
  ]

  return (
    <div className="grid grid-cols-1 max-w-fit min-w-fit">
      <div className="relative z-0 inline-grid grid-cols-3 gap-0.5 rounded-full bg-white/10 p-0.5 text-white">
        {themes.map(({ value: themeValue, icon: Icon, label }) => (
          <div
            key={themeValue}
            className={`
              relative rounded-full p-1.5 size-8
              transition-all duration-200
              cursor-pointer
              ${
                value === themeValue
                  ? 'bg-white text-gray-900 ring-1 ring-white/20 shadow-sm'
                  : 'hover:bg-white/10'
              }
              sm:p-1
            `}
          >
            <input
              type="radio"
              className="absolute inset-0 appearance-none cursor-pointer rounded-full"
              name="theme-selector"
              aria-label={label}
              value={themeValue}
              checked={value === themeValue}
              onChange={() => onThemeChange(themeValue)}
            />
            <Icon className="size-full p-0.5" />
          </div>
        ))}
      </div>
    </div>
  )
}
