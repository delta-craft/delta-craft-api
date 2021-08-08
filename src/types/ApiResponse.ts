import { ApiProperty } from "@nestjs/swagger";
import ISessionResponse from "./Sessions";

export enum PluginApiError {
  NotImplemented = "not_implemented",
  Unauthorized = "unauthorized",
  MethodNotValid = "invalid_method",
  Unknown = "unknown",
  UuidNotValid = "uuid_not_valid",
}

export enum ValidateError {
  ArgumentsError = "arguments_error",
  MissingConsent = "missing_consent",
  MissingName = "missing_name",
  UuidNotValid = "uuid_not_valid",
  NotRegistered = "not_registered",
  NotInTeam = "not_in_team",
}

export enum LoginError {
  InvalidCode = "invalid_code",
  RequestExpired = "request_expired",
  SessionExpired = "session_expired",
  IPMismatch = "ip_mismatch",
  Denied = "denied",
  InvalidIP = "invalid_ip",
}

export enum PointsError {
  NoPlayers = "no_players",
}

export interface IApiPluginResponse<T = any> {
  content?: T;
  error?: PluginApiError | ValidateError | PointsError | LoginError;
  message?: string;
}

export class BoolApiResponse implements IApiPluginResponse<boolean> {
  @ApiProperty()
  content?: boolean;
  @ApiProperty()
  error?: PluginApiError | ValidateError | PointsError | LoginError;
  @ApiProperty()
  message?: string;
}

class SessionTeam {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  majorTeam: string;
}

class SessionContent implements ISessionResponse {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  team?: SessionTeam;
}

export class SessionApiResponse implements IApiPluginResponse<SessionContent> {
  @ApiProperty()
  content?: SessionContent;
  @ApiProperty()
  error?: PluginApiError | ValidateError | PointsError | LoginError;
  @ApiProperty()
  message?: string;
}
