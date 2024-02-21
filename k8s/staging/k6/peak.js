import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const VUS = 100;

export const options = {
  vus: VUS,
  noConnectionReuse: false,
  discardResponseBodies: true,
  insecureSkipTLSVerify: true,

  stages: [
    { duration: '30s', target: VUS },
    { duration: '60s', target: VUS },
    { duration: '30s', target: 0 },
  ],  
};

export default function () {
    let res = http.get(__ENV.PERFTEST_URL + '/perftest?numberOfDevices=1');

    check(res, {
      "Response status code is 200": (r) => r.status === 200
    });

    sleep(randomIntBetween(1, 10)); 
}

