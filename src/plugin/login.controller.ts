import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { ApiException } from "src/types/exceptions/api.exception";
import { LoginData } from "src/types/ILogin";
import { mockNick, mockUuid } from "src/utils/mockdata";
import { LoginService } from "./login.service";

// @UseGuards(AuthGuard)
@ApiTags("login")
@Controller("login")
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @HttpCode(200)
  async login(@Body() data: LoginData): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.newLogin(data);
  }

  @Get("validate")
  @ApiQuery({ name: "nick", example: mockNick })
  @ApiQuery({ name: "uuid", example: mockUuid })
  async validate(
    @Query("nick") nick: string,
    @Query("uuid") uuid: string,
  ): Promise<IApiPluginResponse<boolean>> {
    throw new ApiException<IApiPluginResponse<boolean>>(
      { content: false, message: "Lolotest" },
      HttpStatus.BAD_REQUEST,
    );
    return await this.loginService.validatePlayerJoin(uuid, nick);
  }

  @Post("logout")
  @HttpCode(200)
  async logout(): Promise<IApiPluginResponse<boolean>> {
    return await this.loginService.logoutAll();
  }
}
