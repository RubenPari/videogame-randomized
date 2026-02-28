<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-cyan-500/30">
    <header class="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-cyan-500 text-zinc-950 flex items-center justify-center rounded-lg font-black text-xl transform -skew-x-6">
            VG
          </div>
          <h1 class="text-2xl font-black text-white tracking-tight uppercase italic">
            Random<span class="text-cyan-400">Generator</span>
          </h1>
        </div>
        <button @click="openSavedGamesModal"
          class="group flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-fuchsia-500/50 rounded-xl transition-all">
          <svg class="w-5 h-5 text-fuchsia-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          <span class="font-bold text-white uppercase text-sm tracking-wider hidden sm:block">Vault</span>
          <span v-if="savedGamesCount > 0" class="flex h-5 w-5 items-center justify-center rounded-md bg-fuchsia-500 text-[10px] font-black text-zinc-950 ml-1">
            {{ savedGamesCount }}
          </span>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
      <div class="w-full lg:w-1/3 lg:sticky lg:top-28 h-fit">
        <FilterSection :genres="genres" :platforms="platforms" :filters="filters" :isLoading="isLoading"
          @generate="generateRandomGame" />
      </div>

      <div class="w-full lg:w-2/3 space-y-8 flex flex-col">
        <div class="min-h-[400px] flex flex-col relative">
          <GameCard v-if="currentGame" :game="currentGame" :description="gameDescription" @game-saved="onGameSaved"
            @game-removed="onGameRemoved" class="animate-fade-in" />
            
          <div v-else-if="isLoading" class="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 p-12">
            <div class="w-16 h-16 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
            <p class="text-cyan-400 font-mono text-sm uppercase tracking-widest animate-pulse">Initializing Protocol...</p>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 p-12 text-center">
            <div class="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
              <svg class="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-black text-white mb-2 uppercase tracking-widest">Awaiting Input</h3>
            <p class="text-zinc-500 text-sm max-w-sm">
              Configure parameters and engage sequence to discover.
            </p>
          </div>
        </div>

        <GameHistory :gameHistory="gameHistory" @clear-history="gameHistory = []" />
        
        <div v-if="error" class="bg-red-500/10 border-l-2 border-red-500 text-red-400 p-4 rounded-r-xl text-sm font-mono">
          <p class="font-bold uppercase tracking-wider mb-1">System Error</p>
          <p>{{ error }}</p>
        </div>
      </div>
    </main>

    <SavedGamesModal :show="showSavedGamesModal" @close="closeSavedGamesModal" @game-removed="onGameRemoved"
      @games-cleared="onGamesClear" />
  </div>
</template>

<script>
// Import of Vue components necessary for the interface
import FilterSection from './components/FilterSection.vue'
import GameCard from './components/GameCard.vue'
import GameHistory from './components/GameHistory.vue'
import SavedGamesModal from './components/SaveGamesModal.vue'
// API service to communicate with RAWG API
import apiService from './services/api'
// Database service to manage saved games
import databaseService from './services/database'

/**
 * Main component of the Random Video Game Generator application
 * Manages the global state of the app and coordinates child components
 * Now includes save/remove functionality for games
 */
