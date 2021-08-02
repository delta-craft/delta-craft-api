import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { BoolApiResponse, IApiPluginResponse } from "src/types/ApiResponse";
import { ChatService } from "./chat.service";
import { Response } from "express";
import { createBoolResponse } from "src/utils/response";

// @UseGuards(AuthGuard)
@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get("check")
  @ApiQuery({ name: "message", example: "Ahoj, jak to jde?" })
  @ApiResponse({ type: BoolApiResponse })
  async check(
    @Query("message") message: string,
    @Res() res: Response<IApiPluginResponse<boolean>>,
  ) {
    const serviceRes = await this.chatService.checkMessage(message);

    createBoolResponse(res, serviceRes)
  }
}

