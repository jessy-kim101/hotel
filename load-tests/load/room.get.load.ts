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
            name: 'GET /rooms Load Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/rooms`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has rooms array': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return Array.isArray(body.rooms);
            } catch {
                return false;
            }
        },
    });
    sleep(1);
}
