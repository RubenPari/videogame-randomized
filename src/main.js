/**
 * Main Vue.js application file
 * This file is the entry point of the application and handles:
 * - Importing Vue.js and the root App component
 * - Importing global application styles
 * - Creating and mounting the Vue instance to the DOM
 */

// Import the createApp function from Vue 3 to create the application instance
import { createApp } from 'vue'

// Import the root application component that contains all the main logic
import App from './App.vue'

// Import the main CSS file that contains global styles and Tailwind configurations
import './assets/main.css'

/**
 * Create the Vue application instance using the App component as root
 * and mount it to the element with id "app" defined in index.html
 * This starts the application and makes the DOM interactive
 */
createApp(App).mount('#app')
