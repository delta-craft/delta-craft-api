import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { BoolApiResponse, IApiPluginResponse } from "src/types/ApiResponse";
import { mockUuid } from "src/utils/mockdata";
import { TeamService } from "./team.service";

@UseGuards(AuthGuard)
@ApiTags("team")
@Controller("team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get("is-owner")
  @ApiQuery({ name: "uuid", example: mockUuid })
  @HttpCode(200)
  @HttpCode(400)
  @ApiResponse({ type: BoolApiResponse })
  async isOwner(
    @Query("uuid") uuid: string,
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.teamService.isTeamOwner(uuid);
  }
}
