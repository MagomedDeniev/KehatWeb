import { GalleryVerticalEndIcon } from "lucide-react"
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Kehat Inc.
        </span>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
