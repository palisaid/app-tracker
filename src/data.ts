import raw from './config.json'

export type Environment = 'dev' | 'demo'
export type AppKey = 'ppm' | 'scout'

export interface AppConfig {
  key: AppKey
  env: Environment
  name: string
  appId: string
  doUrl: string
  customUrl: string
  internalUrl: string
  ips: string[]
  branch: string
  retired?: string[]
}

export const configs = raw as AppConfig[]
