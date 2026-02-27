import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, {
        description,
      })
    } else if (variant === 'success') {
      sonnerToast.success(title, {
        description,
      })
    } else if (variant === 'warning') {
      sonnerToast.warning(title, {
        description,
      })
    } else if (variant === 'info') {
      sonnerToast.info(title, {
        description,
      })
    } else {
      sonnerToast(title, {
        description,
      })
    }
  }

  // Create an object with methods for backward compatibility
  return {
    toast,
    success: (message: string, description?: string) => {
      sonnerToast.success(message, { description })
    },
    error: (message: string, description?: string) => {
      sonnerToast.error(message, { description })
    },
    warning: (message: string, description?: string) => {
      sonnerToast.warning(message, { description })
    },
    info: (message: string, description?: string) => {
      sonnerToast.info(message, { description })
    }
  }
}

export { sonnerToast as toast }