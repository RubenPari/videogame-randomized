<template>
  <!-- Enhanced game history section with modern design -->
  <Transition name="slide-up">
    <div v-if="gameHistory.length > 0" class="history-section">
      <div class="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-xl">
        <!-- Section header with icon and stats -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <div class="bg-gradient-to-r from-amber-400 to-orange-400 p-3 rounded-2xl mr-4">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Session History</h3>
              <p class="text-blue-200 text-sm">Games you've discovered this session</p>
            </div>
          </div>
          <!-- Games count badge -->
          <div class="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-purple-400/30">
            <span class="text-purple-200 text-sm font-medium">
              {{ gameHistory.length }} game{{ gameHistory.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Game history grid with animations -->
        <div class="space-y-3">
          <Transition name="stagger-fade" appear>
            <div class="grid gap-2">
              <div
                v-for="(game, index) in gameHistory"
                :key="game.id"
                :style="{ animationDelay: `${index * 100}ms` }"
                class="game-history-item group"
              >
                <div class="flex items-center p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-400/30 hover:bg-white/10 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg">
                  <!-- Game index number -->
                  <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white text-sm font-bold">{{ index + 1 }}</span>
                  </div>

                  <!-- Game name with truncation -->
                  <div class="flex-grow min-w-0">
                    <p class="text-white font-medium truncate group-hover:text-purple-200 transition-colors duration-200">
                      {{ game.name }}
                    </p>
                  </div>

                  <!-- Status indicator -->
                  <div class="flex-shrink-0 ml-3">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Clear history action -->
        <div class="mt-6 pt-4 border-t border-white/10">
          <button
            @click="$emit('clear-history')"
            class="text-red-300 hover:text-red-100 text-sm font-medium transition-colors duration-200 flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Clear session history
          </button>
        </div>
      </div>
    </div>
  </Transition>
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
/* Enhanced animations and transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Staggered animation for game items */
.game-history-item {
  animation: slideInUp 0.6s ease-out both;
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hover effects for game items */
.game-history-item:hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
}

/* Enhanced number badge animation */
.game-history-item:hover .bg-gradient-to-r {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

/* Pulse effect for status indicator */
.game-history-item:hover .animate-pulse {
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
}

/* Clear button hover effect */
button:hover svg {
  animation: wiggle 0.3s ease-in-out;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .game-history-item .truncate {
    max-width: 150px;
  }
}
</style>
