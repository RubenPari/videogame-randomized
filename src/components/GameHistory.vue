<template>
  <div class="history-container" v-if="gameHistory.length > 0">
    <h5>Giochi già visualizzati in questa sessione:</h5>
    <div class="d-flex flex-wrap">
      <span
        v-for="(game, index) in gameHistory"
        :key="index"
        class="badge bg-secondary history-pill me-1 mb-1"
      >
        {{ game.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameHistory',

  props: {
    gameHistory: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.history-container {
  margin-top: 2rem;
}

.history-pill {
  margin: 2px;
  cursor: pointer;
}
</style>
