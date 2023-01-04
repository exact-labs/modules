const get = await http.get('https://httpbin.org/get').then((data) => data.json());
const post = await http.post('https://httpbin.org/post', { hello: 'world' }).then((data) => data.json());

core.print(get.pretty());
core.print(post.pretty());
