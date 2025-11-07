import { Telegram } from '@/shared/icons/telegram'
import { WhatsApp } from '@/shared/icons/whatsapp'
import { SocialsData } from '../_ui/socials'
import { PhoneCallIcon } from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || ''
const TELEGRAM = process.env.NEXT_PUBLIC_TELEGRAM || ''

export const socialsData: SocialsData[] = [
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
  {
    icon: PhoneCallIcon,
    link: 'tel:+79178696482',
    label: 'Позвоните нам',
  },
]
