import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Points } from "src/db/entities/Points";
import { AuthGuard } from "src/guards/auth.guard";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { PointPartial } from "src/types/points/IPointsInput";
import { PointsService } from "./points.service";

@UseGuards(AuthGuard)
@ApiTags("points")
@Controller("points")
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @ApiBody({ type: [PointPartial] })
  @Post("add")
  @HttpCode(200)
  @HttpCode(400)
  async addPoints(
    @Body() data: PointPartial[],
  ): Promise<IApiPluginResponse<boolean>> {
    return await this.pointsService.addPoints(data);
  }
}
