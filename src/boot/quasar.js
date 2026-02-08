import { Dark } from 'quasar'

export default async () => {
  const saved = localStorage.getItem('dark')
  if (saved != null) Dark.set(saved === '1')
}
