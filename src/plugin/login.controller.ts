import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { BoolApiResponse, IApiPluginResponse } from "src/types/ApiResponse";
import { LoginData } from "src/types/ILogin";
import { mockNick, mockUuid } from "src/utils/mockdata";
import { LoginService } from "./login.service";

@UseGuards(AuthGuard)
@ApiTags("login")
@Controller("login")
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({ type: BoolApiResponse })
  async login(@Body() data: LoginData): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.newLogin(data);
  }

  @Get("validate")
  @ApiQuery({ name: "nick", example: mockNick })
  @ApiQuery({ name: "uuid", example: mockUuid })
  @ApiResponse({ type: BoolApiResponse })
  async validate(
    @Query("nick") nick: string,
    @Query("uuid") uuid: string,
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.validatePlayerJoin(uuid, nick);
  }

  @Post("logout")
  @HttpCode(200)
  @ApiResponse({ type: BoolApiResponse })
  async logout(): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.logoutAll();
  }
}
