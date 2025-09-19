<template>
  <!-- Main application container with maximum width and horizontal padding -->
  <div class="max-w-4xl mx-auto px-5">
    <!-- Main application title -->
    <h1 class="text-center text-3xl font-bold my-4">Random Video Game Generator</h1>

    <!-- Filter section for game search -->
    <!-- Passes genres, platforms and filters to child component -->
    <!-- Listens to @generate event to generate a new random game -->
    <FilterSection
      :genres="genres"
      :platforms="platforms"
      :filters="filters"
      :isLoading="isLoading"
      @generate="generateRandomGame"
    />

    <!-- Currently selected game card -->
    <!-- Shows only if there's a current game to display -->
    <GameCard v-if="currentGame" :game="currentGame" :description="gameDescription" />

    <!-- Loading state with animated spinner -->
    <!-- Shows during data loading from API -->
    <div v-else-if="isLoading" class="text-center">
      <div class="loading-spinner" role="status">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <!-- Empty state when no game has been generated yet -->
    <div v-else class="empty-state">
      <p class="text-gray-500">No game generated. Press the "Generate" button to start!</p>
    </div>

    <!-- History of previously displayed games -->
    <!-- Shows all games already seen by the user -->
    <GameHistory :gameHistory="gameHistory" />

    <!-- Error messages with red styling -->
    <!-- Displays any errors during loading or generation -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
// Import of Vue components necessary for the interface
import FilterSection from './components/FilterSection.vue'
import GameCard from './components/GameCard.vue'
import GameHistory from './components/GameHistory.vue'
// API service to communicate with RAWG API
import apiService from './services/api'

/**
 * Main component of the Random Video Game Generator application
 * Manages the global state of the app and coordinates child components
 */
export default {
  name: 'App',

  // Registration of child components used in the template
  components: {
    FilterSection,
    GameCard,
    GameHistory,
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
    }
  },

  /**
   * Vue lifecycle hook - called after component creation
   * Loads necessary initial data (genres and platforms)
   */
  created() {
    this.fetchGenres()
    this.fetchPlatforms()
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
  },
}
</script>

<style>
/* Styles for loading spinner */
.loading-spinner {
  margin: 30px auto;  /* Centers spinner with vertical margins */
}

/* Styles for empty state when no game has been generated */
.empty-state {
  text-align: center;  /* Centers text */
  padding: 40px 0;     /* Vertical padding for spacing */
}
</style>
