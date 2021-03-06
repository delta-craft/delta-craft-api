import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { LoginData } from "src/types/ILogin";
import ISessionResponse from "src/types/Sessions";
import { SessionService } from "./session.service";

@UseGuards(AuthGuard)
@ApiTags("session")
@Controller("session")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get("validate")
  async validateSession(
    @Query("uuid") uuid: string,
    @Query("ip") ip: string,
  ): Promise<IApiPluginResponse<ISessionResponse>> {
    return await this.sessionService.validateSession(uuid, ip);
  }

  @Post("update")
  @HttpCode(200)
  async updateSession(
    @Body() params: LoginData,
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.sessionService.updateSession(params);
  }
}
