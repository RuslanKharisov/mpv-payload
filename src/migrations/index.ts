import * as migration_20250924_175404 from './20250924_175404'
import * as migration_20250925_061817 from './20250925_061817'
import * as migration_20250928_094902 from './20250928_094902'
import * as migration_20250928_134756 from './20250928_134756'
import * as migration_20251003_160711 from './20251003_160711'
import * as migration_20251012_073953 from './20251012_073953'
import * as migration_20251113_123524 from './20251113_123524'
import * as migration_20251220_130502 from './20251220_130502'

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
  {
    up: migration_20251012_073953.up,
    down: migration_20251012_073953.down,
    name: '20251012_073953',
  },
  {
    up: migration_20251113_123524.up,
    down: migration_20251113_123524.down,
    name: '20251113_123524',
  },
  {
    up: migration_20251220_130502.up,
    down: migration_20251220_130502.down,
    name: '20251220_130502',
  },
]
