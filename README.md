# mock-auth-backend
> A mock backend to test JWT auth.

## Install
Install with `npm install`.

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
