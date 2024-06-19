import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import apiKey from '../models/api-key.model'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const header = req.header('x-api-key')

    const seller = await apiKey.findSellerByKey(header)
    if (!seller) {
      throw new UnauthorizedException()
    }
    req['user'] = seller
    return true
  }
}
