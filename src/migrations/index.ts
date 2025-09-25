import * as migration_20250924_175404 from './20250924_175404'
import * as migration_20250925_061817 from './20250925_061817'

export const migrations = [
  {
    up: migration_20250924_175404.up,
    down: migration_20250924_175404.down,
    name: '20250924_175404',
  },
  {
    up: migration_20250925_061817.up,
    down: migration_20250925_061817.down,
    name: '20250925_061817',
  },
]
