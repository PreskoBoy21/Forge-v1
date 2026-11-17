import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * app.json is the source of truth. The only addition: the web build can be
 * served from a sub-path (GitHub Pages: /Forge-v1/app) via EXPO_PUBLIC_BASE_URL.
 * Native builds ignore baseUrl.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
  return {
    ...(config as ExpoConfig),
    experiments: {
      ...config.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  };
};
