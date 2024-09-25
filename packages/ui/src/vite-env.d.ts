/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE: string
  readonly VITE_BUCKET_NAME: string
  readonly VITE_BUCKET_ENDPOINT: string
  readonly VITE_WORKER_ENDPOINT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}