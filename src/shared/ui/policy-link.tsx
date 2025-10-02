import Link from 'next/link'

const PolicyLink = ({ title }: { title: string }) => {
  return (
    <p className="px-0 text-center text-sm text-muted-foreground">
      Нажимая <span className="font-semibold">{title}</span> вы соглашаетесь с{' '}
      <Link href="/user-agreement" className="underline underline-offset-4 hover:text-primary">
        Пользовательским соглашением
      </Link>{' '}
      и{' '}
      <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-primary">
        Политикой конфиденциальности
      </Link>
      .
    </p>
  )
}

export default PolicyLink
