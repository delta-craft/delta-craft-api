import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Images } from "src/db/entities/Images";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { ImgurService } from "src/utils/imgur.service";
import { EmbedController } from "./embed.controller";
import { EmbedService } from "./embed.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserConnections, Teams, Images])],
  controllers: [EmbedController],
  providers: [EmbedService, ImgurService],
})
export class EmbedModule {}
