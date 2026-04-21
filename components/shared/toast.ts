import { toast, type ExternalToast } from "sonner"

type AppToastType = "success" | "error" | "info" | "warning" | "loading"

type ShowToastOptions = {
  type: AppToastType
  title: string
  description?: string
  position?: ExternalToast["position"]
}

export function showToast({
  type,
  title,
  description,
  position = "top-center",
}: ShowToastOptions) {
  const options: ExternalToast = {
    description,
    position,
  }

  switch (type) {
    case "success":
      return toast.success(title, options)
    case "error":
      return toast.error(title, options)
    case "info":
      return toast.info(title, options)
    case "warning":
      return toast.warning(title, options)
    case "loading":
      return toast.loading(title, options)
  }
}
