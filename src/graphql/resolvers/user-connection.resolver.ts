import { Resolver, Query } from "@nestjs/graphql";
import { UserConnections } from "src/db/entities/UserConnections";

@Resolver()
export class UserConnectionResolver {
  constructor() {}

  @Query((returns) => UserConnections)
  async getUserConnection() {
      
  }
}
