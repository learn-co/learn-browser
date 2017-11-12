window.onload = (function () {
  // Check that index.html is set up correctly.
  const mochaDiv = document.getElementById('mocha');

  if (mochaDiv === null) throw new Error('Check that a div#mocha element exists in the <body> in index.html.');

  if (mocha === mochaDiv) throw new Error('Check that Mocha is added via a <script> tag in index.html.');

  if (window.describe === undefined) throw new Error('Check that Mocha is set up for BDD-style testing in index.html.');

  if (window.chai === undefined) throw new Error('Please use Chai as the matchers library for testing Learn.co JavaScript lessons.');

  // Create constants.
  const IRONBROKER = 'http://ironbroker-v2.flatironschool.com/e/flatiron_mocha';

  const LOAD_ORDER_ERROR = 'Make sure the LearnBrowser JS file is loaded *after* the test suite in index.html.';
  const NO_BROWSERSYNC_ERROR = "In order to push test data to Learn's servers, you must start the test suite from your terminal with the 'learn' or 'npm test' command.";
  const CONNECTION_ERROR = 'Unable to contact Learn servers. Please check your Internet connection and try again.';

  // Tally up tests on our own since Mocha doesn't include grepped out tests in its count.
  const countTests = (suite, count) => {
    for (const s of suite.suites) {
      count = countTests(s, count);
    }

    return count += suite.tests.length;
  }

  const testCount = countTests(mocha.suite, 0);

  // Build results object to match our existing Node-based Mocha results.
  const results = {
    build: {
      test_suite: [{
        framework: 'mocha',
        formatted_output: {
          tests: [],
          pending: [],
          failures: [],
          passes: []
        }
      }]
    }
  };

  // Shortcut to access deeply-nested property
  const { formatted_output } = results.build.test_suite[0];

  const runTests = () => {
    const runner = mocha.run()
      .on('test end', test => sortTest(formatTestOutput(test)))
      .on('end', () => prepareResults(runner));
  };

  const prepareResults = runner => {
    if (___browserSync___ === undefined) {
      console.warn(NO_BROWSERSYNC_ERROR);
    } else if (runner.total === 0) {
      console.warn(LOAD_ORDER_ERROR);
    } else if (runner.total !== testCount) {
      console.warn(`${runner.total} out of ${testCount} tests ran.`);
    } else {
      addCountingStats(runner);

      const payload = createPayload(results, ___browserSync___.socketConfig);

      postPayload(payload);
    }
  };

  const sortTest = test => {
    formatted_output.tests.push(test);

    switch (true) {
      case test.state === 'failed':
        formatted_output.failures.push(test);
        break;
      case test.state === 'passed':
        formatted_output.passes.push(test);
        break;
      case test.pending:
        formatted_output.pending.push(test);
        break;
    }
  };

  const addCountingStats = ({ stats }) => {
    results.examples = testCount;
    results.passing_count = stats.passes;
    results.failure_count = stats.failures;
    results.pending_count = stats.pending;
    formatted_output.stats = stats;
    results.build.test_suite[0].duration = stats;
  };

  const createPayload = (results, { username, github_user_id, learn_oauth_token, repo_name, ruby_platform, ide_container, learning_environment }) => Object.assign({}, results, {
    username,
    github_user_id,
    learn_oauth_token,
    repo_name,
    ruby_platform,
    ide_container,
    learning_environment
  });

  const postPayload = payload => fetch(IRONBROKER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors' // TODO: Add CORS headers to Ironbroker
    })
    .catch(e => console.warn(CONNECTION_ERROR));

  const formatTestOutput = ({ title, parent, duration, _currentRetry: currentRetry, err }) => ({
    title,
    fullTitle: getFullTitle(title, parent),
    duration,
    currentRetry,
    err
  });

  const getFullTitle = (title, parent) => {
    while (parent && parent.constructor.name === 'Suite') {
      title = parent.title.concat(' ', title);
      parent = parent.parent;
    }

    return title.trim();
  };

  return () => runTests();
})();
