import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException } from '@nestjs/common';
import { UNSUPPORTED_FILE_TYPE } from '@app/constants/app.exeption';
import { limitFileUploadSize } from '@app/constants/app.magic-number';

export const multerOptions = {
  limits: {
    fileSize: limitFileUploadSize,
  },
  storage: diskStorage({
    destination: './avatars',
    filename: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      } else {
        return cb(
          new HttpException(
            `${UNSUPPORTED_FILE_TYPE.message}: ${extname(file.originalname)}`,
            UNSUPPORTED_FILE_TYPE.statusCode,
          ),
          false,
        );
      }
    },
  }),
};
