import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Points } from "src/db/entities/Points";
import { PointTags } from "src/db/entities/PointTags";
import { UserConnections } from "src/db/entities/UserConnections";
import { PointsController } from "./points.controller";
import { PointsService } from "./points.service";

@Module({
  imports: [TypeOrmModule.forFeature([Points, UserConnections, PointTags])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
