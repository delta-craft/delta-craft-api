import { Inject, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { PollOptions } from "src/db/entities/PollOptions";
import { Polls } from "src/db/entities/Polls";
import { PollVotes } from "src/db/entities/PollVotes";
import { UserConnections } from "src/db/entities/UserConnections";
import { GQLGuard } from "src/guards/gql.guard";
import { Repository } from "typeorm";
import { User } from "../decorators/user.decorator";

@UseGuards(GQLGuard)
@Resolver("Poll")
export class PollsResolver {
  constructor(
    @InjectRepository(PollVotes)
    private readonly pollVotesRepository: Repository<PollVotes>,
    @InjectRepository(Polls)
    private readonly pollsRepository: Repository<Polls>,
    @InjectRepository(PollOptions)
    private readonly pollOptionsRepository: Repository<PollOptions>,
  ) {}

  @Query("poll")
  async poll(
    @User() user: UserConnections,
    @Args("id") id: string,
  ): Promise<Polls> {
    return await this.pollsRepository.findOne({ where: { id } });
  }

  @ResolveField()
  async pollOptions(
    @User() user: UserConnections,
    @Parent() poll: Polls,
  ): Promise<any[]> {
    const options = await this.pollOptionsRepository.find({
      where: { pollId: poll.id },
    });

    let votes = await this.pollVotesRepository.find({
      where: { connectionId: user.id },
    });

    const opts = options.map((x) => x.id);

    votes = votes.filter((x) => opts.includes(x.pollOptionId));

    const op = options as any[];

    for (const v of votes) {
      const o = op.find((x) => x.id === v.pollOptionId);
      if (!o) continue;

      o.voted = v.voted;
    }

    return op;
  }

  @Mutation("updateVote")
  async updateFcmToken(
    @User() user: UserConnections,
    @Args("optionId") optionId: string,
  ): Promise<boolean> {
    const votes = await this.pollVotesRepository.find({
      where: { connectionId: user.id },
    });

    const v = votes.find((x) => x.pollOptionId.toString() === optionId);

    if (!v) {
      try {
        const vote = new PollVotes();
        vote.connectionId = user.id;
        vote.pollOptionId = +optionId;
        vote.voted = true;
        vote.votedOn = new Date();

        await this.pollVotesRepository.save(vote);
        return true;
      } catch (ex) {
        console.log(ex);
        return false;
      }
    }
    v.voted = !v.voted;
    v.votedOn = new Date();

    try {
      await this.pollVotesRepository.save(v);
    } catch (ex) {
      console.log(ex);
      return false;
    }
    return true;
  }
}
