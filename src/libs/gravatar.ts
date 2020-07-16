import { async } from 'rxjs';

import { createHash } from 'crypto';

export const generateGravatar = (email: string): string => {
  let gravatarURL = '';
  const sha512 = createHash('sha512').update(email).digest('hex');
  const size = 200;
  gravatarURL = `https://gravatar.com/avatar/${sha512}?s=${size}&d=retro`;
  return gravatarURL;
};
