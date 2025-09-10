# apollo-graphql-v3-context-race-condition

## Development Instructions

1. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Run the Application**
    ```bash
    npm run start
    ```

3. **Run Tests (in a different terminal)**
    ```bash
    npm run nodetest
    ```

Refer to the `package.json` for additional scripts and configuration details.

## Test Execution

1. **Check apollo logs for success scenario**
    ```bash
    applicantUpdate | token | Applicant| {"aamcExternalId":"00000000-0000-0000-0000-00000000000","aamcId":"A00000000","lastName":"User","restOfName":"ReadOnly","gender":"U","dateOfBirth":"1900-01-01T00:00:00.000Z","email":"readonly.user@example.com","citizenshipCountryCode":"US","birthCity":"Los Angeles","birthStateCode":"CA","birthCountryCode":"US"}
    applicantUpdate | token | System| undefined
    ```