import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'il.co.mdadan.app',
  appName: 'Mdadan',
  webDir: 'out',
  server: {
    // url: 'https://mdadan.azurewebsites.net',
    url: 'http://10.0.0.20:3000',
    cleartext: true
  }
};

export default config;
