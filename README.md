# getir-assignment
## Instructions
Run the commands below respectively to run the app:
```
cd <project_directory>
npm run build
MONGODB_URI=<mongodb_uri> SESSION_SECRET=<session_secret> node dist/server.js
```
App will start at port 3000.

Run the command below for tests:
```
npm run test
```

Heroku deployment address:
https://pacific-stream-74609.herokuapp.com/

App is expecting requests described in the assignment document from "/records" endpoint.

## Notes
My intention was to change a couple of things about the app but I didn't to satisfy the requirements.
1. I would have preferred writing a get endpoint which expects query parameters instead of a post request
with a request payload because this endpoint is not changing resources on the service.
2. Sending response with HTTP error status codes to indicate the error instead of putting a status indicator inside
response body
3. Pagination. However after seeing over-engineering warning and the expected duration to solve the assignment, I didn't
add it.