import { defineConfig } from "cypress";
import { plugins } from 'cypress-social-logins'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      // include any other plugin code...
      // implement node event listeners here
      on("task", {
        GoogleSocialLogin: plugins.GoogleSocialLogin,
      })
      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config

    },
    chromeWebSecurity: false,
  },
});
