import { Injectable, Logger } from "@nestjs/common";
import { Once, DiscordClientProvider } from "discord-nestjs";

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(private readonly discordProvider: DiscordClientProvider) {}

  @Once({ event: "ready" })
  onReady(): void {
    this.logger.log(
      `Logged in as ${this.discordProvider.getClient().user.tag}!`,
    );
    this.discordProvider.getWebhookClient().send("hello bot is up!");
  }
}
