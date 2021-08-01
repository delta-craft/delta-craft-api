import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscordClientProvider, OnCommand } from "discord-nestjs";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { DiscordsrvAccounts } from "src/db/entities/DiscordsrvAccounts";
import { UserConnections } from "src/db/entities/UserConnections";
import { calcPlayerSummary } from "src/utils/summary";
import { Repository } from "typeorm";
import { UserResolverService } from "../resolver.service";

@Injectable()
export class CompareCommand {
  private readonly logger = new Logger(CompareCommand.name);

  constructor(
    private readonly discordProvider: DiscordClientProvider,
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(DiscordsrvAccounts)
    private readonly discordSrvRepository: Repository<DiscordsrvAccounts>,
    @Inject(UserResolverService)
    private readonly userResolver: UserResolverService,
  ) {}

  @OnCommand({ name: "compare" })
  async compare(message: Message) {
    const author = message.author;

    if (author.bot) return;
    const channel = message.channel as TextChannel;

    const mentions = message.mentions.users;

    if (mentions.size < 1 || mentions.size > 2) {
      await channel.send("Usage: !compare <user> || !compare <user1> <user2>");
      return;
    }

    if (mentions.size === 1) {
      await this.generateComparison(author.id, mentions.first().id, channel);
      return;
    }

    if (mentions.first().id === mentions.last().id) {
      await channel.send("No");
      return;
    }

    await this.generateComparison(
      mentions.first().id,
      mentions.last().id,
      channel,
    );
  }

  async generateComparison(
    discordId1: string,
    discordId2: string,
    channel: TextChannel,
  ): Promise<void> {
    const user1 = await this.userResolver.getUserConnection(discordId1);
    const user2 = await this.userResolver.getUserConnection(discordId2);

    if (!user1 || !user2) {
      channel.send("Error");
      return;
    }

    const uc1 = await this.uConnRepository.findOne({
      where: { id: user1.id },
      relations: ["points", "points.pointTags", "team"],
    });
    const uc2 = await this.uConnRepository.findOne({
      where: { id: user2.id },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!uc1 || !uc2) {
      channel.send("Error");
      return;
    }

    const comparisonEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Comparison")
      .addFields(
        { name: uc1.name, value: uc1.team?.name, inline: true },
        { name: uc2.name, value: uc2.team?.name, inline: true },
      )
      .setImage(
        `https://cdn.deltacraft.eu/embed/player/compare/${uc1.name}/${uc2.name}`,
      )
      .setTimestamp();

    await channel.send(comparisonEmbed);
  }
}
