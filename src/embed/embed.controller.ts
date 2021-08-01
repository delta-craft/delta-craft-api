import { Get, Header, Param, Query, StreamableFile } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ApiParam, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { mockNick, mockUuid } from "src/utils/mockdata";
import { EmbedService } from "./embed.service";

type EmbedFile = StreamableFile | null;

@ApiTags("embed")
@Controller("embed")
export class EmbedController {
  constructor(private readonly embedService: EmbedService) {}

  @Get("player-head/:uuid")
  @ApiParam({ name: "uuid", example: mockUuid })
  @Header("content-type", "image/png")
  async getPlayerHead(@Param("uuid") uuid: string): Promise<EmbedFile> {
    return await this.embedService.generatePlayerHead(uuid);
  }

  @Get("player-head")
  @ApiQuery({ name: "uuid", example: mockUuid })
  @Header("content-type", "image/png")
  async getPlayerHeadQuery(@Query("uuid") uuid: string): Promise<EmbedFile> {
    return await this.embedService.generatePlayerHead(uuid);
  }

  @Get("player-home/:nick")
  @ApiParam({ name: "nick", example: mockNick })
  @Header("content-type", "image/png")
  async getPlayerHome(@Param("nick") nick: string): Promise<EmbedFile> {
    return await this.embedService.generatePlayerHome(nick);
  }

  @Get("player-home")
  @ApiQuery({ name: "nick", example: mockNick })
  @Header("content-type", "image/png")
  async getPlayerHomeQuery(@Query("nick") nick: string): Promise<EmbedFile> {
    return await this.embedService.generatePlayerHome(nick);
  }

  @Get("player/:nick")
  @ApiParam({ name: "nick", example: mockNick })
  @Header("content-type", "image/png")
  async getPlayerCard(@Param("nick") nick: string): Promise<EmbedFile> {
    return await this.embedService.generatePlayerCard(nick);
  }

  @Get("player/compare/:nick1/:nick2")
  @ApiParam({ name: "nick1", example: mockNick })
  @ApiParam({ name: "nick2", example: mockNick })
  @Header("content-type", "image/png")
  async getCompareCard(
    @Param("nick1") nick1: string,
    @Param("nick2") nick2: string,
  ): Promise<EmbedFile> {
    return await this.embedService.generateCompareCard(nick1, nick2);
  }

  @Get("team/:id")
  @Header("content-type", "image/png")
  @ApiParam({ name: "id", example: "1" })
  async getTeamCard(@Param("id") id: string): Promise<EmbedFile> {
    return await this.embedService.generateTeamCard(id);
  }

  @Get("dynmap/:world/:x/:y/:z")
  @Header("content-type", "image/png")
  @ApiParam({ name: "world", example: "world" })
  @ApiParam({ name: "x", example: "84" })
  @ApiParam({ name: "y", example: "69" })
  @ApiParam({ name: "z", example: "-2071" })
  async getDynmapImage(
    @Param("world") world: string,
    @Param("x") x: string,
    @Param("y") y: string,
    @Param("z") z: string,
  ): Promise<EmbedFile> {
    return await this.embedService.generateDynmapImage(world, x, y, z);
  }
}
