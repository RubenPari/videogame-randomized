import axios from 'axios'

// Configurazione di Google Cloud Translation API
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2'
const GOOGLE_TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || ''

/**
 * Servizio di traduzione che utilizza Google Cloud Translation API
 */
const translationService = {
  /**
   * Traduce un testo da una lingua all'altra usando Google Cloud Translation API
   * @param {string} text - Il testo da tradurre
   * @param {string} sourceLang - La lingua di origine (es. 'en')
   * @param {string} targetLang - La lingua di destinazione (es. 'it')
   * @returns {Promise<string>} - Il testo tradotto
   */
  async translate(text, sourceLang = 'en', targetLang = 'it') {
    // Se non c'è testo, restituisci un messaggio predefinito
    if (!text || text.trim() === '') {
      return 'Descrizione non disponibile.'
    }

    // Verifica se è disponibile l'API key
    if (!GOOGLE_TRANSLATE_API_KEY) {
      console.error('API key di Google Translate non configurata')
      return this.fallbackTranslation(text)
    }

    try {
      // Prepara l'URL con i parametri di query
      const url = `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`

      // Prepara i dati per la richiesta
      const requestData = {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }

      // Effettua la richiesta a Google Cloud Translation API
      const response = await axios.post(url, requestData)

      // Estrai il testo tradotto dalla risposta
      if (
        response.data &&
        response.data.data &&
        response.data.data.translations &&
        response.data.data.translations.length > 0
      ) {
        return response.data.data.translations[0].translatedText
      } else {
        console.error('Risposta non valida da Google Cloud Translation API:', response.data)
      }
    } catch (error) {
      console.error('Errore durante la traduzione con Google Cloud Translation API:', error)

      // Gestione degli errori specifici di Google Cloud Translation API
      if (error.response) {
        // Errore di autenticazione
        if (error.response.status === 403 || error.response.status === 401) {
          console.warn('Errore di autenticazione con Google Cloud Translation API')
        }

        // Testo troppo lungo
        if (error.response.status === 413) {
          // Dividi il testo in parti più piccole (max 5000 caratteri per Google)
          const maxLength = 5000
          if (text.length > maxLength) {
            const firstPart = text.substring(0, maxLength)
            try {
              return await this.translate(firstPart, sourceLang, targetLang)
            } catch {
              return this.fallbackTranslation(text)
            }
          }
        }
      }

      // Per altri errori, utilizza il fallback
      return this.fallbackTranslation(text)
    }
  },

  /**
   * Funzione di fallback quando la traduzione online non è disponibile
   * @param {string} text - Il testo da tradurre
   * @returns {string} - Una versione troncata del testo originale
   */
  fallbackTranslation(text) {
    if (!text) return 'Descrizione non disponibile.'

    // Tronca il testo
    const shortenedText = text.substring(0, 300)

    return `${shortenedText}... [Traduzione non disponibile. Visualizzazione del testo originale abbreviato.]`
  },
}

export default translationService
