'use client'

import React, { useCallback, useEffect, useState } from 'react'
// 👇 ИМПОРТИРУЕМ ПРАВИЛЬНЫЙ ХУК
import { useField } from '@payloadcms/ui'
import { DaDataInput } from './DaDataInput'
import { findOrCreateAddressAction } from '../actions/findOrCreateAddressAction'

type Props = {
  path: string
  adressPath: string // e.g., 'address'
}

const DaDataAddressField: React.FC<Props> = ({ path, adressPath }) => {
  // 👇 ИСПОЛЬЗУЕМ ХУК useField.
  // Он предназначен для работы с одним полем и предоставляет и value, и setValue.
  // В качестве generic <string> указываем тип значения поля (ID - это строка).
  const { value: addressId, setValue } = useField<string>({ path })

  const [initialDisplayValue, setInitialDisplayValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Этот эффект, как и раньше, подгружает текстовое представление адреса при инициализации формы
  useEffect(() => {
    if (addressId && typeof addressId === 'string' && !initialDisplayValue) {
      setIsLoading(true)
      const fetchAddress = async () => {
        try {
          // Запрашиваем полный адрес с сервера по его ID.
          // Убедитесь, что у вас настроен такой эндпоинт в Payload, либо используйте payload.findByID на сервере через action.
          // Для простоты оставим fetch.
          const response = await fetch(`/api/addresses/${addressId}`)
          if (response.ok) {
            const data = await response.json()
            setInitialDisplayValue(data.fullAddress || '')
          }
        } catch (error) {
          console.error('Failed to fetch initial address', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchAddress()
    } else {
      setIsLoading(false)
    }
  }, [addressId, initialDisplayValue])

  const handleSelect = useCallback(
    async (suggestion: any) => {
      // setValue может быть undefined, если поле не найдено, делаем проверку
      if (!setValue) {
        console.error(`Field with path "${adressPath}" not found.`)
        return
      }

      try {
        // Вызываем Server Action для поиска или создания адреса
        const newAddressId = await findOrCreateAddressAction(suggestion)

        // Обновляем значение в поле 'address' с помощью функции setValue из хука useField
        setValue(newAddressId)
      } catch (error) {
        console.error('Error processing address selection:', error)
      }
    },
    [setValue, adressPath],
  )

  if (isLoading) {
    return <div>Загрузка адреса...</div>
  }

  return <DaDataInput onSelect={handleSelect} initialValue={initialDisplayValue} />
}

export default DaDataAddressField
