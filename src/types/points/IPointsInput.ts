import { ApiProperty } from "@nestjs/swagger";

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
  @ApiProperty({
    type: Number,
  })
  @ApiProperty()
  points: number;
  @ApiProperty({
    example: "5dfc3ded-e5fb-456d-b708-64d877348762",
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
