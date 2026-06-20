/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_DOMAIN: string;
  readonly VITE_API_WITHOUT_API: string;
  readonly VITE_ACCESS_KEY_ID: string;
  readonly VITE_ACCESS_KEY_SECRET: string;
  readonly VITE_ACCOUNT_ID: string;
  readonly VITE_PUBLIC_ACCESS_DOMAIN: string;
  readonly VITE_S3_BUCKET_NAME: string;
  readonly VITE_JWTSECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
