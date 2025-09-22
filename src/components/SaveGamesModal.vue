<template>
  <!-- Modal overlay -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
        <!-- Background overlay with backdrop blur -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div>

        <!-- Modal container -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="relative w-full max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            @click.stop>
            <!-- Modal header -->
            <div class="flex items-center justify-between p-6 border-b border-white/10">
              <div class="flex items-center">
                <div class="bg-gradient-to-r from-purple-400 to-blue-400 p-3 rounded-2xl mr-4">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white">Your Saved Games</h2>
                  <p class="text-blue-200">{{ savedGames.length }} game{{ savedGames.length !== 1 ? 's' : '' }} in your
                    collection</p>
                </div>
              </div>

              <!-- Close button -->
              <button @click="$emit('close')"
                class="p-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors duration-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Modal content -->
            <div class="p-6">
              <!-- Statistics section -->
              <div v-if="statistics.totalGames > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white">{{ statistics.totalGames }}</div>
                    <div class="text-sm text-blue-200">Total Games</div>
                  </div>
                </div>
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white">{{ statistics.averageRating }}</div>
                    <div class="text-sm text-blue-200">Avg Rating</div>
                  </div>
                </div>
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-white">{{ Object.keys(statistics.genreCount).length }}</div>
                    <div class="text-sm text-blue-200">Genres</div>
                  </div>
                </div>
              </div>

              <!-- Search and filter -->
              <div class="mb-6">
                <div class="relative">
                  <input v-model="searchQuery" type="text" placeholder="Search your saved games..."
                    class="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              <!-- Games grid -->
              <div class="max-h-96 overflow-y-auto custom-scrollbar">
                <div v-if="filteredGames.length === 0" class="text-center py-8">
                  <div
                    class="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                      </path>
                    </svg>
                  </div>
                  <p class="text-white text-lg font-medium mb-2">
                    {{ searchQuery ? 'No games found' : 'No saved games yet' }}
                  </p>
                  <p class="text-blue-200">
                    {{ searchQuery ? 'Try a different search term' : 'Start saving games to see them here!' }}
                  </p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="game in filteredGames" :key="game.id"
                    class="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:transform hover:scale-[1.02]">
                    <div class="flex">
                      <!-- Game image -->
                      <div class="w-24 h-24 flex-shrink-0">
                        <img :src="game.background_image || '/placeholder-game.jpg'" :alt="game.name"
                          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      <!-- Game info -->
                      <div class="flex-grow p-4 flex flex-col justify-between">
                        <div>
                          <h3
                            class="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-purple-200 transition-colors duration-200">
                            {{ game.name }}
                          </h3>
                          <p class="text-blue-200 text-xs mb-2">
                            {{ formatDate(game.released) }}
                          </p>
                        </div>

                        <div class="flex items-center justify-between">
                          <!-- Rating -->
                          <div class="flex items-center">
                            <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                              </path>
                            </svg>
                            <span class="text-white text-sm">{{ parseFloat(game.rating)?.toFixed(1) || 'N/A' }}</span>
                          </div>

                          <!-- Remove button -->
                          <button @click="removeGame(game.id)"
                            class="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-100 transition-all duration-200 transform hover:scale-110"
                            :title="`Remove ${game.name} from collection`">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                              </path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="savedGames.length > 0"
                class="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                <button @click="clearAllGames"
                  class="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 hover:text-red-100 transition-colors duration-200 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                  </svg>
                  Clear All
                </button>

                <button @click="exportGames"
                  class="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 hover:text-blue-100 transition-colors duration-200 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import databaseService from '@/services/database'

export default {
  name: 'SavedGamesModal',

  emits: ['close', 'game-removed', 'games-cleared'],

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      savedGames: [],
      statistics: {
        totalGames: 0,
        averageRating: 0,
        genreCount: {},
        platformCount: {}
      },
      searchQuery: ''
    }
  },

  computed: {
    filteredGames() {
      if (!this.searchQuery.trim()) {
        return this.savedGames
      }

      const query = this.searchQuery.toLowerCase()
      return this.savedGames.filter(game => {
        return game.name.toLowerCase().includes(query) ||
          (game.genres && game.genres.some(genre => genre.name.toLowerCase().includes(query)))
      })
    }
  },

  watch: {
    show: {
      handler(newVal) {
        if (newVal) {
          this.loadSavedGames()
        }
      },
      immediate: true
    }
  },

  methods: {
    async loadSavedGames() {
      this.savedGames = await databaseService.getSavedGames()
      this.statistics = await databaseService.getStatistics()
    },

    async removeGame(gameId) {
      const success = await databaseService.removeGame(gameId)

      if (success) {
        await this.loadSavedGames() // Refresh the list
        this.$emit('game-removed', gameId)
      } else {
        console.error('Failed to remove game:', gameId)
      }
    },

    async clearAllGames() {
      if (confirm('Are you sure you want to remove all saved games? This action cannot be undone.')) {
        const success = await databaseService.clearAllSavedGames()

        if (success) {
          await this.loadSavedGames() // Refresh the list
          this.$emit('games-cleared')
        } else {
          console.error('Failed to clear all games')
        }
      }
    },

    exportGames() {
      if (this.savedGames.length === 0) return

      // Create a simplified version for export
      const exportData = this.savedGames.map(game => ({
        id: game.id,
        name: game.name,
        rating: game.rating,
        released: game.released,
        genres: game.genres?.map(g => g.name).join(', '),
        platforms: game.platforms?.map(p => p.platform.name).join(', '),
        savedAt: game.savedAt
      }))

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `saved-games-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    },

    formatDate(dateString) {
      if (!dateString) return 'Unknown date'

      const date = new Date(dateString)
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }
  }
}
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* Custom scrollbar */
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

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced hover effects */
.group:hover img {
  filter: brightness(1.1);
}

/* Button hover animations */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
