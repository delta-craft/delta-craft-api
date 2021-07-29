import { Get, Header, Param, Query, StreamableFile } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EmbedService } from "./embed.service";

@ApiTags("embed")
@Controller("embed")
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}

  @Get("player-head/:uuid")
  @Header("content-type", "image/png")
  async getPlayerHead(
    @Param("uuid") uuid: string,
  ): Promise<StreamableFile | null> {
    return await this.embedService.generatePlayerHead(uuid);
  }

  @Get("player-head")
  @Header("content-type", "image/png")
  async getPlayerHeadQuery(
    @Query("uuid") uuid: string,
  ): Promise<StreamableFile | null> {
    return await this.embedService.generatePlayerHead(uuid);
  }

  @Get("player-home/:nick")
  @Header("content-type", "image/png")
  async getPlayerHome(
    @Param("nick") nick: string,
  ): Promise<StreamableFile | null> {
    return await this.embedService.generatePlayerHome(nick);
  }

  @Get("player-home")
  @Header("content-type", "image/png")
  async getPlayerHomeQuery(
    @Query("nick") nick: string,
  ): Promise<StreamableFile | null> {
    return await this.embedService.generatePlayerHome(nick);
  }
}
