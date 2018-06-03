import * as requestService from './request';
import config from '../configs';

export function getDisGroup({perpage = 20, page = 1}) {
    return requestService.get(config.api.dispGroupsGET.path.replace(/:userDbid/, 0), {
        perpage,
        page
    });
}

export function deleteDisGroup({groupDbid}) {
    return requestService.del(config.api.rmDispGroupsDELETE.path.replace(/:userDbid/, 0).replace(/:groupDbid/, groupDbid), {

    });
}

export function getGroupScreen({groupDbid, perpage = 20, page = 1}) {
    return requestService.get(config.api.dispGroupsScreensGET.path.replace(/:userDbid/, 0).replace(/:groupDbid/, groupDbid), {
        perpage,
        page
    });
}
