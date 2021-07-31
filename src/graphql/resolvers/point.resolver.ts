import { Resolver, Query, Args, Parent, ResolveField } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { Points } from "src/db/entities/Points";
import { PointTags } from "src/db/entities/PointTags";
import { Repository } from "typeorm";

@Resolver("Point")
export class PointResolver {
  constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
    @InjectRepository(PointTags)
    private readonly pointTagsRepository: Repository<PointTags>,
  ) {}

  @Query("point")
  async point(@Args("id") id: string): Promise<Points> {
    return await this.pointsRepository.findOne({ where: { id } });
  }

  @ResolveField()
  async pointTags(@Parent() p: Points): Promise<PointTags[]> {
    return await this.pointTagsRepository.find({ where: { pointId: p.id } });
  }
}
