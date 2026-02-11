import * as migration_20250924_175404 from './20250924_175404'
import * as migration_20250925_061817 from './20250925_061817'
import * as migration_20250928_094902 from './20250928_094902'
import * as migration_20250928_134756 from './20250928_134756'
import * as migration_20251003_160711 from './20251003_160711'
import * as migration_20251012_073953 from './20251012_073953'
import * as migration_20251113_123524 from './20251113_123524'
import * as migration_20251220_130502 from './20251220_130502'
import * as migration_20260130_195930 from './20260130_195930'
import * as migration_20260211_140551 from './20260211_140551'
import * as migration_20260211_152131 from './20260211_152131'
import * as migration_20260211_184506 from './20260211_184506'

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
  {
    up: migration_20260130_195930.up,
    down: migration_20260130_195930.down,
    name: '20260130_195930',
  },
  {
    up: migration_20260211_140551.up,
    down: migration_20260211_140551.down,
    name: '20260211_140551',
  },
  {
    up: migration_20260211_152131.up,
    down: migration_20260211_152131.down,
    name: '20260211_152131',
  },
  {
    up: migration_20260211_184506.up,
    down: migration_20260211_184506.down,
    name: '20260211_184506',
  },
]
