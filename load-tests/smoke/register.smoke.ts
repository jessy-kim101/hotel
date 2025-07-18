import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,     
    iterations: 1,
};

function randomEmail(): string {
    return `user${Math.floor(Math.random() * 1000000)}@example.com`;
}

export default function () {
    const url = 'http://localhost:5000/auth/register';

    const payload = JSON.stringify({
        firstname: "Mary", 
        lastname: "Jane", 
        email: randomEmail(),
        password: "jane#4207777",
        role: 'user'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
        'message present': (r) => {
            try {
                const body = JSON.parse(typeof r.body === 'string' ? r.body : '');
                return body.message !== undefined;
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
