interface EnvConfig {
  dataForSEO: {
    login: string;
    password: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const env: EnvConfig = {
  dataForSEO: {
    login: import.meta.env.VITE_DATAFORSEO_LOGIN,
    password: import.meta.env.VITE_DATAFORSEO_PASSWORD,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
};

export function validateEnv() {
  const required = [
    'VITE_DATAFORSEO_LOGIN',
    'VITE_DATAFORSEO_PASSWORD',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}