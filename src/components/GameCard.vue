<template>
  <div class="card game-card" v-if="game">
    <div class="image-container">
      <img
        :src="game.background_image || '/placeholder-game.jpg'"
        class="game-img"
        :alt="game.name"
      />
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="card-title">{{ game.name }}</h2>
        <span :class="['badge', getRatingClass(game.rating)]">
          {{ game.rating.toFixed(1) }}/5
        </span>
      </div>

      <div class="mb-3">
        <span class="badge bg-secondary me-1">{{ formatDate(game.released) }}</span>
        <span v-for="genre in game.genres" :key="genre.id" class="badge bg-info me-1">{{
          genre.name
        }}</span>
      </div>

      <p class="card-text">{{ description || 'Caricamento descrizione...' }}</p>

      <div class="mt-3">
        <h6>Piattaforme:</h6>
        <div>
          <span
            v-for="platform in game.platforms"
            :key="platform.platform.id"
            class="badge bg-dark me-1 mb-1"
          >
            {{ platform.platform.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCard',

  props: {
    game: {
      type: Object,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Data sconosciuta'

      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    getRatingClass(rating) {
      if (rating >= 4) return 'bg-success'
      if (rating >= 2.5) return 'bg-warning'
      return 'bg-danger'
    },
  },
}
</script>

<style scoped>
.game-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  transition: transform 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
}

.image-container {
  width: 100%;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.game-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
