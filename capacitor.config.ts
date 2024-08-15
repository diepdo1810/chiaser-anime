import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'project.anime.app',
  appName: 'aniproject',
  cordova: {},
  loggingBehavior: "debug",
  webDir: "out",
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  },
  server: {
    androidScheme: 'https',
    hostname: 'localhost:3000',
  },
  android: {
     loggingBehavior: "debug",
     webContentsDebuggingEnabled: true,
  }
};

export default config;
