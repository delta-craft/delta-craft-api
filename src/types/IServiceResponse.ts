import {
  LoginError,
  PluginApiError,
  PointsError,
  ValidateError,
} from "./ApiResponse";

export interface IServicePluginResponse<T = any> {
  content?: T;
  error?: PluginApiError | ValidateError | PointsError | LoginError;
  message?: string;
}
