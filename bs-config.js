const fs = require('fs');
const os = require('os');
const util = require('util');

// Messages
const NETRC_ERROR = "Unable to parse .netrc file. Please run the 'learn whoami' command to ensure that you are authenticated. Use Ask a Question on Learn.co for additional help.";
const SAVE_MESSAGE_1 = 'As you write code in index.js, save your work often. With each save, the browser';
const SAVE_MESSAGE_2 = 'will automatically refresh and rerun the test suite against your updated code.';

const getToken = netrc => {
    const re = /machine learn-config[^\w]*login [\dA-Za-z][\dA-Za-z-]{0,38}[^\w]+password ([\dA-Fa-f]{64})/;
    return netrc.match(re)[1];
};

const getGitHubInfo = netrc => {
    const re = /machine flatiron-push[^\w]*login ([\dA-Za-z][\dA-Za-z-]{0,38})[^\w]+password (\d+)/;
    return netrc.match(re).slice(1, 3);
};

// Grab the necessary info from ~/.netrc
const getAuthData = () => {
  try {
    const netrc = fs.readFileSync(os.homedir() + '/.netrc', 'utf8');

    return [getToken(netrc), ...getGitHubInfo(netrc)];
  } catch (e) {
    console.warn(NETRC_ERROR);

    process.exit(1);
  }
};

const [learnOAuthToken, githubUsername, githubID] = getAuthData();

// Colorize me, cap'n!
setTimeout(() => {
  util.inspect.styles.string = 'blue';
  const colorizedTestingAddress = util.inspect(`http://${process.env.HOST_IP || 'localhost'}:${process.env.MOCHA_PORT || process.env.PORT || 8000}`, { colors: true }).replace(/['"]/g, '');

  util.inspect.styles.string = 'red';
  const setupMessageStart = util.inspect('Navigate to', { colors: true }).replace(/['"]/g, '');
  const setupMessageEnd = util.inspect('in your browser to run the test suite.', { colors: true }).replace(/['"]/g, '');
  const exitMessage = util.inspect('To exit the test suite and return to your terminal, press Control-C.', { colors: true }).replace(/['"]/g, '');

  console.log(setupMessageStart, colorizedTestingAddress, setupMessageEnd);
  console.log(SAVE_MESSAGE_1);
  console.log(SAVE_MESSAGE_2);
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
    "reloadDebounce": 1000,
    "reloadThrottle": 1000,
    "plugins": [],
    "injectChanges": true,
    "startPath": null,
    "minify": false,
    "host": process.env.HOST_IP || null,
    "localOnly": false,
    "codeSync": true,
    "timestamps": true,
    "clientEvents": [],
    "socket": {
        "socketIoOptions": {
            "log": false
        },

        // Pass the ~/.netrc info to the browser via this config object
        "socketIoClientConfig": {
            "reconnectionAttempts": 1,
            "username": githubUsername,
            "github_user_id": githubID,
            "learn_oauth_token": learnOAuthToken,
            "repo_name": process.env.LAB_NAME || process.cwd().match(/[^/]+$/)[0],
            "ruby_platform": process.env.RUBY_PLATFORM || process.env.RUBY_VERSION || process.env.GEM_HOME && process.env.GEM_HOME.match(/[^/]*$/)[0],
            "ide_container": !!process.env.IDE_CONTAINER,
            "learning_environment": process.env.LEARNING_ENVIRONMENT || 'local'
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
