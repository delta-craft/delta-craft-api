import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { LoginData } from "src/types/ILogin";
import { LoginService } from "./login.service";

@UseGuards(AuthGuard)
@ApiTags("login")
@Controller("login")
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async login(@Body() data: LoginData): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.newLogin(data);
  }

  @Get("validate")
  async validate(
    @Query("nick") nick: string,
    @Query("uuid") uuid: string,
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.validatePlayerJoin(uuid, nick);
  }

  @Post("logout")
  @Post("logout-All")
  async logout(): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.logoutAll();
  }
}
