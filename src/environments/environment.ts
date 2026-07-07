/*
 * This is the environment configuration for local development.
 * Feel free to crash your versions here.
 */

export const environment = {
  production: false,
  baseUrl: "http://localhost:4200",
  cloudinaryUrl: "https://api.cloudinary.com/v1_1/",
  analyticsKey: "ANALYTICS_LOCAL_KEY",
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_KEY",
  appMode: "LOCAL_DEVELOPMENT",
  appVersion: "0.0.0.1", //MAJOR_UPDATE.NEW_FEATURES.MINOR_UPDATE.BUILD_NUMBER
};
