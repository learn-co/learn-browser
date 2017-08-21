const fs = require('fs');
const os = require('os');

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

// Grab the necessary info from ~/.netrc
let learnOAuthToken, githubUsername, githubUserID;

(function getAuthData () {
  try {
    const netrc = fs.readFileSync(os.homedir() + '/.netrc', 'utf8');

    const tokenStart = netrc.indexOf('login learn\n  password ') + 23;
    learnOAuthToken = netrc.slice(tokenStart, tokenStart + 64);

    const githubStart = netrc.indexOf('flatiron-push\n  login ') + 22;
    const githubInfo = netrc.slice(githubStart).match(/^([\dA-Za-z][\dA-Za-z-]{0,38})\D+(\d+)/);
    githubUsername = githubInfo[1];
    githubUserID = githubInfo[2];
  } catch (e) {
    console.warn("Unable to parse .netrc file. Please run the 'learn whoami' command to ensure");
    console.warn("that you are authenticated. Use Ask a Question on Learn.co for additional help.");
    process.exit(1);
  }
})();

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
    "port": process.env.MOCHA_PORT || process.env.PORT || 8000,
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
    "open": !process.env.IDE_CONTAINER && 'local',
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
    "host": process.env.HOST_IP || null,
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

        // Pass the ~/.netrc info to the browser via this config object
        "socketIoClientConfig": {
            "reconnectionAttempts": 50,
            "username": githubUsername,
            "github_user_id": githubUserID,
            "learn_oauth_token": learnOAuthToken,
            "repo_name": process.env.LAB_NAME || process.cwd().match(/[^/]+$/)[0],
            "ruby_platform": process.env.RUBY_PLATFORM,
            "ide_container": !!process.env.IDE_CONTAINER
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
