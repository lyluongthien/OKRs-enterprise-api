import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumber, IsString } from 'class-validator';
import { CheckinStatus, ConfidentLevel } from '@app/constants/app.enums';

export class CreateCheckinDTO {
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

  @IsNotEmpty()
  @IsEnum(CheckinStatus)
  @ApiProperty({ enum: [CheckinStatus.DRAFT, CheckinStatus.PEDDING, CheckinStatus.DONE] })
  public status: CheckinStatus;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  public keyResultId: number;
}
