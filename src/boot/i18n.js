import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import { LocalStorage, Quasar } from 'quasar'

import enUSQuasar from 'quasar/lang/en-US'
import hrQuasar from 'quasar/lang/hr'

// your i18n message files
import enUS from 'src/i18n/en-US'
import hr from 'src/i18n/hr'

const messages = {
  'en-US': enUS,
  hr: hr,
}

function setQuasarLang(locale) {
  const map = {
    'en-US': enUSQuasar,
    hr: hrQuasar,
  }
  Quasar.lang.set(map[locale] || enUSQuasar)
}

export default boot(({ app }) => {
  const saved = LocalStorage.getItem('locale')
  const initialLocale = saved || 'en-US'

  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: 'en-US',
    messages,
  })

  app.use(i18n)
  setQuasarLang(initialLocale)
})

export { setQuasarLang }
