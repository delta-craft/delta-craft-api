import { Inject, Injectable, Logger } from "@nestjs/common";
import { ApiRequestTimeoutResponse } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscordClientProvider, OnCommand } from "discord-nestjs";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { DiscordsrvAccounts } from "src/db/entities/DiscordsrvAccounts";
import { UserConnections } from "src/db/entities/UserConnections";
import { calcPlayerSummary } from "src/utils/summary";
import { Repository } from "typeorm";
import { UserResolverService } from "../resolver.service";

@Injectable()
export class PointsCommand {
  private readonly logger = new Logger(PointsCommand.name);

  constructor(
    @Inject(UserResolverService)
    private readonly userResolver: UserResolverService,
    private readonly discordProvider: DiscordClientProvider,
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(DiscordsrvAccounts)
    private readonly discordSrvRepository: Repository<DiscordsrvAccounts>,
  ) {}

  @OnCommand({ name: "points" })
  async onCommand(message: Message): Promise<void> {
    const author = message.author;

    if (author.bot) return;

    const channel = message.channel as TextChannel;

    if (message.mentions.users.size > 0 && message.mentions.users.size < 3) {
      for (const user of message.mentions.users) {
        const uid = user[0];
        await this.sendPointsCard(uid, channel);
      }
      //const uId = message.mentions.users.first().id;
      //await this.sendPointsCard(uId, channel);
      return;
    }

    if (message.mentions.users.size >= 3) {
      await channel.send("To je moc");
      return;
    }

    await this.sendPointsCard(author.id, channel);
  }

  private async sendPointsCard(
    discordId: string,
    channel: TextChannel,
  ): Promise<void> {
    const user = await this.userResolver.getUserConnection(discordId);
    if (!user) {
      await channel.send("User invalid");
      return;
    }

    const uc = await this.uConnRepository.findOne({
      where: { id: user.id },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!uc) {
      await channel.send("Not found");
      return;
    }

    const { summary } = calcPlayerSummary(uc);

    const pointsEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Bodíková kartička")
      .setAuthor(
        uc.name,
        `https://minotar.net/helm/${uc.name}/100.png`,
        `https://portal.deltacraft.eu/players/${uc.name}`,
      )
      .addFields(
        { name: "Mining", value: summary.mining, inline: true },
        { name: "Crafting", value: summary.crafting, inline: true },
        { name: "Warfare", value: summary.warfare, inline: true },
        { name: "Journey", value: summary.journey, inline: true },
      )
      .setImage(`https://cdn.deltacraft.eu/embed/player/${uc.name}`)
      .setTimestamp()
      .setURL(`https://portal.deltacraft.eu/players/${uc.name}`);

    const msg = await channel.send(pointsEmbed);
  }
}
