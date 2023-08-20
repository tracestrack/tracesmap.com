/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOMINATIM_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
