const libCoverage = require("istanbul-lib-coverage");
const fs = require("fs");
const path = require("path");

class SummaryReporter {
	constructor(globalConfig, options) {
		this._globalConfig = globalConfig;
		this._options = options;
	}

	onRunComplete(contexts, results) {
		const {
			numPassedTests,
			numFailedTests,
			numTotalTests,
			coverageMap
		} = results;

		const map = libCoverage.createCoverageMap(coverageMap);
		const summary = libCoverage.createCoverageSummary();

		map.files().forEach(file => {
			const fileCoverage = map.fileCoverageFor(file);
			const fileCoverageSummary = fileCoverage.toSummary();
			summary.merge(fileCoverageSummary);
		});

		this.writeFile({
			results: {
				numPassedTests,
				numFailedTests,
				numTotalTests
			},
			coverage: summary.data
		});
	}

	writeFile(data) {
		const filepath =
			this._options.filepath || path.join(__dirname, "summary.json");
		fs.writeFileSync(filepath, JSON.stringify(data));
	}
}

module.exports = SummaryReporter;
