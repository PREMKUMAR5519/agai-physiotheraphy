import { useLocation } from 'react-router'
import type { SyntheticEvent } from 'react'
import tamil from './tamil.json'
import mainTamil from './tamil-main.json'
import { isTamilPath, languagePath } from './locale-paths'

const translations: Record<string, string> = { ...tamil, ...mainTamil }

export function clearValidation(event: SyntheticEvent<HTMLFormElement>) {
  const field = event.target
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('')
}

export function useLanguage() {
  const { pathname } = useLocation()
  const isTamil = isTamilPath(pathname)
  return {
    isTamil,
    locale: isTamil ? 'ta-IN' : 'en-IN',
    t: (text: string) => isTamil ? translations[text] ?? text : text,
    localPath: (path: string) => languagePath(path, isTamil),
    localizeValidation: (event: SyntheticEvent<HTMLFormElement>) => {
      const field = event.target
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return
      field.setCustomValidity('')
      if (!isTamil) return
      if (field.validity.valueMissing) field.setCustomValidity(field instanceof HTMLInputElement && field.type === 'checkbox' ? 'தொடர ஒப்புதல் அளியுங்கள்.' : 'இந்த விவரத்தை நிரப்புங்கள்.')
      else if (field.validity.typeMismatch) field.setCustomValidity('சரியான மின்னஞ்சல் முகவரியை உள்ளிடுங்கள்.')
      else if (field.validity.tooShort) field.setCustomValidity(`குறைந்தது ${field.minLength} எழுத்துகள் உள்ளிடுங்கள்.`)
    },
  }
}
