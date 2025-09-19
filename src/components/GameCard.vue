<template>
  <!-- Game card with hover effect and transition -->
  <!-- Show only if there's a valid game object -->
  <div class="game-card bg-white rounded-lg shadow-md overflow-hidden mt-8 transition-transform hover:-translate-y-1" v-if="game">
    <!-- Container for the game's background image -->
    <div class="image-container w-full overflow-hidden">
      <!-- Main game image with fallback to placeholder -->
      <img
        :src="game.background_image || '/placeholder-game.jpg'"
        class="game-img w-full h-full object-cover"
        :alt="game.name"
      />
    </div>
    <!-- Main card content with padding -->
    <div class="p-6">
      <!-- Header with title and rating -->
      <div class="flex justify-between items-center mb-3">
        <!-- Game name -->
        <h2 class="text-2xl font-bold">{{ game.name }}</h2>
        <!-- Rating badge with dynamic color based on score -->
        <span :class="['px-3 py-1 rounded-full text-white font-semibold', getRatingClass(game.rating)]">
          {{ game.rating.toFixed(1) }}/5
        </span>
      </div>

      <!-- Tags for release date and genres -->
      <div class="mb-3">
        <!-- Tag with formatted release date -->
        <span class="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded mr-1">{{ formatDate(game.released) }}</span>
        <!-- Tag for each game genre -->
        <span v-for="genre in game.genres" :key="genre.id" class="inline-block px-2 py-1 text-xs font-semibold text-cyan-700 bg-cyan-100 rounded mr-1">{{
          genre.name
        }}</span>
      </div>

      <!-- Game description translated to Italian -->
      <!-- Show loading message if description is not yet available -->
      <p class="text-gray-700">{{ description || 'Loading description...' }}</p>

      <!-- Available platforms section -->
      <div class="mt-3">
        <h6 class="font-semibold mb-2">Platforms:</h6>
        <div>
          <!-- Tag for each platform where the game is available -->
          <span
            v-for="platform in game.platforms"
            :key="platform.platform.id"
            class="inline-block px-2 py-1 text-xs font-semibold text-white bg-gray-800 rounded mr-1 mb-1"
          >
            {{ platform.platform.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * GameCard Component
 *
 * Displays detailed information for a single game:
 * - Background image
 * - Name and rating
 * - Release date and genres
 * - Translated description
 * - Available platforms
 *
 * Includes utilities for formatting dates and determining rating colors
 */
export default {
  name: 'GameCard',

  // Props received from parent component
  props: {
    // Object with all game information
    game: {
      type: Object,
      default: null,
    },
    // Translated game description
    description: {
      type: String,
      default: '',
    },
  },

  methods: {
    /**
     * Formats an ISO date into a readable Italian format
     * @param {string} dateString - Date in ISO format (YYYY-MM-DD)
     * @returns {string} Date formatted in Italian (e.g. "15 gen 2023")
     */
    formatDate(dateString) {
      // Handle missing date case
      if (!dateString) return 'Unknown date'

      // Convert string to Date object and format in Italian
      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',    // Full year (2023)
        month: 'short',     // Abbreviated month (gen, feb, etc.)
        day: 'numeric',     // Numeric day (1, 2, etc.)
      })
    },

    /**
     * Determines the CSS class for the rating badge color
     * @param {number} rating - Game rating (0-5)
     * @returns {string} Tailwind CSS class for background color
     */
    getRatingClass(rating) {
      // Green for excellent rating (4+)
      if (rating >= 4) return 'bg-green-500'
      // Yellow for good rating (2.5-3.9)
      if (rating >= 2.5) return 'bg-yellow-500'
      // Red for low rating (<2.5)
      return 'bg-red-500'
    },
  },
}
</script>

<style scoped>
/* Component-specific styles */
/* Currently no custom CSS styles - everything is handled through Tailwind CSS */
</style>
