# mock-auth-backend
> A mock backend to test JWT auth.

## Install
Requires `node` and `npm`. Install with `npm install`.

## Configure
Edit `config/default.json` to configure.

```javascript
{
    "port": 8085,
    "secret": "supda-dupa-secret",

    //Modify those to mimick the backend API you are mocking
    "authenticationRoute": "/auth",
    "authorizationRoute": "/protected",

    //Define all roles known to the backend
    "roles": ["admin"]

    //Additional routes that need a specific role for authorization
    "routes": [
        {
            "path": "/admin",
            "role": "admin"
        }
    ]
}
````

Edit `accounts.json` to set up a few users. Default is:
```json
[
    {
        "identifier": "a@b.com",
        "password": "test",
        "roles": ["admin"]
    },
    {
        "identifier": "c@d.com",
        "password": "test",
        "roles": []
    }
]
````

## Run
Run the server with `node index.js`.

## Query
The following routes are available (paths can be changed in the config, see above):

| Method  | Path | Body | Positive response | Negative response
| ------------- | ------------- | ------------- | ------------- | ------------- |
| POST  | /auth | `{identifier: "identifier", password: "password"}` | `{success: true, token: "token"}` | `{success: false, message: "Error message."}` |
| GET  | /protected | - | `{success: true}` | `{success: false, message: "Error message."}` |

Additional `GET` authorization routes are available, if set through the `routes` config methods. Those are meant to authorize only if the token contains a certain role (see section about configuration above).
