<template>
  <!-- Modern game card with glassmorphism and enhanced layout -->
  <div v-if="game" class="game-card-container group">
    <div class="bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/20">
      <!-- Hero image section with overlay -->
      <div class="relative h-64 md:h-80 overflow-hidden">
        <!-- Game background image with gradient overlay -->
        <img
          :src="game.background_image || '/placeholder-game.jpg'"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          :alt="game.name"
        />
        <!-- Gradient overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <!-- Floating rating badge -->
        <div class="absolute top-4 right-4">
          <div :class="['flex items-center px-3 py-2 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg', getRatingClass(game.rating)]">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span class="text-sm font-bold">{{ game.rating.toFixed(1) }}</span>
          </div>
        </div>

        <!-- Game title overlay -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            {{ game.name }}
          </h2>
          <!-- Release date with icon -->
          <div class="flex items-center text-blue-200">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-sm font-medium">{{ formatDate(game.released) }}</span>
          </div>
        </div>
      </div>

      <!-- Card content section -->
      <div class="p-6 md:p-8 space-y-6">
        <!-- Genre tags -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="genre in game.genres"
            :key="genre.id"
            class="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-200 text-sm font-medium rounded-full border border-purple-400/30 backdrop-blur-sm hover:from-purple-500/30 hover:to-blue-500/30 transition-colors duration-200"
          >
            {{ genre.name }}
          </span>
        </div>

        <!-- Game description -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Description
          </h3>
          <div class="bg-white/5 rounded-xl p-4 border border-white/10">
            <p class="text-blue-100 leading-relaxed">
              {{ description || 'Loading description...' }}
            </p>
          </div>
        </div>

        <!-- Platforms section -->
        <div class="space-y-3">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Available Platforms
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="platform in game.platforms"
              :key="platform.platform.id"
              class="px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-200 flex items-center"
            >
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {{ platform.platform.name }}
            </span>
          </div>
        </div>

        <!-- Game stats grid -->
        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ game.rating.toFixed(1) }}</div>
            <div class="text-xs text-blue-200">Rating</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ game.genres?.length || 0 }}</div>
            <div class="text-xs text-blue-200">Genres</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-white">{{ game.platforms?.length || 0 }}</div>
            <div class="text-xs text-blue-200">Platforms</div>
          </div>
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
     * @returns {string} Tailwind CSS class for background color with glassmorphism
     */
    getRatingClass(rating) {
      // Green gradient for excellent rating (4+)
      if (rating >= 4) return 'bg-gradient-to-r from-green-500/80 to-emerald-500/80 text-white'
      // Yellow gradient for good rating (2.5-3.9)
      if (rating >= 2.5) return 'bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white'
      // Red gradient for low rating (<2.5)
      return 'bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white'
    },
  },
}
</script>

<style scoped>
/* Enhanced game card animations and effects */
.game-card-container {
  perspective: 1000px;
}

.game-card-container:hover .bg-white\/10 {
  transform: rotateY(1deg) rotateX(1deg);
}

/* Smooth image scaling on hover */
.group:hover img {
  filter: brightness(1.1) contrast(1.05);
}

/* Enhanced text shadow for overlay text */
.game-card-container h2 {
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

/* Custom scrollbar for description if needed */
.description-container::-webkit-scrollbar {
  width: 4px;
}

.description-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.description-container::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.6);
  border-radius: 2px;
}

/* Floating animation for rating badge */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.game-card-container:hover .absolute.top-4.right-4 > div {
  animation: float 2s ease-in-out infinite;
}

/* Genre tag hover effects */
.genre-tag {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.genre-tag:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4));
  transform: translateY(-2px);
}

/* Platform tag pulse effect */
.platform-tag .animate-pulse {
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

/* Stats animation on hover */
.game-card-container:hover .grid > div {
  animation: statsGlow 0.5s ease-in-out;
}

@keyframes statsGlow {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
