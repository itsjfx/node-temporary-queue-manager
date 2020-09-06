const TemporaryQueueManager = require('../lib/index.js');
const delay = require('delay');

let queueManager = new TemporaryQueueManager(1);
queueManager.on("debug", (log) => console.log(log));
(async () => {
	queueManager.add("test", async () => {
		console.log("Start 1");
		await delay(2000);
		console.log("Done 1");
		return Promise.resolve(true);
	});
	//await delay(0);
	queueManager.add("test", async () => {
		console.log("Start 2");
		await delay(4000);
		console.log("Done 2");
		return Promise.resolve(true);
	});
	queueManager.add("unrelated", async () => {
		console.log("Start unrelated");
		await delay(1000);
		console.log("Done unrelated");
		return Promise.resolve(true);
	});
})();