import { fs } from 'just/io';
import { http } from 'just/net';
import { cmd, os } from 'just/sys';
import { eval_from_file } from './exec.js';

const dir = __dirname + '/bin/';
const base = 'https://r.justjs.dev/go/bin/';
const files = ['main.go', 'go.mod', 'go.sum', 'cmd/eval.go', 'cmd/root.go'];
const just_path = '%s/.just/bin'.format(os.homedir());

const get_files = async () => {
	fs.dir.create(dir);
	fs.dir.create(dir + 'cmd');

	await Promise.all(
		files.map(async (file) => {
			fs.file.write(dir + file, await http.get(base + file), 'utf8');
		})
	);
};

const clean_up = async () => {
	await Promise.all(
		files.map(async (file) => {
			fs.file.remove(dir + file);
		})
	);

	sleep(1000);
	fs.dir.remove(dir + 'cmd');
	fs.dir.remove(dir);
};

export class Go {
	constructor(args = { verbose: false }) {
		(async () => {
			await get_files().then(() => {
				fs.file.read('bin/go.mod', 'utf8').then((code) => {
					const binary_name = (code.match(/(^.*)/) || [])[1].split(' ')[1] || '';
					const binary_path = '%s/%s'.format(just_path, binary_name);

					const write_binary = async () => {
						fs.file.write(binary_path, await fs.file.read(`bin/${binary_name}`, 'u8'), 'u8');
						fs.chmod(binary_path, 0o755);
						args.verbose && console.log('wrote external runtime file %s'.format(binary_path));
						fs.file.remove('bin/%s'.format(binary_name));
						await clean_up();
					};

					const binary_exists = async () => {
						args.verbose && console.error('external runtime for version: %s already exists'.format(Just.options.justVersion));
						fs.file.remove('bin/%s'.format(binary_name));
						await clean_up();
					};

					fs.dir.create(just_path);
					cmd.spawn('go mod tidy', null, __dirname + '/bin').then(() => {
						cmd.spawn('go', ['build', `-ldflags=-s -w`, '.'], __dirname + '/bin').then(async () => {
							if (fs.dir.exists(just_path) && fs.file.exists(binary_path)) {
								fs.file.sha(binary_path) != fs.file.sha('bin/%s'.format(binary_name)) ? await write_binary() : binary_exists();
							} else {
								await write_binary();
							}
						});
					});
				});
			});
		})();

		var functions = {
			eval: async (path) => eval_from_file(path),
		};

		return functions;
	}
}
