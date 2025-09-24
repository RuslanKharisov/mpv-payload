import * as migration_20250924_175404 from './20250924_175404'

export const migrations = [
  {
    up: migration_20250924_175404.up,
    down: migration_20250924_175404.down,
    name: '20250924_175404',
  },
]
