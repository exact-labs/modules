import { http } from 'just/net';

let get = await http.get('https://httpbin.org/get').then((data: any) => data.json());
let post = await http.post('https://httpbin.org/post', { hello: 'world' }).then((data: any) => data.json());

core.print(get.pretty());
core.print(post.pretty());
