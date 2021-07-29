import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { ChatService } from "./chat.service";

@UseGuards(AuthGuard)
@ApiTags("team")
@Controller("team")
export class TeamController {
  constructor(private readonly chatService: ChatService) {}

  @Get("is-owner")
  @HttpCode(200)
  @HttpCode(400)
  async isOwner(
    @Query("uuid") uuid: string,
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.chatService.checkMessage(uuid);
  }
}
