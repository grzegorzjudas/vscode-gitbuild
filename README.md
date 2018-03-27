# VSCode Github build status

A plugin that shows current build status fetched from Github (if available).

![Screenshot](images/screenshot.png)

## Enabling

In order to enable the plugin, you need to have a ".vsgitbuild" file in your workspace. This should be a JSON-formatted file, containing configuration:

```json
{
    "username": "[github_username]",
    "password": "[github_auth_token]",
    "strictTls": true
}
```

**username** - Your Github username that'll be used to fetch the status
**password** - Either your password or auth token; it is **strongly** recommended to **not** use your password, but auth token - for details, see [here](https://blog.github.com/2013-05-16-personal-api-tokens/)
**strictTls** - If set to false, plugin will **not** check certificate validity when connecting through HTTPS. Not recommended, however, may be required on some systems
