import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  noConnectionReuse: true,
  noVUConnectionReuse: true,
  discardResponseBodies: true,
  insecureSkipTLSVerify: true,

  stages: [
    { duration: '30s', target: 150  },
    { duration: '20s', target: 250  },
    { duration: '10s', target: 350  },
  ],  
};

export default function () {
  let res = http.get(__ENV.PERFTEST_URL + '/perftest?numberOfDevices=1');

    check(res, {
      "Response status code is 200": (r) => r.status === 200
    });

    sleep(randomIntBetween(1, 10)); 
}

