import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Once,
  DiscordClientProvider,
  OnCommand,
  ClientProvider,
} from "discord-nestjs";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { DiscordsrvAccounts } from "src/db/entities/DiscordsrvAccounts";
import { UserConnections } from "src/db/entities/UserConnections";
import { calcPlayerSummary } from "src/utils/summary";
import { Repository } from "typeorm";

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    private readonly discordProvider: DiscordClientProvider,
    @InjectRepository(UserConnections)
    private readonly uConnRepository: Repository<UserConnections>,
    @InjectRepository(DiscordsrvAccounts)
    private readonly discordSrvRepository: Repository<DiscordsrvAccounts>,
  ) {}

  @Once({ event: "ready" })
  onReady(): void {
    this.logger.log(
      `Logged in as ${this.discordProvider.getClient().user.tag}!`,
    );
    // this.discordProvider..send("hello bot is up!");
  }

  @OnCommand({ name: "points" })
  async onCommand(message: Message): Promise<void> {
    const author = message.author;

    if (author.bot) return;

    const channel = message.channel;

    const user = await this.discordSrvRepository.findOne({
      where: { discord: author.id },
    });

    if (!user) {
      await channel.send("Account not linked");
      return;
    }

    const uc = await this.uConnRepository.findOne({
      where: { uid: user.uuid },
      relations: ["points", "points.pointTags", "team"],
    });

    if (!uc) {
      await channel.send("Not found");
      return;
    }

    const { summary, ratios } = calcPlayerSummary(uc);

    const exampleEmbed = new MessageEmbed()
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
      .setImage(`https://api.deltacraft.eu/embed/player/${uc.name}`)
      .setTimestamp()
      .setURL(`https://portal.deltacraft.eu/players/${uc.name}`);

    const msg = await message.channel.send(exampleEmbed);
  }

  async sendMsg() {
    const client = this.discordProvider.getClient();
    const channel = client.channels.cache.find(
      (x) => x.id === "871182344038547526",
    );
    if (!channel) {
      this.logger.error("Channel not found");
      return;
    }

    await (channel as TextChannel).send("test");
  }
}
