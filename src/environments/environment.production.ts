/*
 * This is the production environment configuration.
 * Only stable versions are allowed to be deployed here.
 */

export const environment = {
  production: true,
  baseUrl: "PRODUCTION_HOST_URL",
  cloudinaryUrl: "https://api.cloudinary.com/v1_1/",
  analyticsKey: "ANALYTICS_PRODUCTION_KEY",
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_KEY",
  appMode: "PRODUCTION",
  appVersion: "0.0.0.1", //MAJOR_UPDATE.NEW_FEATURES.MINOR_UPDATE.BUILD_NUMBER
};
