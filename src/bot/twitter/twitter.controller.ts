import { Controller, Get, Header, StreamableFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ITwitterStats } from "src/types/twitter/types";
import { TwitterService } from "./twitter.service";

@ApiTags("twitter")
@Controller("twitter")
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get("stats")
  async getStats(): Promise<ITwitterStats> {
    return await this.twitterService.getStats();
  }

  @Get("img")
  @Header("content-type", "image/png")
  async getStatsImg(): Promise<StreamableFile> {
    const file = await this.twitterService.getTwitterCard();
    return new StreamableFile(file);
  }

  // @Get("tweet")
  // async makeTweet() {
  //   await this.twitterService.tweetYesterdaysLeaderboard();
  //   return { status: "OK" };
  // }
}
