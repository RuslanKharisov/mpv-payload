import fs from 'fs'
import ejs from 'ejs'
import juice from 'juice'
import path from 'path'

// Определяем интерфейс, чтобы было понятно, какие данные можно передавать в письмо
interface GenerateEmailData {
  headline?: string
  content: string
  // CTA делаем необязательным: если не передали — кнопка не появится
  cta?: {
    url: string
    buttonLabel?: string
  }
}

export const generateEmailHTML = async (data: GenerateEmailData): Promise<string> => {
  // 1. Находим шаблон письма
  const templatePath = path.join(process.cwd(), 'src/payload/email/template.ejs')
  const templateContent = fs.readFileSync(templatePath, 'utf8')

  // 2. Рендер ejs-шаблона
  const preInlinedCSS = ejs.render(templateContent, {
    ...data,
    cta: data.cta ?? null, // передаём null, если CTA нет
  })

  // 3. Прогоняем через juice (он вставляет CSS inline для email-клиентов)
  const html = juice(preInlinedCSS)

  // 4. Возвращаем результат
  return html
}
