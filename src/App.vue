<template>
  <!-- Modern full-screen app with gradient background -->
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main content container -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero section with improved typography -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
          <div class="bg-gradient-to-r from-purple-400 to-blue-400 p-3 rounded-full">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
          Random Video Game Generator
        </h1>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Discover your next gaming adventure with our intelligent recommendation system
        </p>
      </div>

      <!-- Filter section with glassmorphism design -->
      <FilterSection
        :genres="genres"
        :platforms="platforms"
        :filters="filters"
        :isLoading="isLoading"
        @generate="generateRandomGame"
        class="mb-8"
      />

      <!-- Game result section -->
      <div class="space-y-8">
        <!-- Currently selected game card -->
        <GameCard
          v-if="currentGame"
          :game="currentGame"
          :description="gameDescription"
          class="animate-fade-in-up"
        />

        <!-- Enhanced loading state -->
        <div v-else-if="isLoading" class="text-center py-16">
          <div class="relative">
            <!-- Outer spinning ring -->
            <div class="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <!-- Inner pulsing dot -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
          <div class="space-y-2">
            <p class="text-white text-lg font-medium">Finding your perfect game...</p>
            <p class="text-blue-200 text-sm">This might take a moment</p>
          </div>
        </div>

        <!-- Enhanced empty state -->
        <div v-else class="text-center py-16">
          <div class="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto border border-white/10">
            <div class="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">Ready to discover?</h3>
            <p class="text-blue-200 text-lg mb-6">
              Set your preferences above and click "Generate" to find your next favorite game!
            </p>
            <div class="flex flex-wrap justify-center gap-2 text-sm text-blue-300">
              <span class="bg-white/10 px-3 py-1 rounded-full">🎮 Thousands of games</span>
              <span class="bg-white/10 px-3 py-1 rounded-full">🔥 Personalized recommendations</span>
              <span class="bg-white/10 px-3 py-1 rounded-full">⚡ Instant results</span>
            </div>
          </div>
        </div>

        <!-- History of previously displayed games -->
        <GameHistory :gameHistory="gameHistory" />

        <!-- Enhanced error messages -->
        <Transition name="slide-down">
          <div v-if="error" class="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-6 py-4 rounded-2xl mt-6">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>
        </Transition>
      </div>
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
/* Custom animations for enhanced UX */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Utility animations */
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

/* Vue transition classes */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Enhanced scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Glassmorphism utilities */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
