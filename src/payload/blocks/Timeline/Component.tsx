import React from 'react'
import RichText from '@/components/RichText'
import type { TimelineBlock as TimelineBlockProps } from '@/payload-types'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const TimelineBlock: React.FC<TimelineBlockProps> = ({ title, steps }) => {
  return (
    <div className="container my-16">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className="relative max-w-2xl mx-auto">
        {/* Вертикальная линия таймлайна */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" aria-hidden="true" />

        {/* Элементы таймлайна */}
        <div className="relative flex flex-col gap-12">
          {steps?.map((step, index) => (
            <div key={index} className="flex items-start">
              {/* Кружок и номер шага */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold z-10">
                {index + 1}
              </div>
              {/* Контент шага */}
              <div className="ml-8">
                <h3 className="text-xl font-semibold mb-2">{step.stepTitle}</h3>
                {step.stepDescription ? (
                  <RichText
                    data={step.stepDescription as DefaultTypedEditorState}
                    enableGutter={false}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
