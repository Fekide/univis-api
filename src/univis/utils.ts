import { ContactElement, UnivisEntity } from '../types'

export function parseOptions(options: { [arg: string]: string | undefined }): {
  [arg: string]: string
} {
  const result: { [arg: string]: string } = {}
  Object.keys(options).forEach((key) => {
    const value = options[key]
    if (value !== undefined) {
      result[key] = value
    }
  })
  return result
}

export function resolveReferences<T extends UnivisEntity>(
  contacts: ContactElement[] | ContactElement | undefined,
  objects: T[] | undefined
) {
  const keys = Array.isArray(contacts)
    ? contacts.map((c) => c.UnivISRef._key)
    : contacts !== undefined
    ? [contacts.UnivISRef._key]
    : undefined
  return keys !== undefined && objects !== undefined
    ? objects.filter((p) => keys.includes(p._key))
    : []
}
