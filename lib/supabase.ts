import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oyldblvprorrqhkyfqcf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bGRibHZwcm9ycnFoa3lmcWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjM2ODQsImV4cCI6MjA3MDY5OTY4NH0.U5U4zlKDzqzE9TuvxIrkhWzto2AqguhWe3zqShAj6Mc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload image to Supabase Storage
export async function uploadImage(
  bucket: string,
  path: string,
  file: File,
  userId: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${path}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
        cacheControl: '3600'
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: data.publicUrl, error: null }
  } catch (error) {
    return { url: null, error: error as Error }
  }
}

// Helper function to delete image from Supabase Storage
export async function deleteImage(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

// Specific helper functions for profile images
export async function uploadProfileImage(userId: string, file: File): Promise<string | null> {
  const result = await uploadImage('profile-images', 'profile', file, userId)
  return result.url
}

export async function uploadBackgroundImage(userId: string, file: File): Promise<string | null> {
  const result = await uploadImage('profile-backgrounds', 'background', file, userId)
  return result.url
}

export function getProfileImageUrl(userId: string, extension: string = 'jpg'): string {
  const { data } = supabase.storage
    .from('profile-images')
    .getPublicUrl(`${userId}/profile.${extension}`)
  
  return data.publicUrl
}

export function getBackgroundImageUrl(userId: string, extension: string = 'jpg'): string {
  const { data } = supabase.storage
    .from('profile-backgrounds')
    .getPublicUrl(`${userId}/background.${extension}`)
  
  return data.publicUrl
}