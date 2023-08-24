import { Persistence } from './Persistence'

export class UserIPs extends Persistence {
  constructor(public readonly id: string, public readonly IPs: { [ip: string]: number } = {}) {
    super()
  }

  addIp(ip: string) {
    if (!Object.prototype.hasOwnProperty.call(this.IPs, ip)) {
      this.IPs[ip] = 0
    }
    this.IPs[ip] += 1
    this.save()
  }
}
