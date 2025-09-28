import React from 'react'
import RichText from '@/components/RichText'
import type { FAQBlock as FAQBlockProps } from '@/payload-types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion'

export const FAQBlock: React.FC<FAQBlockProps> = ({ title, items }) => {
  // Если нет элементов, не рендерим блок
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{title}</h2>
          <p className="text-muted-foreground">
            Здесь вы найдете ответы на самые частые вопросы о нашей платформе.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-12">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  {/* Оборачиваем RichText в div с классами prose для стилизации контента */}
                  <div className="prose prose-base dark:prose-invert max-w-none">
                    <RichText
                      data={
                        item.answer ?? {
                          root: {
                            type: 'root',
                            children: [],
                            direction: null,
                            format: '',
                            indent: 0,
                            version: 1,
                          },
                        }
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
