import { Module } from "@nestjs/common";
import { PubSub } from "apollo-server-express";
import { PubSubService } from "./pubsub.service";

@Module({
  providers: [
    {
      provide: "PUB_SUB",
      useValue: new PubSub(),
    },
    PubSubService,
  ],
  exports: [PubSubService],
})
export class PubSubModule {}
