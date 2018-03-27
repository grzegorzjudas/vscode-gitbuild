# VSCode Github build status

A plugin that shows current build status fetched from Github (if available).

![Screenshot](images/screenshot.png)

## How it works

When ".vsgitbuild" is available in the workspace, plugin looks for ".git" folder down to the root folder, starting from workspace directory. When found, it'll fetch repository information and use configuration in the file to fetch build status information from Github API every N seconds (and every time current commit changes - if you commit something, or if branch changes).

## Enabling

In order to enable the plugin, you need to have a ".vsgitbuild" file in your workspace. This should be a JSON-formatted file, containing configuration:

```json
{
    "username": "[github_username]",
    "password": "[github_auth_token]",
    "strictTls": true,
    "pooling": 10
}
```

**username** - Your Github username that'll be used to fetch the status
**password** - Either your password or auth token; it is **strongly** recommended to **not** use your password, but auth token - for details, see [here](https://blog.github.com/2013-05-16-personal-api-tokens/)
**strictTls** - If set to false, plugin will **not** check certificate validity when connecting through HTTPS. Not recommended, however, may be required on some systems
**pooling** - In seconds, defines how often the app will check the build status (basides commit change re-check)
