import { createI18n } from 'vue-i18n'
import fr from './fr'
import en from './en'
import pt from './pt'

export default createI18n({
  legacy: false,
  locale: 'fr', // idioma padrão
  fallbackLocale: 'en', // idioma de fallback
  messages: {
    fr,
    en,
    pt
  }
})