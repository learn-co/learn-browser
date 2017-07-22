
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    "ui": false,
    "files": ['**/*.js'],
    "watchEvents": [
        "change"
    ],
    "watchOptions": {
        "ignoreInitial": true,
        "ignored": ['node_modules', '.git']
    },
    "server": true,
    "proxy": false,
    "port": (process.env.PORT ? process.env.PORT : 8000),
    "middleware": false,
    "serveStatic": [],
    "ghostMode": false,
    "https": false,
    "logLevel": "silent",
    "logPrefix": "Learn.co",
    "logConnections": false,
    "logFileChanges": false,
    "logSnippet": false,
    "rewriteRules": [],
    "open": (process.env.IDE_CONTAINER === 'true' ? false : 'local'),
    "browser": "default",
    "cors": false,
    "xip": false,
    "hostnameSuffix": false,
    "reloadOnRestart": false,
    "notify": false,
    "scrollProportionally": true,
    "scrollThrottle": 10000,
    "scrollRestoreTechnique": "window.name",
    "scrollElements": [],
    "scrollElementMapping": [],
    "reloadDelay": 0,
    "reloadDebounce": 2000,
    "reloadThrottle": 2000,
    "plugins": [],
    "injectChanges": true,
    "startPath": null,
    "minify": false,
    "host": null,
    "localOnly": false,
    "codeSync": true,
    "timestamps": true,
    "clientEvents": [
        "scroll",
        "scroll:element",
        "input:text",
        "input:toggles",
        "form:submit",
        "form:reset",
        "click"
    ],
    "socket": {
        "socketIoOptions": {
            "log": false
        },
        "socketIoClientConfig": {
            "reconnectionAttempts": 50
        },
        "path": "/browser-sync/socket.io",
        "clientPath": "/browser-sync",
        "namespace": "/browser-sync",
        "clients": {
            "heartbeatTimeout": 5000
        }
    },
    "tagNames": {
        "less": "link",
        "scss": "link",
        "css": "link",
        "jpg": "img",
        "jpeg": "img",
        "png": "img",
        "svg": "img",
        "gif": "img",
        "js": "script"
    }
};
