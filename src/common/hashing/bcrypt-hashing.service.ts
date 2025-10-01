import { HashingService } from './hashing.service'
import * as bcryptjs from 'bcryptjs'

export class BcryptHashingService extends HashingService {
  async hash(password: string) {
    return await bcryptjs.hash(password, 6)
  }

  async compare(password: string, hash: string) {
    return bcryptjs.compare(password, hash)
  }
}
