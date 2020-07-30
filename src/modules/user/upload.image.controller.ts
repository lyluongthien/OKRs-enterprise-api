import { Controller, Get, Param, Res } from '@nestjs/common';
import { SwaggerAPI } from '@app/shared/decorators/api-swagger.decorator';
import { ObjectLiteral } from 'typeorm';

@Controller('/avatars')
@SwaggerAPI()
export class UploadImageController {
  @Get(':fileName')
  public async serveAvatar(@Param('fileName') fileName: string, @Res() res: ObjectLiteral): Promise<any> {
    res.sendFile(fileName, { root: 'avatars' });
  }
}
