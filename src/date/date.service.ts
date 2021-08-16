import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

@Injectable()
export class DateService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  getSystemDateTime(): Date {
    return new Date();
  }

  getSystemAsUtc(): string {
    return new Date().toUTCString();
  }

  getSystemTimestamp(): number {
    return new Date().getTime();
  }

  async getDbDateTime(): Promise<String | null> {
    const rawData = await this.entityManager.query("SELECT NOW() AS now;");
    if (!rawData) {
      return null;
    }

    return rawData[0]?.now;
  }
}
