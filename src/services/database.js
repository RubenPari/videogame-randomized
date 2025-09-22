import axios from 'axios'

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

/**
 * Configured Axios instance for backend API
 * Automatically includes base URL and common headers
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

/**
 * Database service that manages saved games via PostgreSQL backend
 * Provides methods to add, remove, and check saved games
 */
const databaseService = {
  /**
   * Retrieves all saved games from PostgreSQL database
   * @returns {Promise<Array>} Promise that resolves with array of saved game objects
   */
  async getSavedGames() {
    try {
      const response = await apiClient.get('/saved-games')
      return response.data.games || []
    } catch (error) {
      console.error('Error retrieving saved games:', error)
      // Return empty array on error to prevent app crashes
      return []
    }
  },

  /**
   * Checks if a game is already saved in the database
   * @param {number} gameId - ID of the game to check
   * @returns {Promise<boolean>} Promise that resolves with true if saved, false otherwise
   */
  async isGameSaved(gameId) {
    try {
      const response = await apiClient.get(`/saved-games/check/${gameId}`)
      return response.data.isSaved || false
    } catch (error) {
      console.error('Error checking if game is saved:', error)
      return false
    }
  },

  /**
   * Saves a game to the PostgreSQL database
   * @param {Object} game - Game object to save
   * @param {number} game.id - Game ID
   * @param {string} game.name - Game name
   * @param {string} game.background_image - Game background image URL
   * @param {number} game.rating - Game rating
   * @param {string} game.released - Game release date
   * @param {Array} game.genres - Array of game genres
   * @param {Array} game.platforms - Array of game platforms
   * @returns {Promise<boolean>} Promise that resolves with true if saved successfully
   */
  async saveGame(game) {
    try {
      // Create a clean game object for storage
      const gameToSave = {
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        rating: game.rating,
        released: game.released,
        genres: game.genres || [],
        platforms: game.platforms || [],
        metacritic: game.metacritic,
        description_raw: game.description_raw,
      }

      const response = await apiClient.post('/saved-games', gameToSave)

      if (response.status === 201) {
        console.log('Game saved successfully:', game.name)
        return true
      }
      return false
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 409) {
        console.warn('Game is already saved:', game.name)
        return false
      }
      console.error('Error saving game:', error)
      return false
    }
  },

  /**
   * Removes a game from the saved collection in PostgreSQL
   * @param {number} gameId - ID of the game to remove
   * @returns {Promise<boolean>} Promise that resolves with true if removed successfully
   */
  async removeGame(gameId) {
    try {
      const response = await apiClient.delete(`/saved-games/${gameId}`)

      if (response.status === 200) {
        console.log('Game removed successfully:', gameId)
        return true
      }
      return false
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn('Game not found in saved games:', gameId)
        return false
      }
      console.error('Error removing game:', error)
      return false
    }
  },

  /**
   * Gets a saved game by ID from PostgreSQL
   * @param {number} gameId - ID of the game to retrieve
   * @returns {Promise<Object|null>} Promise that resolves with game object or null
   */
  async getSavedGame(gameId) {
    try {
      const response = await apiClient.get(`/saved-games/${gameId}`)
      return response.data.game || null
    } catch (error) {
      if (error.response?.status === 404) {
        return null
      }
      console.error('Error retrieving saved game:', error)
      return null
    }
  },

  /**
   * Clears all saved games for the current user
   * @returns {Promise<boolean>} Promise that resolves with true if cleared successfully
   */
  async clearAllSavedGames() {
    try {
      const response = await apiClient.delete('/saved-games')

      if (response.status === 200) {
        console.log('All saved games cleared')
        return true
      }
      return false
    } catch (error) {
      console.error('Error clearing saved games:', error)
      return false
    }
  },

  /**
   * Gets statistics about saved games from PostgreSQL
   * @returns {Promise<Object>} Promise that resolves with statistics object
   */
  async getStatistics() {
    try {
      const response = await apiClient.get('/saved-games/statistics')
      return response.data.statistics || {
        totalGames: 0,
        averageRating: 0,
        genreCount: {},
        platformCount: {}
      }
    } catch (error) {
      console.error('Error retrieving statistics:', error)
      return {
        totalGames: 0,
        averageRating: 0,
        genreCount: {},
        platformCount: {}
      }
    }
  },

  /**
   * Searches saved games by name or genre
   * @param {string} query - Search query
   * @returns {Promise<Array>} Promise that resolves with filtered games array
   */
  async searchSavedGames(query) {
    try {
      const response = await apiClient.get(`/saved-games/search?q=${encodeURIComponent(query)}`)
      return response.data.games || []
    } catch (error) {
      console.error('Error searching saved games:', error)
      return []
    }
  },

  /**
   * Updates a saved game's information
   * @param {number} gameId - ID of the game to update
   * @param {Object} updateData - Data to update
   * @returns {Promise<boolean>} Promise that resolves with true if updated successfully
   */
  async updateSavedGame(gameId, updateData) {
    try {
      const response = await apiClient.put(`/saved-games/${gameId}`, updateData)

      if (response.status === 200) {
        console.log('Game updated successfully:', gameId)
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating saved game:', error)
      return false
    }
  },

  /**
   * Exports all saved games as JSON
   * @returns {Promise<Object>} Promise that resolves with export data
   */
  async exportSavedGames() {
    try {
      const response = await apiClient.get('/saved-games/export')
      return response.data
    } catch (error) {
      console.error('Error exporting saved games:', error)
      throw error
    }
  },

  /**
   * Imports saved games from JSON data
   * @param {Object} importData - Data to import
   * @returns {Promise<boolean>} Promise that resolves with true if imported successfully
   */
  async importSavedGames(importData) {
    try {
      const response = await apiClient.post('/saved-games/import', importData)

      if (response.status === 200) {
        console.log('Games imported successfully')
        return true
      }
      return false
    } catch (error) {
      console.error('Error importing saved games:', error)
      return false
    }
  },

  /**
   * Adds a personal note to a saved game
   * @param {number} gameId - ID of the game
   * @param {string} note - Personal note to add
   * @returns {Promise<boolean>} Promise that resolves with true if note added successfully
   */
  async addGameNote(gameId, note) {
    try {
      const response = await apiClient.post(`/saved-games/${gameId}/note`, { note })

      if (response.status === 200) {
        console.log('Note added successfully to game:', gameId)
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding note to game:', error)
      return false
    }
  },

  /**
   * Adds a rating to a saved game
   * @param {number} gameId - ID of the game
   * @param {number} personalRating - Personal rating (1-5)
   * @returns {Promise<boolean>} Promise that resolves with true if rating added successfully
   */
  async rateGame(gameId, personalRating) {
    try {
      const response = await apiClient.post(`/saved-games/${gameId}/rating`, {
        personalRating: Math.max(1, Math.min(5, personalRating))
      })

      if (response.status === 200) {
        console.log('Rating added successfully to game:', gameId)
        return true
      }
      return false
    } catch (error) {
      console.error('Error rating game:', error)
      return false
    }
  }
}

export default databaseService
