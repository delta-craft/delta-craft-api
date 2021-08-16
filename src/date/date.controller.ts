import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { DateService } from "./date.service";

@ApiTags("date")
@Controller("date")
export class DateController {
  constructor(private readonly dateService: DateService) {}

  @Get("getSystemTime")
  @ApiResponse({ type: String })
  getSystemDateTime(): Date {
    return this.dateService.getSystemDateTime();
  }

  @Get("getSystemAsUtc")
  @ApiResponse({ type: String })
  getSystemAsUtc(): string {
    return this.dateService.getSystemAsUtc();
  }

  @Get("getSystemTimestamp")
  @ApiResponse({ type: Number })
  getSystemTimestamp(): number {
    return this.dateService.getSystemTimestamp();
  }

  @UseGuards(AuthGuard)
  @Get("getDbTime")
  @ApiResponse({ type: String })
  async getDbDateTime(): Promise<String | null> {
    return await this.dateService.getDbDateTime();
  }
}
