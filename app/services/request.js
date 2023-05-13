import qs from 'query-string';
import config from '../configs';

// import fetch from 'react-native-fetch-polyfill';
const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

const fetchTime = 10 * 1000;

function filterJSON(res) {
  return res.json();
}

function filterStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    let error = new Error(res.statusText);
    error.res = res;
    error.type = 'http';
    throw error;
  }
}

function networkError(res) {
  res.statusText = res.statusText || '网络出现问题，请检查网络配置';
  res.status = 404;

  let error = new Error(res.statusText);
  error.res = res;
  error.type = 'http';
  throw error;
}

export function vendorGet(url, params) {
  if (params) {
    url += `?${qs.stringify(params)}`;
  }
  if (isDebuggingInChrome) {
    console.info('GET: ', url);
    console.info('Params: ', params);
  }
  return fetch(url, {
    timeout: fetchTime,
  })
    .then(filterStatus, networkError)
    .then(filterJSON);
}

export function get(url, params) {
  url = config.domain + config.api.apiPath + url;
  if (params) {
    url += `?${qs.stringify(params)}`;
  }
  if (isDebuggingInChrome) {
    console.info('GET: ', url);
    console.info('Params: ', params);
  }
  return fetch(url, {
    timeout: fetchTime,
    credentials: 'include',
  })
    .then(filterStatus, networkError)
    .then(filterJSON);
}

export function post(url, body) {
  url = config.domain + config.api.apiPath + url;
  if (isDebuggingInChrome) {
    console.info('POST: ', url);
    console.info('Body: ', body);
  }
  return fetch(url, {
    timeout: fetchTime,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(filterStatus, networkError)
    .then(filterJSON);
}

export function put(url, body) {
  url = config.domain + config.api.apiPath + url;

  if (isDebuggingInChrome) {
    console.info('PUT: ', url);
    console.info('Body: ', body);
  }

  return fetch(url, {
    timeout: fetchTime,
    credentials: 'include',
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(filterStatus, networkError)
    .then(filterJSON);
}

export function del(url, params) {
  url = config.domain + config.api.apiPath + url;
  if (params) {
    url += `?${qs.stringify(params)}`;
  }
  if (isDebuggingInChrome) {
    console.info('DELETE: ', url);
    console.info('Params: ', params);
  }

  return fetch(url, {
    timeout: fetchTime,
    credentials: 'include',
    method: 'DELETE',
  })
    .then(filterStatus, networkError)
    .then(filterJSON);
}

export function uploadFormData(url, query, file) {
  url = config.domain + config.api.apiPath + url;
  if (query) {
    url += `?${qs.stringify(query)}`;
  }

  let formData = new window.FormData();
  formData.append('file', file);

  if (isDebuggingInChrome) {
    console.info('POST: ', url);
    console.info('Body: ', file.name);
  }

  return fetch(url, {
    timeout: fetchTime,
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
    .then(filterStatus, networkError)
    .then(filterJSON);
}

export function upload(url, query, file, progress, resolved, rejected) {
  url = config.domain + config.api.apiPath + url;
  if (query) {
    url += `?${qs.stringify(query)}`;
  }
  let formData = new window.FormData();
  formData.append('file', file);

  var xhr = new XMLHttpRequest();
  xhr.open('post', url, true);
  xhr.onload = function (evt) {
    resolved && resolved(evt.target.responseText);
  };
  xhr.onerror = function (evt) {
    rejected && rejected();
  };
  xhr.upload.onprogress = function (evt) {
    if (evt.lengthComputable) {
      progress(evt.loaded, evt.total);
    }
  };
  xhr.upload.onloadstart = function () {};
  xhr.send(formData);
}

export function canOpenURL(url) {
  return fetch(url).then(filterStatus, networkError);
}
