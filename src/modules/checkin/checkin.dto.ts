import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { ConfidentLevel } from '@app/constants/app.enums';
import { Optional } from '@nestjs/common';

export class CreateCheckinDTO {
  public checkin: CheckinDTO;

  public checkinDetails: CheckinDetailDTO[];
}

export class CheckinDTO {
  @Optional()
  public id: number;

  @IsEnum(ConfidentLevel)
  @ApiProperty()
  public confidentLevel: ConfidentLevel;

  @ApiProperty()
  public checkinAt: Date;

  @ApiProperty()
  public nextCheckinDate: Date;

  @ApiProperty()
  public teamLeaderId: number;

  @ApiProperty()
  public objectiveId: number;
}

export class CheckinDetailDTO {
  @Optional()
  public id: number;

  @IsNotEmpty()
  @ApiProperty()
  public valueObtained: number;

  @IsNotEmpty()
  @IsEnum(ConfidentLevel)
  @ApiProperty()
  public confidentLevel: ConfidentLevel;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public progress: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public problems: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public plans: string;

  @ApiProperty()
  public checkinId: number;

  @ApiProperty()
  public keyResultId: number;
}
