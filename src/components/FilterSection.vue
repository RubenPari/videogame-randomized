<template>
  <!-- Filter section to customize game search -->
  <!-- Container with white background, rounded borders and shadow -->
  <div class="filter-section bg-white rounded-lg p-5 shadow-sm mb-5">
    <!-- Responsive grid: 1 column on mobile, 3 on desktop -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Game genre selection -->
      <div>
        <label for="genreSelect" class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
        <!-- Dropdown to select a specific genre or all genres -->
        <select id="genreSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="localFilters.genre">
          <option value="">All genres</option>
          <!-- Dynamically generates options from available genres -->
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Slider to select minimum rating -->
      <div>
        <!-- Label showing the current rating value -->
        <label for="ratingRange" class="block text-sm font-medium text-gray-700 mb-2"
          >Minimum rating: {{ localFilters.minRating }}</label
        >
        <!-- Slider from 0 to 5 with 0.1 increments -->
        <input
          type="range"
          class="w-full"
          id="ratingRange"
          min="0"
          max="5"
          step="0.1"
          v-model="localFilters.minRating"
        />
      </div>

      <!-- Year range selection to filter games by release date -->
      <div>
        <!-- Shows the currently selected range -->
        <label for="yearRange" class="block text-sm font-medium text-gray-700 mb-2">Year range: {{ displayYearRange }}</label>
        <div class="year-range-container">
          <!-- Dropdown for start year -->
          <div class="flex items-center">
            <label class="text-sm mr-2">From:</label>
            <select class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="localFilters.startYear">
              <option v-for="year in availableYears" :key="'start-' + year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <!-- Dropdown for end year -->
          <div class="flex items-center mt-2">
            <label class="text-sm mr-2">To:</label>
            <select class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="localFilters.endYear">
              <option v-for="year in availableYears" :key="'end-' + year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
        <!-- Button to reset year range to default values -->
        <button class="px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100 mt-2" @click="resetYearRange">
          Reset years
        </button>
      </div>
    </div>

    <!-- Second row: platform selection and sorting -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <!-- Multiple platform selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Platform</label>
        <!-- Scrollable container with checkbox for each platform -->
        <div class="platform-select-container max-h-52 overflow-y-auto p-2 border border-gray-300 rounded-md bg-gray-50">
          <!-- Checkbox for each available platform -->
          <div v-for="platform in platforms" :key="platform.id" class="flex items-center mb-1">
            <input
              type="checkbox"
              class="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              :id="'platform-' + platform.id"
              :value="platform.id"
              v-model="selectedPlatforms"
              @change="updatePlatforms"
            />
            <label class="text-sm" :for="'platform-' + platform.id">{{
              platform.name
            }}</label>
          </div>
          <!-- Buttons to select/deselect all platforms -->
          <!-- Shows only if there are more than 10 platforms -->
          <div v-if="platforms.length > 10" class="mt-2">
            <button class="px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100" @click="selectAllPlatforms">
              Select all
            </button>
            <button class="px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-100 ml-2" @click="deselectAllPlatforms">
              Deselect all
            </button>
          </div>
        </div>
      </div>

      <!-- Sort criteria selection -->
      <div>
        <label for="orderSelect" class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
        <!-- Dropdown to choose how to sort results -->
        <select id="orderSelect" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="localFilters.ordering">
          <option value="-rating">Rating (high→low)</option>          <!-- For descending rating -->
          <option value="rating">Rating (low→high)</option>           <!-- For ascending rating -->
          <option value="-released">Release date (recent→old)</option> <!-- Most recent release date first -->
          <option value="released">Release date (old→recent)</option>  <!-- Oldest release date first -->
          <option value="-added">Popularity (high→low)</option>       <!-- For descending popularity -->
        </select>
      </div>
    </div>

    <!-- Main button to generate a random game -->
    <!-- Disabled during loading, shows animated spinner -->
    <button class="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors mt-4 disabled:bg-gray-400" @click="onGenerate" :disabled="isLoading">
      <!-- Loading state with spinner -->
      <span v-if="isLoading" class="flex items-center justify-center">
        <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
        Generating...
      </span>
      <!-- Normal state -->
      <span v-else>Generate Random Video Game</span>
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
/* Styles specific to this component */
/* Container for year range selection */
.year-range-container {
  margin-top: 5px;  /* Small top margin for spacing */
}
</style>
