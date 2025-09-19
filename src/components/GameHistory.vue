<template>
  <!-- Container for the history of displayed games -->
  <!-- Shows only if there are games in the history -->
  <div class="history-container mt-8" v-if="gameHistory.length > 0">
    <!-- Title of the history section -->
    <h5 class="font-semibold mb-2">Games already viewed in this session:</h5>
    <!-- Flexible container for game tags -->
    <div class="flex flex-wrap">
      <!-- Tag for each game in the history -->
      <!-- Each tag is clickable and has a hover effect -->
      <span
        v-for="(game, index) in gameHistory"
        :key="index"
        class="inline-block px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded mr-1 mb-1 cursor-pointer hover:bg-gray-300"
      >
        {{ game.name }}
      </span>
    </div>
  </div>
</template>

<script>
/**
 * GameHistory Component
 *
 * Displays the history of games already viewed during the current session.
 * This component helps the user keep track of which games have already been
 * generated, avoiding duplicates and providing a visual reference.
 *
 * Features:
 * - Shows only if there are games in the history
 * - Games are displayed as clickable tags
 * - Responsive layout with flex-wrap
 * - Hover effects to improve interactivity
 */
export default {
  name: 'GameHistory',

  // Props received from the parent component (App.vue)
  props: {
    // Array containing the history of displayed games
    // Each element has at least { id, name }
    gameHistory: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
/* Styles specific to this component */
/* Currently there are no custom CSS styles - everything is handled through Tailwind CSS */
/* Game tags use Tailwind classes for:
 * - Layout and spacing (px-2 py-1 mr-1 mb-1)
 * - Typography (text-xs font-semibold)
 * - Colors (text-gray-700 bg-gray-200)
 * - Interactivity (cursor-pointer hover:bg-gray-300)
 * - Shape (rounded)
 */
</style>
