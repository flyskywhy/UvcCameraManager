import * as requestService from './request';
import config from '../configs';

export function registerDev(id2, sign, key) {
  return requestService.post(
    config.api.registerDevPOST.path
      .replace(/:userDbid/, 0)
      .replace(/:devId/, 0),
    {
      id2,
      sign,
      key,
    },
  );
}

export function unregisterDev({id}) {
  return requestService.del(
    config.api.destroyDevDELETE.path
      .replace(/:userDbid/, 0)
      .replace(/:devId/, id),
    {},
  );
}

export function getDevices(query = {}) {
  return requestService.get(
    config.api.deviceListGET.path.replace(/:userDbid/, 0),
    {
      perpage: 20,
      page: 1,
      ...query,
    },
  );
}

export function configDev(id, cfg, checkedLabel) {
  return requestService.put(config.api.devCfgPUT.path.replace(/:devDbid/, id), {
    name: cfg.name,
  });
}

export function getDevConfig(id) {
  return requestService.get(
    config.api.devCfgGET.path.replace(/:devDbid/, id),
    {},
  );
}

export function share({vsDbid, body}) {
  return requestService.put(
    config.api.devOwnerPunitPUT.path.replace(/:vsDbid/, vsDbid),
    body,
  );
}

export function modifyDeviceOwner({devDbid, phone, code}) {
  return requestService.put(
    config.api.changeDeviceOwnerPUT.path
      .replace(/:userDbid/, 0)
      .replace(/:devDbid/, devDbid),
    {
      phone,
      code,
    },
  );
}
