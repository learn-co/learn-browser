window.onload = (function () {
  // Tally up tests on our own since Mocha doesn't include grepped out tests in its count.
  let testCount = 0;

  const countTests = suites => {
    for (const suite of suites) {
      if (suite.tests) {
        testCount += suite.tests.length;
      }

      if (suite.suites && suite.suites.length) {
        countTests(suite.suites);
      }
    }
  };

  countTests(mocha.suite.suites);

  // Build framework of results object
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
      .on('test end', test => sortTest(test))
      .on('end', () => {
        if (___browserSync___) {
          if (runner.total !== testCount) {
            if (runner.total) {
              console.warn(`${runner.total} out of ${testCount} tests ran.`);
            } else {
              console.warn('Make sure the LearnBrowser JS file is loaded *after* the test suite in index.html.');
            }
          }

          addCountingStats(runner);

          const payload = createPayload(results, ___browserSync___.socketConfig);

          postPayload(payload);
        } else {
          console.warn("In order to push test data to Learn's servers, you must start the test suite from your terminal with the 'learn' or 'npm test' command.");
        }
      });
  };

  const sortTest = test => {
    const formattedTestOutput = formatTestOutput(test);

    formatted_output.tests.push(formattedTestOutput);

    switch (true) {
      case test.state === 'failed':
        formatted_output.failures.push(formattedTestOutput);
        break;
      case test.state === 'passed':
        formatted_output.passes.push(formattedTestOutput);
        break;
      case test.pending:
        formatted_output.pending.push(formattedTestOutput);
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

  const createPayload = (results, { username, github_user_id, learn_oauth_token, repo_name, ruby_platform, ide_container }) => Object.assign({}, results, {
    username,
    github_user_id,
    learn_oauth_token,
    repo_name,
    ruby_platform,
    ide_container
  });

  const postPayload = payload => fetch('http://ironbroker-v2.flatironschool.com/e/flatiron_mocha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: 'no-cors' // TODO: Add CORS headers to Ironbroker
    })
    .then(response => { /* noop */ })
    .catch(error => console.warn('Unable to contact Learn servers. Please check your Internet connection and try again.'));

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
