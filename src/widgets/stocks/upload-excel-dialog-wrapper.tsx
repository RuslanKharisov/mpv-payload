'use client'

import { useRouter } from 'next/navigation'
import { UploadExcelDialog } from './upload-excel-dialog'

export function UploadExcelDialogWithRefresh() {
  const router = useRouter()

  return (
    <UploadExcelDialog
      onFinished={() => {
        router.refresh()
      }}
    />
  )
}
