import { createI18n } from 'vue-i18n'
import fr from './fr'
import en from './en'
import pt from './pt'

// Obter o idioma salvo no localStorage ou usar o padrão
const savedLanguage = localStorage.getItem('selectedLanguage');
const defaultLocale = savedLanguage ? savedLanguage.toLowerCase() : 'fr';

export default createI18n({
  legacy: false,
  locale: defaultLocale, // idioma salvo ou padrão
  fallbackLocale: 'en', // idioma de fallback
  messages: {
    fr,
    en,
    pt
  }
})