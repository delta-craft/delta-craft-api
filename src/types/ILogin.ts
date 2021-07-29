import { ApiProperty } from "@nestjs/swagger";
import { mockIp, mockUuid } from "src/utils/mockdata";

interface ILoginData {
  uuid: string;
  ip: string;
}

class LoginData implements ILoginData {
  @ApiProperty({
    example: mockUuid,
  })
  uuid: string;

  @ApiProperty({
    example: mockIp,
  })
  ip: string;
}

export { ILoginData, LoginData };
