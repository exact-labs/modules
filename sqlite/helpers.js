export const formatJson = (string) =>
	JSON.parse(
		`[${string
			.slice(2, -2)
			.split('}", "{')
			.join('},{')
			.replaceAll('\\', '')
			.replace(/"(-|)([0-9]+(?:\.[0-9]+)?)"/g, '$1$2')}]`
	);
