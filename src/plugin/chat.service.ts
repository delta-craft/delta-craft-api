import { Inject, Injectable } from "@nestjs/common";
import { BotNotificationService } from "src/bot/notification.service";
import { IApiPluginResponse } from "src/types/ApiResponse";
import { BoolApiException } from "src/types/exceptions/api.exception";
import resolveMessage, { Positivity } from "src/utils/wit-client";

@Injectable()
export class ChatService {
  constructor(
    @Inject(BotNotificationService)
    private readonly botNotifications: BotNotificationService,
  ) {}

  async checkMessage(message: string): Promise<IApiPluginResponse<boolean>> {
    const trimmed = message?.trim();
    if (!trimmed || trimmed?.length < 1) {
      return { content: true, message: "Prázdno" };
    }

    const witResult = await resolveMessage(encodeURIComponent(trimmed));
    if (!witResult) {
      return { content: true, message: "Ahoj, Jirko, wit nic" };
    }

    const { traits, entities } = witResult;

    let positivity: Positivity = "neutral";

    if (traits.positivity?.length > 0) {
      positivity = traits.positivity[0].value;
    }

    if (
      entities["blacklist:blacklist"] &&
      entities["blacklist:blacklist"].length > 0 &&
      positivity === "negative"
    ) {
      const words = entities["blacklist:blacklist"]
        .map((x) => `${x.body} (${x.value})`)
        .join(", ");

      await this.botNotifications.inappropriateMessage(trimmed);

      throw new BoolApiException({ message: words });
    }

    return {
      content: true,
      message:
        "Check prošel do konce, všechno bylo tak nějak přijatelné. OKA OKA",
    };
  }
}
