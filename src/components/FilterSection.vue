<template>
  <!-- Modern glassmorphism filter section -->
  <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
    <!-- Filter header with icon -->
    <div class="flex items-center mb-8">
      <div class="bg-gradient-to-r from-purple-400 to-blue-400 p-3 rounded-2xl mr-4">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-white">Customize Your Search</h2>
        <p class="text-blue-200">Fine-tune your preferences to find the perfect game</p>
      </div>
    </div>

    <!-- Primary filters grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Genre selection with enhanced styling -->
      <div class="space-y-3">
        <label for="genreSelect" class="block text-sm font-semibold text-white flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Genre
        </label>
        <select
          id="genreSelect"
          class="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          v-model="localFilters.genre"
        >
          <option value="" class="bg-gray-800 text-white">All genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id" class="bg-gray-800 text-white">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Rating slider with visual feedback -->
      <div class="space-y-3">
        <label for="ratingRange" class="block text-sm font-semibold text-white flex items-center justify-between">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            Minimum Rating
          </span>
          <span class="bg-gradient-to-r from-purple-400 to-blue-400 px-3 py-1 rounded-full text-sm font-bold">
            {{ localFilters.minRating }}★
          </span>
        </label>
        <div class="relative">
          <input
            type="range"
            class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            id="ratingRange"
            min="0"
            max="5"
            step="0.1"
            v-model="localFilters.minRating"
          />
        </div>
      </div>

      <!-- Year range with modern selectors -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-white flex items-center justify-between">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Release Period
          </span>
          <span class="text-blue-200 text-sm">{{ displayYearRange }}</span>
        </label>
        <div class="grid grid-cols-2 gap-2">
          <select class="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" v-model="localFilters.startYear">
            <option v-for="year in availableYears" :key="'start-' + year" :value="year" class="bg-gray-800">
              {{ year }}
            </option>
          </select>
          <select class="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" v-model="localFilters.endYear">
            <option v-for="year in availableYears" :key="'end-' + year" :value="year" class="bg-gray-800">
              {{ year }}
            </option>
          </select>
        </div>
        <button
          class="text-blue-300 hover:text-white text-sm underline transition-colors duration-200"
          @click="resetYearRange"
        >
          Reset to all years
        </button>
      </div>
    </div>

    <!-- Secondary filters -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Platform selection with improved design -->
      <div class="space-y-3">
        <label class="block text-sm font-semibold text-white flex items-center justify-between">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Platforms
          </span>
          <span class="text-blue-200 text-sm">{{ selectedPlatforms.length }} selected</span>
        </label>
        <div class="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 max-h-48 overflow-y-auto custom-scrollbar">
          <div class="space-y-2">
            <div v-for="platform in platforms" :key="platform.id" class="flex items-center group">
              <input
                type="checkbox"
                class="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2"
                :id="'platform-' + platform.id"
                :value="platform.id"
                v-model="selectedPlatforms"
                @change="updatePlatforms"
              />
              <label
                class="ml-3 text-sm text-blue-100 group-hover:text-white cursor-pointer transition-colors duration-200"
                :for="'platform-' + platform.id"
              >
                {{ platform.name }}
              </label>
            </div>
          </div>
          <div v-if="platforms.length > 10" class="flex gap-2 mt-4 pt-4 border-t border-white/10">
            <button
              class="px-3 py-1 text-xs bg-purple-500/20 text-purple-200 rounded-lg hover:bg-purple-500/30 transition-colors duration-200"
              @click="selectAllPlatforms"
            >
              Select All
            </button>
            <button
              class="px-3 py-1 text-xs bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors duration-200"
              @click="deselectAllPlatforms"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <!-- Sort options with icon -->
      <div class="space-y-3">
        <label for="orderSelect" class="block text-sm font-semibold text-white flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path>
          </svg>
          Sort Results
        </label>
        <select
          id="orderSelect"
          class="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          v-model="localFilters.ordering"
        >
          <option value="-rating" class="bg-gray-800">🌟 Best Rated First</option>
          <option value="rating" class="bg-gray-800">⭐ Lowest Rated First</option>
          <option value="-released" class="bg-gray-800">🗓️ Newest First</option>
          <option value="released" class="bg-gray-800">📅 Oldest First</option>
          <option value="-added" class="bg-gray-800">🔥 Most Popular</option>
        </select>
      </div>
    </div>

    <!-- Generate button with enhanced design -->
    <button
      class="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
      @click="onGenerate"
      :disabled="isLoading"
    >
      <span v-if="isLoading" class="flex items-center justify-center">
        <svg class="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating Magic...
      </span>
      <span v-else class="flex items-center justify-center">
        <svg class="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        Discover Your Next Adventure
      </span>
    </button>
  </div>
