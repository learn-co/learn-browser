const LearnBrowser = function () {
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

  // Shortcut
  const formatted_output = results.build.test_suite[0].formatted_output;

  function test () {
    const runner = mocha.run()
      .on('test end', test => sortTest(test))
      .on('end', () => {
        if (runner._grep.toString() === '/.*/') {
          addCountingStats(runner);

          pushResults(results);
        } else {
          console.warn('Not all tests ran. Not pushing data to Learn.');
        }
      });
  }

  function sortTest (test) {
    const formattedTestOutput = formatTestOutput(test);
    formatted_output.tests.push(formattedTestOutput);

    if (test.pending) {
      formatted_output.pending.push(formattedTestOutput);
    } else if (test.state === 'passed') {
      formatted_output.passes.push(formattedTestOutput);
    } else if (test.state === 'failed') {
      formatted_output.failures.push(formattedTestOutput);
    }
  }

  function addCountingStats (runner) {
    results.examples = runner.total;
    results.passing_count = runner.stats.passes;
    results.failure_count = runner.stats.failures;
    results.pending_count = runner.stats.pending;
    formatted_output.stats = runner.stats;
    results.build.test_suite[0].duration = runner.stats;
  }

  function pushResults (testResults) {
    fetch('learn.auth.data.json')
      .then(authFile => authFile.json())
      .then(authData => Object.assign({}, authData, testResults))
      .then(payload => postPayload(payload))
      .catch(error => console.error(error));
  }

  function postPayload(payload) {
    fetch('http://ironbroker-v2.flatironschool.com/e/flatiron_mocha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      mode: "no-cors"
    })
      .then(response => {
        if (response.ok) {
          // Parse response and print relevant data to student, such as a confirmed submission message
        } else if (response.type === 'opaque') {
          console.warn("'no-cors' mode enabled.")
        } else {
          console.error(response);
        }
      })
      .catch(error => console.error(error));
  }

  function formatTestOutput (test) {
    return {
      title: test.title,
      fullTitle: getFullTitle(test),
      duration: test.duration,
      currentRetry: test._currentRetry,
      err: test.err
    };
  }

  function getFullTitle (test) {
    let fullTitle = test.title;
    let parent = test.parent;

    while (parent && parent.constructor.name === 'Suite') {
      fullTitle = parent.title.concat(' ', fullTitle);
      parent = parent.parent;
    }

    return fullTitle;
  }

  return {
    test: test
  };
}();
