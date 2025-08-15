/**
 * Utility functions for handling Netlify Forms submissions
 */

interface FormSubmitOptions {
  formName: string
  data: Record<string, any>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Submit a form to Netlify Forms
 * @param options - Form submission options
 * @returns Promise that resolves when submission is successful
 */
export async function submitNetlifyForm({ formName, data, onSuccess, onError }: FormSubmitOptions): Promise<void> {
  try {
    // Create URL-encoded form data
    const formData = new URLSearchParams()
    formData.append("form-name", formName)
    
    // Add all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })

    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`Form submission failed: ${response.statusText}`)
    }

    onSuccess?.()
  } catch (error) {
    console.error("Netlify form submission error:", error)
    onError?.(error as Error)
    throw error
  }
}

/**
 * Submit a form with file uploads to Netlify Forms
 * @param options - Form submission options with file support
 * @returns Promise that resolves when submission is successful
 */
export async function submitNetlifyFormWithFiles({ 
  formName, 
  data, 
  onSuccess, 
  onError 
}: FormSubmitOptions): Promise<void> {
  try {
    const formData = new FormData()
    formData.append("form-name", formName)
    
    // Add all form fields including files
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    const response = await fetch("/", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Form submission failed: ${response.statusText}`)
    }

    onSuccess?.()
  } catch (error) {
    console.error("Netlify form submission error:", error)
    onError?.(error as Error)
    throw error
  }
}

/**
 * Format form data for Netlify submission
 * @param data - Raw form data
 * @returns Formatted data ready for submission
 */
export function formatFormData(data: Record<string, any>): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === "boolean") {
        formatted[key] = value ? "true" : "false"
      } else if (value instanceof Date) {
        formatted[key] = value.toISOString()
      } else if (typeof value === "object" && !(value instanceof File)) {
        formatted[key] = JSON.stringify(value)
      } else if (!(value instanceof File)) {
        formatted[key] = String(value)
      }
    }
  })
  
  return formatted
}