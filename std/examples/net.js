let get = await http.get('https://httpbin.org/get').then((data) => data.json());
let post = await http.post('https://httpbin.org/post', { hello: 'world' }).then((data) => data.json());

console.log(get.pretty());
console.log(post.pretty());
