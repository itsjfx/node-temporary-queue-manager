const {default: PQueue} = require('p-queue');
const EventEmitter = require('events').EventEmitter;

/**
 * TemporaryQueueManager, logging using EventEmitter under 'debug'
 * @class 
 * @extends EventEmitter
 */
class TemporaryQueueManager extends EventEmitter {
	/**
	 * @param {int} concurrency - How many jobs to run at once 
	 */
	constructor(concurrency = 1) {
		super();
		this._concurrency = concurrency;
		 // Holds our queues as a key to value Map, where the key is the name of the queue, and value is the pQueue instance.
		this._queues = new Map();
	}

	/**
	 * Adds a new job to a given queue and queues it for execution
	 * @param {String} queueName - Name of queue
	 * @param {Function} job - Promise-returning/async function 
	 * @returns {Promise} - Result the job
	 */
	add(queueName, job) {
		this.emit("debug", "add() Called");
		if (this._queues.has(queueName)) { // Add the job to an existing queue
			this.emit("debug", `Queue "${queueName}" exists, adding to existing queue`);
			return this._queues.get(queueName).add(job);
		} else { // We have to make a new queue
			let queue = new PQueue({concurrency: this._concurrency});
			// Handle our idle event
			queue.on('idle', () => {
				this.emit("debug", `Queue "${queueName}" is idle, removing queue from manager`);
				this._queues.delete(queueName);
			});
			this._queues.set(queueName, queue);
			this.emit("debug", `Created queue: "${queueName}"`);
			return queue.add(job);
		}
	}

	/**
	 * Get a queue with a given name
	 * @param {String} queueName - Name of queue
	 * @returns {PQueue} - The p-queue instance
	 */
	getQueue(queueName) {
		return this._queues.get(queueName);
	}

	/**
	 * @returns {int} - Amount of current temporary queues
	 */
	get size() {
		return this._queues.size;
	}

	/**
	 * @returns {int} - Amount of current temporary queues
	 */
	get queues() {
		return this._queues.size;
	}
}

module.exports = TemporaryQueueManager;