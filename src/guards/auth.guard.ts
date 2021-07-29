import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

interface IHead extends Headers {
  authorization: string;
}

interface IReq extends Request {
  headers: IHead;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IReq>();

    if (request.headers.authorization !== process.env.PLUGIN_SECRET) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }
}
