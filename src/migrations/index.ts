import * as migration_20250924_175404 from './20250924_175404'
import * as migration_20250925_061817 from './20250925_061817'
import * as migration_20250928_094902 from './20250928_094902'
import * as migration_20250928_134756 from './20250928_134756'
import * as migration_20251003_160711 from './20251003_160711'

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
  {
    up: migration_20250928_094902.up,
    down: migration_20250928_094902.down,
    name: '20250928_094902',
  },
  {
    up: migration_20250928_134756.up,
    down: migration_20250928_134756.down,
    name: '20250928_134756',
  },
  {
    up: migration_20251003_160711.up,
    down: migration_20251003_160711.down,
    name: '20251003_160711',
  },
]
