// JavaScript source code

import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    iterations: 100,
    vus: 10,
};

export function setup() {
    const accessToken = getAccessToken();
    console.log(accessToken);
    return accessToken
}

export default function (data) {
    createDevice(data);
}

export function createDevice(accessToken) {

    var deviceId = uuidv4();

    const url = __ENV.AUTHMINION_URL + '/api/device/';
    const payload = JSON.stringify({
        DeviceUdid: deviceId,
        TenantId: deviceId,
        DeviceName: deviceId,
        DeviceType: 'k6-perf'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
    };

    http.post(url, payload, params);

    //const response = http.head("http://localhost:5138/device/" + deviceId);
}


export function getAccessToken() {

    var clientId = "m2m.client";
    var clientSecret = "511536EF-F270-4058-80CA-1C89C192F69A";
    var scope = "requestaccessuriapi.full";

    var requestBody = 'client_id=' + clientId + '&client_secret=' + clientSecret + '&grant_type=client_credentials&scope=' + scope;

    var url = __ENV.AUTHMINION_URL + '/connect/token';

    const params = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    var response = http.post(url, requestBody, params);
    console.log(response.status);

    return response.json().access_token;
}
