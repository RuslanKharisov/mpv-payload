'use client'

import { Product, Media } from '@/payload-types' // Импортируем Media
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'

type ImageGalleryProps = {
  product: Product
}

// Определяем тип для одного изображения из галереи
// Это будет объект Media или его часть
type GalleryImage = Media | { url?: string; id?: string; alt?: string }

const ImageGallery = ({ product }: ImageGalleryProps) => {
  // Извлекаем массив изображений, разворачивая вложенную структуру
  const images: GalleryImage[] = useMemo(
    () => (product.images?.map((img) => img.image).filter(Boolean) as Media[]) || [],
    [product],
  )

  // Главное изображение для превью
  const thumbnail = (product.productImage as Media)?.url || '/images/placeholder.png'

  // Начальное изображение: первое из галереи или главное изображение
  const [selectedImage, setSelectedImage] = useState<GalleryImage>(
    images[0] || {
      url: thumbnail,
      id: 'thumbnail',
      alt: 'Product thumbnail',
    },
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleArrowClick = useCallback(
    (direction: 'left' | 'right') => {
      if (images.length === 0) return

      let newIndex: number
      if (direction === 'left') {
        newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      } else {
        newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      }

      setSelectedImage(images[newIndex])
      setSelectedImageIndex(newIndex)
    },
    [images, selectedImageIndex],
  )

  const handleImageClick = useCallback((image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setSelectedImageIndex(index)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) {
        return
      }

      if (e.key === 'ArrowLeft') {
        handleArrowClick('left')
      } else if (e.key === 'ArrowRight') {
        handleArrowClick('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleArrowClick])

  return (
    <div className="flex flex-col justify-end items-center bg-card border p-6 gap-6 w-full h-full rounded-xl">
      <div className="relative aspect-[20/15] w-full overflow-hidden">
        {/* Убрал лишний div и padding, чтобы Image мог корректно работать с fill */}
        {!!selectedImage.url && (
          <Image
            src={selectedImage.url}
            priority
            className="absolute inset-0 rounded-lg object-contain"
            alt={(selectedImage.alt as string) || product.name}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px "
          />
        )}
      </div>
      <div className="flex flex-col-reverse gap-y-1 justify-between w-full">
        <ul className="flex flex-row gap-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="flex-shrink-0 aspect-[1/1] w-16 h-16 rounded-lg cursor-pointer"
              onClick={() => handleImageClick(image, index)}
              role="button"
            >
              <Image
                src={image.url!}
                alt={image.alt || `Product image ${index + 1}`}
                height={64}
                width={64}
                className={
                  (index === selectedImageIndex ? 'opacity-100 ring-0' : 'opacity-50 ') +
                  'hover:opacity-100 object-contain rounded-md w-full h-full'
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ImageGallery
