// based on https://github.com/nmaggioni/Simple-JSONdb

import { fs } from 'just/io';
import { validateJSON } from './helpers.js';

let global = {
	file_path: '',
	options: {
		jsonSpaces: 2,
		stringify: JSON.stringify,
		parse: JSON.parse,
	},
	storage: {},
};

let globalStorage = {};

const init = async (filePath, options) => {
	if (!filePath || !filePath.length) {
		throw new Error('Missing file path argument.');
	} else {
		global.file_path = filePath;
	}

	if (options) {
		for (let key in defaultOptions) {
			if (!options.hasOwnProperty(key)) options[key] = defaultOptions[key];
		}
		global.options = options;
	}

	let stats;
	try {
		stats = await fs.stat(filePath);
	} catch (err) {
		if (err.code === 'ENOENT') {
			return;
		} else if (err.code === 'EACCES') {
			throw new Error(`Cannot access path "${filePath}".`);
		} else {
			throw new Error(`Error while checking for existence of path "${filePath}": ${err}`);
		}
	}

	if (stats.size > 0) {
		let data;
		try {
			data = await fs.file.read(filePath, 'utf8');
		} catch (err) {
			throw err;
		}
		if (validateJSON.bind(this)(data)) global.storage = global.options.parse(data);
	}
};

const set = (key, value) => {
	global.storage[key] = value;
	if (global.options && global.options.syncOnWrite) this.sync();
};

const get = (key) => {
	return global.storage.hasOwnProperty(key) ? global.storage[key] : undefined;
};

const has = (key) => {
	return global.storage.hasOwnProperty(key);
};

const remove = (key) => {
	let retVal = global.storage.hasOwnProperty(key) ? delete global.storage[key] : undefined;
	if (global.options && global.options.syncOnWrite) this.sync();
	return retVal;
};

const deleteAll = () => {
	for (var key in global.storage) {
		this.delete(key);
	}
	return this;
};

const sync = async () => {
	try {
		await fs.file.write(global.file_path, global.options.stringify(global.storage, null, global.options.jsonSpaces), 'utf8');
	} catch (err) {
		if (err.code === 'EACCES') {
			throw new Error(`Cannot access path "${global.file_path}".`);
		} else {
			throw new Error(`Error while writing to path "${global.file_path}": ${err}`);
		}
	}
};

const JSON_INTERNAL = (storage) => {
	if (storage) {
		try {
			JSON.parse(global.options.stringify(storage));
			global.storage = storage;
		} catch (err) {
			throw new Error('Given parameter is not a valid JSON object.');
		}
	}
	return JSON.parse(global.options.stringify(global.storage));
};

export class JSONdb {
	constructor(filePath, options) {
		(async () => {
			await init(filePath, options);
		})();

		var functions = {
			set: set,
			get: get,
			has: has,
			delete: remove,
			deleteAll: deleteAll,
			sync: sync,
			JSON: JSON_INTERNAL,
		};

		return functions;
	}
}
