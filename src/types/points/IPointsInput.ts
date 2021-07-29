import { ApiProperty } from "@nestjs/swagger";
import { mockUuid } from "src/utils/mockdata";

interface IPointPartial {
  points: number;
  uuid: string;
  pointType: number;
  description: string;
  created: Date;
  pointTags?: PointTagPartial[];
}

interface IPointTagPartial {
  key: string;
  value: string;
}

class PointTagPartial implements IPointTagPartial {
  @ApiProperty()
  key: string;

  @ApiProperty()
  value: string;
}

class PointPartial implements IPointPartial {
  @ApiProperty()
  points: number;
  @ApiProperty({
    example: mockUuid,
  })
  uuid: string;
  @ApiProperty()
  pointType: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  created: Date;
  @ApiProperty({ type: [PointTagPartial] })
  pointTags?: PointTagPartial[];
}

export { IPointTagPartial, IPointPartial, PointPartial, PointTagPartial };
