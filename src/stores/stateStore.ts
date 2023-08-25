import { EagerStore } from '@/stores/ObjectStore'
import type { UserState } from '@/interface/UserState'

export default new EagerStore<UserState>('stateTable')
