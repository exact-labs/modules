const validateJSON = (fileContent) => {
	try {
		this.options.parse(fileContent);
	} catch (e) {
		console.error('Given filePath is not empty and its content is not valid JSON.');
		throw e;
	}
	return true;
};

export { validateJSON };
