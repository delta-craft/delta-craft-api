import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Teams } from "src/db/entities/Teams";
import { UserConnections } from "src/db/entities/UserConnections";
import { EmbedController } from "./embed.controller";
import { EmbedService } from "./embed.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserConnections, Teams])],
  controllers: [EmbedController],
  providers: [EmbedService],
})
export class EmbedModule {}
