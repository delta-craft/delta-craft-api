import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DiscordClientProvider, OnCommand } from "discord-nestjs";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Teams } from "src/db/entities/Teams";
import { Repository } from "typeorm";
import { UserResolverService } from "../resolver.service";

@Injectable()
export class TeamCommand {
  private readonly logger = new Logger(TeamCommand.name);

  constructor(
    @Inject(UserResolverService)
    private readonly userResolver: UserResolverService,
    private readonly discordProvider: DiscordClientProvider,
    @InjectRepository(Teams)
    private readonly teamsRepository: Repository<Teams>,
  ) {}

  @OnCommand({ name: "team" })
  async getTeam(message: Message) {
    const author = message.author;

    if (author.bot) return;

    const channel = message.channel as TextChannel;

    const mentions = message.mentions.users;

    if (mentions.size > 0 && message.mentions.users.size < 2) {
      const uId = mentions.first().id;
      const user = await this.userResolver.getUserConnection(uId);
      if (!user) return;

      await this.generateTeam(user.teamId, channel);
      return;
    }
    if (mentions.size > 1) {
      await channel.send("To je moc");
      return;
    }

    const user = await this.userResolver.getUserConnection(author.id);
    if (!user) return;

    await this.generateTeam(user.teamId, channel);
  }

  private async generateTeam(teamId: number, channel: TextChannel) {
    const team = await this.teamsRepository.findOne({
      where: { id: teamId },
      relations: ["userConnections"],
    });
    if (!team) {
      await channel.send("Team not found");
      return;
    }

    const color =
      team.majorTeam === "blue"
        ? "#0067c4"
        : team.majorTeam === "red"
        ? "#bd1b1b"
        : "#3e3e3e";

    const teamEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`${team.name} (${team.majorTeam})`)
      .setDescription(team.userConnections.map((x) => x.name).join(", "))
      .setImage(`https://cdn.deltacraft.eu/embed/team/${team.id}`)
      .setTimestamp()
      .setURL(`https://portal.deltacraft.eu/teams/${team.id}`);

    await channel.send(teamEmbed);
  }
}
