const { ops } = runtime.internal.core;
const keystr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const atobLookup = (chr) => {
	const index = keystr.indexOf(chr);
	return index < 0 ? undefined : index;
};

const btoaLookup = (index) => {
	if (index >= 0 && index < 64) {
		return keystr[index];
	}
	return undefined;
};

export const rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

export const base64 = {
	encode: (string) => {
		let i;
		let s = `${string}`;
		for (i = 0; i < s.length; i++) {
			if (s.charCodeAt(i) > 255) {
				return null;
			}
		}
		let out = '';
		for (i = 0; i < s.length; i += 3) {
			const groupsOfSix = [undefined, undefined, undefined, undefined];
			groupsOfSix[0] = s.charCodeAt(i) >> 2;
			groupsOfSix[1] = (s.charCodeAt(i) & 0x03) << 4;
			if (s.length > i + 1) {
				groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4;
				groupsOfSix[2] = (s.charCodeAt(i + 1) & 0x0f) << 2;
			}
			if (s.length > i + 2) {
				groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6;
				groupsOfSix[3] = s.charCodeAt(i + 2) & 0x3f;
			}
			for (let j = 0; j < groupsOfSix.length; j++) {
				if (typeof groupsOfSix[j] === 'undefined') {
					out += '=';
				} else {
					out += btoaLookup(groupsOfSix[j]);
				}
			}
		}
		return out;
	},
	decode: (data) => {
		data = `${data}`;
		data = data.replace(/[ \t\n\f\r]/g, '');

		if (data.length % 4 === 0) {
			data = data.replace(/==?$/, '');
		}
		if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
			return null;
		}
		let output = '';
		let buffer = 0;
		let accumulatedBits = 0;
		for (let i = 0; i < data.length; i++) {
			buffer <<= 6;
			buffer |= atobLookup(data[i]);
			accumulatedBits += 6;
			if (accumulatedBits === 24) {
				output += String.fromCharCode((buffer & 0xff0000) >> 16);
				output += String.fromCharCode((buffer & 0xff00) >> 8);
				output += String.fromCharCode(buffer & 0xff);
				buffer = accumulatedBits = 0;
			}
		}
		if (accumulatedBits === 12) {
			buffer >>= 4;
			output += String.fromCharCode(buffer);
		} else if (accumulatedBits === 18) {
			buffer >>= 2;
			output += String.fromCharCode((buffer & 0xff00) >> 8);
			output += String.fromCharCode(buffer & 0xff);
		}
		return output;
	},
	test: (str) => /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(str),
};

export const date = {
	diff: (date1, date2) => Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 86400000),
	isWeek: (date) => date.getDay() % 6 !== 0,
	timeFrom: (date) => date.toTimeString().slice(0, 8),
};

export const math = {
	randInt: (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min,
	randFloat: (min = 0, max = 1) => Math.random() * (max - min + 1) + min,
};

export const temp = {
	ctof: (celsius) => (celsius * 9) / 5 + 32,
	ftoc: (fahrenheit) => ((fahrenheit - 32) * 5) / 9,
};