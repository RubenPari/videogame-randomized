<template>
  <div class="container">
    <h1 class="text-center my-4">Generatore Casuale di Videogiochi</h1>

    <!-- Sezione filtri -->
    <FilterSection
      :genres="genres"
      :platforms="platforms"
      :filters="filters"
      :isLoading="isLoading"
      @generate="generateRandomGame"
    />

    <!-- Card del gioco -->
    <GameCard v-if="currentGame" :game="currentGame" :description="gameDescription" />

    <!-- Stato vuoto o caricamento -->
    <div v-else-if="isLoading" class="text-center">
      <div class="spinner-border loading-spinner" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Nessun gioco generato. Premi il pulsante "Genera" per iniziare!</p>
    </div>

    <!-- Cronologia giochi visualizzati -->
    <GameHistory :gameHistory="gameHistory" />

    <!-- Messaggi di errore -->
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
import FilterSection from './components/FilterSection.vue'
import GameCard from './components/GameCard.vue'
import GameHistory from './components/GameHistory.vue'
import apiService from './services/api'

export default {
  name: 'App',

  components: {
    FilterSection,
    GameCard,
    GameHistory,
  },

  data() {
    return {
      // Filtri
      filters: {
        genre: '',
        platforms: [],
        minRating: 0,
        startYear: 2010,
        endYear: new Date().getFullYear(),
        ordering: '-rating',
      },

      // Dati
      genres: [],
      platforms: [],
      currentGame: null,
      gameDescription: '',
      gameHistory: [],
      totalGames: 0,

      // Stato
      isLoading: false,
      error: null,
    }
  },

  created() {
    this.fetchGenres()
    this.fetchPlatforms()
  },

  methods: {
    // Fetch dei generi
    async fetchGenres() {
      try {
        const response = await apiService.getGenres()
        this.genres = response.data.results
      } catch (error) {
        console.error('Errore nel caricamento dei generi:', error)
        this.error = 'Impossibile caricare i generi. Riprova più tardi.'
      }
    },

    // Fetch delle piattaforme
    async fetchPlatforms() {
      try {
        const response = await apiService.getPlatforms()
        this.platforms = response.data.results
      } catch (error) {
        console.error('Errore nel caricamento delle piattaforme:', error)
        this.error = 'Impossibile caricare le piattaforme. Riprova più tardi.'
      }
    },

    // Genera un gioco casuale
    async generateRandomGame(updatedFilters) {
      this.isLoading = true
      this.error = null

      // Aggiorna i filtri se sono stati passati
      if (updatedFilters) {
        this.filters = { ...updatedFilters }
      }

      try {
        // Costruisci i parametri di query in base ai filtri
        const params = {
          ordering: this.filters.ordering,
          page_size: 40,
          metacritic:
            this.filters.minRating > 0
              ? `${Math.floor(this.filters.minRating * 20)},100`
              : undefined,
        }

        // Aggiungi filtri opzionali se specificati
        if (this.filters.genre) params.genres = this.filters.genre
        if (this.filters.platforms && this.filters.platforms.length > 0) {
          params.platforms = this.filters.platforms.join(',')
        }

        // Gestisci intervallo di date
        if (this.filters.startYear || this.filters.endYear) {
          const startDate = this.filters.startYear
            ? `${this.filters.startYear}-01-01`
            : '1980-01-01'
          const endDate = this.filters.endYear
            ? `${this.filters.endYear}-12-31`
            : `${new Date().getFullYear()}-12-31`
          params.dates = `${startDate},${endDate}`
        }

        // Fai la richiesta API
        const response = await apiService.getGames(params)

        // Verifica se ci sono risultati
        if (!response.data.results || response.data.results.length === 0) {
          this.error = 'Nessun gioco trovato con questi filtri. Prova a modificarli.'
          this.isLoading = false
          return
        }

        this.totalGames = response.data.count

        // Filtra i giochi che hanno un voto minimo e che non sono già stati visualizzati
        let filteredGames = response.data.results.filter(
          (game) =>
            game.rating >= this.filters.minRating &&
            !this.gameHistory.some((historyGame) => historyGame.id === game.id),
        )

        // Se non ci sono giochi disponibili dopo il filtro, utilizza tutti i risultati
        if (filteredGames.length === 0) {
          this.error = 'Hai già visto tutti i giochi con questi filtri. Prova a modificarli.'
          this.isLoading = false
          return
        }

        // Seleziona un gioco casuale tra quelli filtrati
        const randomIndex = Math.floor(Math.random() * filteredGames.length)
        const selectedGame = filteredGames[randomIndex]

        // Aggiungi alla cronologia
        this.gameHistory.push({
          id: selectedGame.id,
          name: selectedGame.name,
        })

        // Ottieni dettagli del gioco
        await this.fetchGameDetails(selectedGame.id)

        // Imposta il gioco corrente
        this.currentGame = selectedGame
      } catch (error) {
        console.error('Errore nella generazione del gioco:', error)
        this.error = 'Si è verificato un errore durante la generazione. Riprova più tardi.'
      } finally {
        this.isLoading = false
      }
    },

    // Ottieni dettagli del gioco e traduci la descrizione
    async fetchGameDetails(gameId) {
      try {
        this.gameDescription = 'Caricamento descrizione...'
        const response = await apiService.getGameDetails(gameId)
        const englishDescription = response.data.description_raw

        // Traduci la descrizione con LibreTranslate
        this.gameDescription = await apiService.translateGameDescription(englishDescription)
      } catch (error) {
        console.error('Errore nel caricamento dei dettagli del gioco:', error)
        this.gameDescription = 'Descrizione non disponibile.'
      }
    },
  },
}
</script>

<style>
body {
  background-color: #f5f5f5;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 900px;
  padding: 20px;
}

.loading-spinner {
  margin: 30px auto;
  width: 50px;
  height: 50px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #6c757d;
}
</style>
