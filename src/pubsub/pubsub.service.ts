import { Inject, Injectable } from "@nestjs/common";
import { PubSub } from "apollo-server-express";

@Injectable()
export class PubSubService {
  readonly pubSub: PubSub;
  constructor(@Inject("PUB_SUB") pubSub: PubSub) {
    this.pubSub = pubSub;
  }
}
