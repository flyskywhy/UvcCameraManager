import * as local from './local';
import * as user from './user';
import * as utils from './utils';
import * as device from './device';
import * as disGroup from './disGroup';

export default {
    ...local,
    ...user,
    ...utils,
    ...device,
    ...disGroup,
};