export default {
  name: 'App',

  // Registration of child components used in the template
  components: {
    FilterSection,
    GameCard,
    GameHistory,
    SavedGamesModal,
  },

  /**
   * Component reactive data
   * Contains filters, game data, history and application state
   */
  data() {
    return {
      // Object containing all search filters
      filters: {
        genre: '',                             // Selected genre (empty = all)
        platforms: [],                          // Array of selected platform IDs
        minRating: 0,                           // Minimum rating (0-5)
        startYear: 2010,                        // Start year for search
        endYear: new Date().getFullYear(),      // End year (default: current year)
        ordering: '-rating',                    // Results ordering (default: by descending rating)
      },

      // Data loaded from API
      genres: [],                               // List of all available genres
      platforms: [],                           // List of all available platforms
      currentGame: null,                        // Currently displayed game
      gameDescription: '',                     // Translated description of current game
      gameHistory: [],                          // History of already displayed games
      totalGames: 0,                           // Total number of games found with current filters

      // Application state
      isLoading: false,                        // Flag to indicate loading in progress
      error: null,                             // Error message to display
      showSavedGamesModal: false,              // Flag to show/hide saved games modal
      savedGamesCount: 0,                      // Count of saved games
    }
  },

  /**
   * Vue lifecycle hook - called after component creation
   * Loads necessary initial data (genres and platforms)
   */
  created() {
    this.fetchGenres()
    this.fetchPlatforms()
    this.updateSavedGamesCount()
  },

  methods: {
    /**
     * Retrieves the list of all available genres from RAWG API
     * Populates the genres array for the FilterSection component
     */
    async fetchGenres() {
      try {
        const response = await apiService.getGenres()
        this.genres = response.data.results
      } catch (error) {
        console.error('Error loading genres:', error)
        this.error = 'Unable to load genres. Please try again later.'
      }
    },

    /**
     * Retrieves the list of all available platforms from RAWG API
     * Populates the platforms array for the FilterSection component
     */
    async fetchPlatforms() {
      try {
        const response = await apiService.getPlatforms()
        this.platforms = response.data.results
      } catch (error) {
        console.error('Error loading platforms:', error)
        this.error = 'Unable to load platforms. Please try again later.'
      }
    },

    /**
     * Generates a random game based on selected filters
     * @param {Object} updatedFilters - Updated filters from FilterSection component
     *
     * Process:
     * 1. Builds query parameters based on filters
     * 2. Retrieves games from API
     * 3. Filters already seen games
     * 4. Randomly selects a game
     * 5. Retrieves details and translates description
     */
    async generateRandomGame(updatedFilters) {
      this.isLoading = true
      this.error = null

      // Updates filters if provided by child component
      if (updatedFilters) {
        this.filters = { ...updatedFilters }
      }

      try {
        // Builds query parameters for RAWG API
        const params = {
          ordering: this.filters.ordering,      // Sorting criteria
          page_size: 40,                        // Number of results per page
          metacritic:                           // Filter for Metacritic score
            this.filters.minRating > 0
              ? `${Math.floor(this.filters.minRating * 20)},100`  // Converts rating 0-5 to 0-100
              : undefined,
        }

        // Adds optional filters only if specified
        if (this.filters.genre) params.genres = this.filters.genre
        if (this.filters.platforms && this.filters.platforms.length > 0) {
          params.platforms = this.filters.platforms.join(',')  // Joins platform IDs
        }

        // Handles date range to filter games by release year
        if (this.filters.startYear || this.filters.endYear) {
          // Start date (default: 1980-01-01)
          const startDate = this.filters.startYear
            ? `${this.filters.startYear}-01-01`
            : '1980-01-01'
          // End date (default: end of current year)
          const endDate = this.filters.endYear
            ? `${this.filters.endYear}-12-31`
            : `${new Date().getFullYear()}-12-31`
          params.dates = `${startDate},${endDate}`
        }

        // Makes request to RAWG API to retrieve games
        const response = await apiService.getGames(params)

        // Checks if results are available
        if (!response.data.results || response.data.results.length === 0) {
          this.error = 'No games found with these filters. Try modifying them.'
          this.isLoading = false
          return
        }

        // Saves total number of games found
        this.totalGames = response.data.count

        // Filters games by:
        // 1. Specified minimum rating
        // 2. Games not yet displayed (not present in history)
        let filteredGames = response.data.results.filter(
          (game) =>
            game.rating >= this.filters.minRating &&
            !this.gameHistory.some((historyGame) => historyGame.id === game.id),
        )

        // If all games have already been seen, show an error message
        if (filteredGames.length === 0) {
          this.error = 'You have already seen all games with these filters. Try modifying them.'
          this.isLoading = false
          return
        }

        // Selects a random game from filtered array
        const randomIndex = Math.floor(Math.random() * filteredGames.length)
        const selectedGame = filteredGames[randomIndex]

        // Adds selected game to history
        // Keeps track of all games already displayed
        this.gameHistory.push({
          id: selectedGame.id,
          name: selectedGame.name,
        })

        // Retrieves complete game details and translates description
        await this.fetchGameDetails(selectedGame.id)

        // Sets current game for display
        this.currentGame = selectedGame
      } catch (error) {
        console.error('Error generating game:', error)
        this.error = 'An error occurred during generation. Please try again later.'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Retrieves complete details of a specific game and translates description
     * @param {number} gameId - ID of the game to retrieve
     *
     * Process:
     * 1. Shows a loading message
     * 2. Retrieves game details from API
     * 3. Translates description from English to Italian using LibreTranslate
     * 4. Handles any errors by showing a fallback message
     */
    async fetchGameDetails(gameId) {
      try {
        // Shows temporary message during loading
        this.gameDescription = 'Loading description...'

        // Retrieves complete game details
        const response = await apiService.getGameDetails(gameId)
        const englishDescription = response.data.description_raw

        // Translates description to Italian using LibreTranslate service
        this.gameDescription = await apiService.translateGameDescription(englishDescription)
      } catch (error) {
        console.error('Error loading game details:', error)
        // Fallback message if description is not available
        this.gameDescription = 'Description not available.'
      }
    },

    /**
     * Updates the count of saved games
     * Called when games are added or removed
     */
    async updateSavedGamesCount() {
      const savedGames = await databaseService.getSavedGames()
      this.savedGamesCount = savedGames.length
    },

    /**
     * Handles when a game is saved from GameCard
     * @param {Object} game - The saved game object
     */
    onGameSaved(game) {
      this.updateSavedGamesCount()
      console.log('Game saved:', game.name)
    },

    /**
     * Handles when a game is removed from GameCard or SavedGamesModal
     * @param {number} gameId - ID of the removed game
     */
    onGameRemoved(gameId) {
      this.updateSavedGamesCount()
      console.log('Game removed:', gameId)
    },

    /**
     * Handles when all saved games are cleared
     */
    onGamesClear() {
      this.updateSavedGamesCount()
      console.log('All saved games cleared')
    },

    /**
     * Opens the saved games modal
     */
    openSavedGamesModal() {
      this.showSavedGamesModal = true
    },

    /**
     * Closes the saved games modal
     */
    closeSavedGamesModal() {
      this.showSavedGamesModal = false
      // Update count when modal closes (in case changes were made)
      this.updateSavedGamesCount()
    },
  },
}
</script>

<style>
body { background-color: #09090b; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #09090b; }
::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
</style>