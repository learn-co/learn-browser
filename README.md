# Learn Browser

[![npm version](https://badge.fury.io/js/learn-browser.svg)](https://www.npmjs.com/package/learn-browser)

## Summary
This package is for testing Flatiron School's JavaScript curriculum with a hot-reloading dev server and browser-based Mocha runner.

## How does it work?
The script is invoked when the `window.onload` event fires. In rough order, this is what happens:
1. The script counts up how many tests are in the test suite. It doesn't rely on Mocha's internal count because Mocha allows users to selectively run portions of a test suite. When that happens, Mocha will report the total number of _tests that ran_ as the total number of examples. E.g., if a student has one passing test in a 50-test suite and chooses to run only that test (by clicking on the 'play' symbol next to the test description in the browser), Mocha will report that the entire test suite contains one test and the student passed one test. If we simply passed this on to Learn's servers, it would erroneously trigger the **Run Local Tests** light to turn green for the student, suggesting that they completed the lab despite only passing a single test.
2. The script builds a `results` object that mirrors the object sent to Ironbroker by the old, Node-based Mocha / Mocha Multi test strategy. The results object is poorly structured, containing some duplicate information and some very odd nesting, but I matched it up exactly with the old payloads for data consistency. Eventually, it would be cool to rethink the payload structure to make it easier to look at granular data on how students are interacting with our tests.
3. The script invokes the test runner (Mocha) and attaches two lifecycle hooks. After each individual test runs, the script formats the test output and then sorts the test into one of three categories, **pending**, **failures**, or **passes**. After the last test finishes, Learn Browser adds some counting stats to the `results` object, creates the payload that will be transmitted to Ironbroker, and then sends it off.

## Installation
To use Learn Browser to test a new lab or code-along, add the package as a project dependency with Yarn:
```bash
yarn add learn-browser
```

or with NPM:
```bash
npm i --save learn-browser
```

## Usage
In the lesson's `index.html` file, add the minified version of Learn Browser in a script tag:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- *snip* -->
  </head>

  <body>
    <!-- *snip* -->

    <!-- Include Flatiron School's minified test runner to push results to Learn. -->
    <script src="node_modules/learn-browser/learnBrowser.min.js"></script>
  </body>
</html>
```

**The minified copy of Learn Browser should be the last thing loaded in `index.html`**. The script has some basic dependency checking built-in, but, in general, the `index.html` file should look like this:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- <title> and <meta> tags -->

    <!-- Include Mocha's stylesheet to style test results -->
    <link rel="stylesheet" href="node_modules/mocha/mocha.css">
  </head>

  <body>
    <!-- <div> for Mocha to display test results. -->
    <div id="mocha"></div>

    <!-- Include Mocha and set it up for BDD-style testing. -->
    <script src="node_modules/mocha/mocha.js"></script>
    <script>mocha.setup('bdd');</script>

    <!-- Include Chai as the matcher library. -->
    <script src="node_modules/chai/chai.js"></script>

    <!-- Include Sinon as the library for spies, stubs, and mocks. -->
    <script src="node_modules/sinon/pkg/sinon.js"></script>

    <!-- Include the student's JavaScript file. -->
    <script src="index.js"></script>

    <!-- Include the JavaScript file containing the tests. -->
    <script src="test/indexTest.js"></script>

    <!-- Include Flatiron School's minified test runner to push results to Learn. -->
    <script src="node_modules/learn-browser/learnBrowser.min.js"></script>
  </body>
</html>
```

## Contributing
Bug reports and pull requests are welcome on [GitHub](https://github.com/learn-co/learn-browser).

## License
The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
