import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:5000';

export const options = {
    stages: [
        { duration: '30s', target: 40 },
        { duration: '40s', target: 50 },
        { duration: '10s', target: 0 }, 
    ],
    ext: {
        loadimpact: {
            name: 'GET /payments Load Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/payments`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has data array': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return Array.isArray(body.data);
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
