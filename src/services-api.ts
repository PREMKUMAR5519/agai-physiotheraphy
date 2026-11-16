export type Service = {
  id: string; title: string; shortTitle: string; intro: string; description: string; forYou: string
  image: string; previewImage: string; focus: readonly string[]
  category: 'sports' | 'rehabilitation' | 'wellness' | 'ageing'
  icon: 'activity' | 'strength' | 'joint' | 'brain' | 'leaf' | 'flower' | 'person'
}
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export function parseServices(value: unknown, endpoint: string): Service[] {
  if (!object(value) || value.schemaVersion !== 1 || !Array.isArray(value.services) || value.services.length > 50) throw new Error('Invalid services response')
  const ids = new Set<string>()
  return value.services.map(item => {
    if (!object(item) || !['id', 'title', 'shortTitle', 'intro', 'description', 'forYou', 'image', 'previewImage'].every(key => typeof item[key] === 'string' && (item[key] as string).trim()) || !Array.isArray(item.focus) || !item.focus.length || !item.focus.every(text => typeof text === 'string') || !['sports', 'rehabilitation', 'wellness', 'ageing'].includes(String(item.category)) || !['activity', 'strength', 'joint', 'brain', 'leaf', 'flower', 'person'].includes(String(item.icon))) throw new Error('Invalid service data')
    const service = item as Service
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.id) || ids.has(service.id)) throw new Error('Invalid service ID')
    ids.add(service.id)
    function imageUrl(value: string) {
      if (/^\/(images|uploads)\/[\w./-]+$/.test(value)) return value.startsWith('/uploads/') ? new URL(value, endpoint).href : value
      if (!['http:', 'https:'].includes(new URL(value).protocol)) throw new Error('Invalid service image')
      return value
    }
    return { ...service, image: imageUrl(service.image), previewImage: imageUrl(service.previewImage) }
  })
}
