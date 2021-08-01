import { Injectable, Logger } from "@nestjs/common";
import { DiscordClientProvider, Once } from "discord-nestjs";
import { MessageEmbed, TextChannel } from "discord.js";

const channelId = "871408932403417139";

@Injectable()
export class BotNotificationService {
  private readonly logger = new Logger(BotNotificationService.name);

  constructor(private readonly discordProvider: DiscordClientProvider) {}

  @Once({ event: "ready" })
  onReady(): void {
    this.logger.log(
      `Logged in as ${this.discordProvider.getClient().user.tag}!`,
    );

    const channel = this.getLogChannel();
    if (!channel) return;
    //channel.send("Ready");
  }

  private getLogChannel(): TextChannel {
    const channel = this.discordProvider
      .getClient()
      .channels.cache.find((x) => x.id === channelId);
    if (!channel) return null;

    return channel as TextChannel;
  }

  async logPoints() {
    const channel = this.getLogChannel();
    if (!channel) return;

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Points uploaded successfully")
      .setTimestamp();

    await (channel as TextChannel).send(embed);
  }

  async inappropriateMessage(message: string) {
    const channel = this.getLogChannel();
    if (!channel) return;

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Inappropriate message")
      .addFields({ name: "Message", value: message })
      .setFooter("See console for details")
      .setTimestamp();

    await (channel as TextChannel).send(embed);
  }
}
