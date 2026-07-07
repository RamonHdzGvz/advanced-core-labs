/*
 * The porpuse of this environment is to setup a production's clone.
 * Test stable versions that are ready for production.
 */

export const environment = {
  production: true,
  baseUrl: "STAGING_HOST_URL",
  cloudinaryUrl: "https://api.cloudinary.com/v1_1/",
  analyticsKey: "ANALYTICS_STAGING_KEY",
  supabaseUrl: "SUPABASE_URL",
  supabaseKey: "SUPABASE_KEY",
  appMode: "STAGING",
  appVersion: "0.0.0.1", //MAJOR_UPDATE.NEW_FEATURES.MINOR_UPDATE.BUILD_NUMBER
};
