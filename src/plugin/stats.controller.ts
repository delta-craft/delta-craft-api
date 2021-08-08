import { Controller, Get, HttpCode, Query, UseGuards } from "@nestjs/common";
import { ApiProperty, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { IStatsResponse, StatsResponse } from "src/types/Stats";
import { mockNick } from "src/utils/mockdata";
import { StatsService } from "./stats.service";

class StatsApiResponse {
  @ApiProperty()
  content?: StatsResponse;
  @ApiProperty()
  error?: string;
  @ApiProperty()
  message?: string;
}

// @UseGuards(AuthGuard)
@ApiTags("stats")
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiQuery({ name: "name", example: mockNick })
  @HttpCode(200)
  @HttpCode(400)
  @ApiResponse({ type: StatsApiResponse })
  async get(
    @Query("name") name: string,
  ): Promise<IApiPluginResponse<IStatsResponse>> {
    return await this.statsService.get(name);
  }
}
