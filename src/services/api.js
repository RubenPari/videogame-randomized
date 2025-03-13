import axios from 'axios'
import translationService from './translation'

// Costanti API
const API_KEY = import.meta.env.VITE_RAWG_API_KEY || 'YOUR_RAWG_API_KEY'
const BASE_URL = 'https://api.rawg.io/api'

// Istanza axios per RAWG API
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
})

export default {
  // Ottieni generi dei giochi
  getGenres() {
    return apiClient.get('/genres')
  },

  // Ottieni piattaforme
  getPlatforms() {
    return apiClient.get('/platforms')
  },

  // Ottieni giochi con filtri
  getGames(params = {}) {
    return apiClient.get('/games', {
      params: {
        ...params,
      },
    })
  },

  // Ottieni dettagli di un gioco specifico
  getGameDetails(gameId) {
    return apiClient.get(`/games/${gameId}`)
  },

  // Traduci il testo utilizzando Google Cloud Translation API
  async translateGameDescription(text) {
    if (!text) return 'Descrizione non disponibile.'

    try {
      // Utilizza il servizio di traduzione Google
      return await translationService.translate(text, 'en', 'it')
    } catch (error) {
      console.error('Errore durante la traduzione:', error)
      // In caso di errore, utilizza il fallback
      return translationService.fallbackTranslation(text)
    }
  },
}
