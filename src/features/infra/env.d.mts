export type EnvironmentName = 'development' | 'build' | 'preview' | 'production'

export interface EnvironmentConfig {
  name: EnvironmentName
  isDev: boolean
  isBuild: boolean
  isPreview: boolean
  isProd: boolean
}

export interface BuildConfig {
  id?: string
  hash?: string
}

export interface StoryblokConfig {
  token?: string
  previewToken?: string
}

export interface SentryConfig {
  dsn?: string
}

export interface Env {
  environment: EnvironmentConfig
  baseUrl?: string
  build: BuildConfig
  storyblok: StoryblokConfig
  sentry: SentryConfig
}

export interface ServerEnv extends Env {
  host?: string
  port?: number
}

export const environment: { [key: EnvironmentName]: EnvironmentName }
export function getAppEnv(): Env
export function getServerEnv(): ServerEnv
