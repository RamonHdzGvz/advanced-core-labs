/*
 * This is the development environment configuration.
 * Deploy new features but try not to brake this environment.
 */

export const environment = {
  production: false,
  baseUrl: "DEVELOPMENT_HOST_URL",
  cloudinaryUrl: "https://api.cloudinary.com/v1_1/",
  analyticsKey: "ANALYTICS_DEVELOPMENT_KEY",
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_KEY",
  appMode: "DEVELOPMENT",
  appVersion: "0.0.0.1", //MAJOR_UPDATE.NEW_FEATURES.MINOR_UPDATE.BUILD_NUMBER
};
