const fs = require('fs');
const os = require('os');
const util = require('util');

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

// Colorize me, cap'n!
setTimeout(() => {
  util.inspect.styles.string = 'blue';
  const colorizedTestingAddress = util.inspect(`http://${process.env.HOST_IP || 'localhost'}:${process.env.MOCHA_PORT || process.env.PORT || 8000}`, { colors: true }).replace(/['"]/g, '');

  util.inspect.styles.string = 'red';
  const setupMessage1 = util.inspect('Navigate to', { colors: true }).replace(/['"]/g, '');
  const setupMessage2 = util.inspect('in your browser to run the test suite.', { colors: true }).replace(/['"]/g, '');
  const exitMessage = util.inspect('To exit the test suite and return to your terminal, press Control-C.', { colors: true }).replace(/['"]/g, '');

  console.log(setupMessage1, colorizedTestingAddress, setupMessage2);
  console.log('As you write code in index.js, save your work often. With each save, the browser');
  console.log('will automatically refresh and rerun the test suite against your updated code.')
  console.log(exitMessage);
}, 0);

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
    "port": process.env.PORT || 8000,
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
