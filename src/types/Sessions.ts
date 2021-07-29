export default interface ISessionResponse {
  success: boolean;
  team?: {
    id: number;
    name: string;
    majorTeam: string;
  };
}
