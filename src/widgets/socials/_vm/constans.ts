import { Telegram } from '@/shared/icons/telegram'
import { WhatsApp } from '@/shared/icons/whatsapp'
import { FC } from 'react'

export interface SocialsData {
  icon: FC<{ size?: string; color?: string }>
  link: string
  label: string
}

const WHATSAPP = '79178696482'
const TELEGRAM = 'promstock'

export const socialsData = [
  {
    icon: WhatsApp,
    link: `https://api.whatsapp.com/send/?phone=${WHATSAPP}`,
    label: 'Напишите в WhatsApp',
  },
  {
    icon: Telegram,
    link: `https://t.me/${TELEGRAM}`,
    label: 'Напишите в Telegram',
  },
]
