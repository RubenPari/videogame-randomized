<template>
  <div class="filter-section">
    <div class="row">
      <div class="col-md-4 mb-3">
        <label for="genreSelect" class="form-label">Genere</label>
        <select id="genreSelect" class="form-select" v-model="localFilters.genre">
          <option value="">Tutti i generi</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <div class="col-md-4 mb-3">
        <label for="ratingRange" class="form-label"
          >Voto minimo: {{ localFilters.minRating }}</label
        >
        <input
          type="range"
          class="form-range"
          id="ratingRange"
          min="0"
          max="5"
          step="0.1"
          v-model="localFilters.minRating"
        />
      </div>

      <div class="col-md-4 mb-3">
        <label for="yearRange" class="form-label">Intervallo anni: {{ displayYearRange }}</label>
        <div class="year-range-container">
          <div class="d-flex align-items-center">
            <label class="form-label me-2 small">Da:</label>
            <select class="form-select form-select-sm" v-model="localFilters.startYear">
              <option v-for="year in availableYears" :key="'start-' + year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="d-flex align-items-center mt-2">
            <label class="form-label me-2 small">A:</label>
            <select class="form-select form-select-sm" v-model="localFilters.endYear">
              <option v-for="year in availableYears" :key="'end-' + year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </div>
        <button class="btn btn-sm btn-outline-secondary mt-2" @click="resetYearRange">
          Reset anni
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">Piattaforma</label>
        <div class="platform-select-container">
          <div v-for="platform in platforms" :key="platform.id" class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              :id="'platform-' + platform.id"
              :value="platform.id"
              v-model="selectedPlatforms"
              @change="updatePlatforms"
            />
            <label class="form-check-label" :for="'platform-' + platform.id">{{
              platform.name
            }}</label>
          </div>
          <div v-if="platforms.length > 10" class="mt-2">
            <button class="btn btn-sm btn-outline-secondary" @click="selectAllPlatforms">
              Seleziona tutte
            </button>
            <button class="btn btn-sm btn-outline-secondary ms-2" @click="deselectAllPlatforms">
              Deseleziona tutte
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <label for="orderSelect" class="form-label">Ordina per</label>
        <select id="orderSelect" class="form-select" v-model="localFilters.ordering">
          <option value="-rating">Voto (alto→basso)</option>
          <option value="rating">Voto (basso→alto)</option>
          <option value="-released">Data di uscita (recente→vecchio)</option>
          <option value="released">Data di uscita (vecchio→recente)</option>
          <option value="-added">Popolarità (alto→basso)</option>
        </select>
      </div>
    </div>

    <button class="btn btn-primary generate-btn" @click="onGenerate" :disabled="isLoading">
      <span v-if="isLoading">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Generazione in corso...
      </span>
      <span v-else>Genera Videogioco Casuale</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'FilterSection',

  props: {
    genres: {
      type: Array,
      default: () => [],
    },
    platforms: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Object,
      default: () => ({
        genre: '',
        platform: '',
        minRating: 0,
        startYear: 2010,
        endYear: new Date().getFullYear(),
        ordering: '-rating',
      }),
    },
  },

  data() {
    const currentYear = new Date().getFullYear()
    return {
      localFilters: { ...this.filters },
      selectedPlatforms: [],
      availableYears: Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i),
    }
  },

  computed: {
    displayYearRange() {
      if (!this.localFilters.startYear && !this.localFilters.endYear) {
        return 'Tutti'
      }
      return `${this.localFilters.startYear || 1980} - ${this.localFilters.endYear || 'oggi'}`
    },
  },

  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      },
      deep: true,
    },
  },

  methods: {
    onGenerate() {
      this.$emit('generate', this.localFilters)
    },

    resetYearRange() {
      this.localFilters.startYear = null
      this.localFilters.endYear = null
    },

    updatePlatforms() {
      // Aggiorna il filtro delle piattaforme con l'array di piattaforme selezionate
      this.localFilters.platforms = this.selectedPlatforms.length > 0 ? this.selectedPlatforms : []
    },

    selectAllPlatforms() {
      this.selectedPlatforms = this.platforms.map((platform) => platform.id)
      this.updatePlatforms()
    },

    deselectAllPlatforms() {
      this.selectedPlatforms = []
      this.updatePlatforms()
    },
  },

  created() {
    // Inizializza le piattaforme selezionate se il filtro ha già valori
    if (this.filters.platforms && this.filters.platforms.length > 0) {
      this.selectedPlatforms = [...this.filters.platforms]
    }
  },
}
</script>

<style scoped>
.filter-section {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.year-range-container {
  margin-top: 5px;
}

.platform-select-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #f8f9fa;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
