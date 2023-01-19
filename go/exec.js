import { fs } from 'just/io';
import { cmd, os } from 'just/sys';

const exec_code = (name, args) => cmd.exec('%s/.just/bin/lib_ext.bin %s %s'.format(os.homedir(), name, args));
const eval_from_file = (path) => fs.file.read(path, 'utf8').then((code) => exec_code('eval_go', encodeURIComponent(code)));

export { eval_from_file };
