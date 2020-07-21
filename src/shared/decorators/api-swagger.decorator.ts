import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { CommonMessage } from '@app/constants/app.enums';

export function SwaggerAPI() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: CommonMessage.UNAUTHORIZED }),
    ApiForbiddenResponse({ description: CommonMessage.FORBIDDEN }),
    ApiOkResponse({ description: CommonMessage.SUCCESS }),
    ApiCreatedResponse({ description: CommonMessage.SUCCESS }),
    ApiBadRequestResponse({ description: CommonMessage.BAD_REQUEST }),
    ApiInternalServerErrorResponse({ description: CommonMessage.INTERNAL_SERVER_ERROR }),
  );
}
