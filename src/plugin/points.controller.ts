import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { Points } from "src/db/entities/Points";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { PointPartial } from "src/types/points/IPointsInput";
import { PointsService } from "./points.service";

@UseGuards(AuthGuard)
@Controller("points")
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get("all")
  async getPoints(): Promise<IApiPluginResponse<Points[]>> {
    const res = { content: await this.pointsService.getPoints() };
    return res;
  }

  @ApiBody({ type: [PointPartial] })
  @Post("add")
  async addPoints(
    @Body() data: PointPartial[],
  ): Promise<IApiPluginResponse<boolean>> {
    const res = await this.pointsService.addPoints(data);

    return { ...res };
  }
}
