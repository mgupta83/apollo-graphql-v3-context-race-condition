import fetch from 'node-fetch';
import { describe, it } from 'node:test';

const GRAPHQL_ENDPOINT = 'http://localhost:7071/api/graphql';

describe('Apollo GraphQL race condition demo', () => {
    it('should trigger two requests with different verified-jwt headers', async () => {
        const query = `
            query demo {
                applicant
            }
        `;

        const headers1 = { 'Content-Type': 'application/json', 'verified-jwt': '{"openIdConfigKey": "Function"}' };
        const headers2 = { 'Content-Type': 'application/json', 'verified-jwt': '{"openIdConfigKey": "ApplicantPortal"}' };

        const request1 = fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: headers1,
            body: JSON.stringify({ query }),
        });

        const request2 = fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: headers2,
            body: JSON.stringify({ query }),
        });

        const [response1, response2] = await Promise.all([request1, request2]);
        const data1 = await response1.json();
        const data2 = await response2.json();
        console.log('Response 1:', data1);
        console.log('Response 2:', data2);
    });
});
