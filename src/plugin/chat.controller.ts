import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { ChatService } from "./chat.service";

@UseGuards(AuthGuard)
@ApiTags("chat")
@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("check")
  @ApiQuery({ name: "message", example: "Ahoj, jak to jde?" })
  @HttpCode(200)
  @HttpCode(400)
  async check(
    @Query("message") message: string,
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.chatService.checkMessage(message);
  }
}
