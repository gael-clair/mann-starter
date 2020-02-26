import * as mongoose from 'mongoose';

import { DATABASE_URL } from '../../config/constants';
import { getStringFromEnv } from '../../config/utils';

export function mongooseOptionFactory() {
  (mongoose as any).Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);
  return {
    useNewUrlParser: true,
    uri: getStringFromEnv(DATABASE_URL),
  };
}