</template>

<script>
/**
 * FilterSection Component
 *
 * Manages all available filters for game search:
 * - Genre
 * - Minimum rating
 * - Year range
 * - Platforms
 * - Sort criteria
 *
 * Emits a 'generate' event with selected filters when
 * the user clicks the generation button
 */
export default {
  name: 'FilterSection',

  // Props received from parent component (App.vue)
  props: {
    // Array of available genres from API
    genres: {
      type: Array,
      default: () => [],
    },
    // Array of available platforms from API
    platforms: {
      type: Array,
      default: () => [],
    },
    // Flag to indicate if loading is in progress
    isLoading: {
      type: Boolean,
      default: false,
    },
    // Object with current filters passed from parent
    filters: {
      type: Object,
      default: () => ({
        genre: '',                           // Selected genre ID
        platform: '',                        // Selected platform ID
        minRating: 0,                        // Minimum rating (0-5)
        startYear: 2010,                     // Range start year
        endYear: new Date().getFullYear(),   // Range end year
        ordering: '-rating',                 // Sort criteria
      }),
    },
  },

  /**
   * Component local data
   */
  data() {
    const currentYear = new Date().getFullYear()
    return {
      // Local copy of filters to avoid direct prop mutations
      localFilters: { ...this.filters },
      // Array of selected platforms (checkbox)
      selectedPlatforms: [],
      // Array of available years from 1980 to current year in descending order
      availableYears: Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i),
    }
  },

  /**
   * Computed properties
   */
  computed: {
    /**
     * Formats the year range for display in the interface
     * @returns {string} Formatted range (e.g. "2010 - 2024" or "All")
     */
    displayYearRange() {
      // If no year is selected, show "All"
      if (!this.localFilters.startYear && !this.localFilters.endYear) {
        return 'All'
      }
      // Otherwise show the range with default values if needed
      return `${this.localFilters.startYear || 1980} - ${this.localFilters.endYear || 'today'}`
    },
  },

  /**
   * Watchers to react to prop changes
   */
  watch: {
    // Synchronizes local filters when props change from parent
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      },
      deep: true,  // Deep watch to detect changes in nested properties
    },
  },

  methods: {
    /**
     * Emits the 'generate' event with current filters
     * Called when user clicks the "Generate" button
     */
    onGenerate() {
      this.$emit('generate', this.localFilters)
    },

    /**
     * Resets year range to default values (null = all years)
     */
    resetYearRange() {
      this.localFilters.startYear = null
      this.localFilters.endYear = null
    },

    /**
     * Updates platform filter with selected checkboxes
     * Called every time platform selection changes
     */
    updatePlatforms() {
      // Updates platforms filter with array of selected platforms
      this.localFilters.platforms = this.selectedPlatforms.length > 0 ? this.selectedPlatforms : []
    },

    /**
     * Selects all available platforms
     */
    selectAllPlatforms() {
      // Maps all platform IDs
      this.selectedPlatforms = this.platforms.map((platform) => platform.id)
      this.updatePlatforms()
    },

    /**
     * Deselects all platforms
     */
    deselectAllPlatforms() {
      this.selectedPlatforms = []
      this.updatePlatforms()
    },
  },

  /**
   * Lifecycle hook - called when component is created
   * Initializes selected platforms if already present in filters
   */
  created() {
    // If there are already selected platforms in filters passed from parent,
    // initialize selectedPlatforms array with these values
    if (this.filters.platforms && this.filters.platforms.length > 0) {
      this.selectedPlatforms = [...this.filters.platforms]
    }
  },
}
</script>

<style scoped>
/* Enhanced slider styling */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  border: 2px solid white;
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  border: 2px solid white;
}

.slider::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.slider::-moz-range-track {
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
}

/* Custom scrollbar for platform selection */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.6);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.8);
}

/* Enhanced focus states */
select:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
}

/* Smooth transitions for all interactive elements */
input, select, button {
  transition: all 0.2s ease-in-out;
}

/* Hover effects for labels */
label:hover {
  transform: translateX(2px);
  transition: transform 0.2s ease;
}
</style>
