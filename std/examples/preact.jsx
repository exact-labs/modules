// esm
import { h, Component } from 'https://esm.sh/stable/preact@10.11.3/es2022/preact.js';
import { render } from 'https://esm.sh/v102/preact-render-to-string@5.2.6/es2022/preact-render-to-string.js';

// built in
import { server } from 'just/net';
import { fs } from 'just/io';

/** @jsx h */

class Fox extends Component {
	render({ name }) {
		return (
			<p>
				The foxes name is: <span class='fox'>{name}</span>
			</p>
		);
	}
}

const Headers = ({ styles, children }) => (
	<html>
		<style>{styles}</style>
		<body>{children}</body>
	</html>
);

const Box = ({ type, children }) => <div class={`box box-${type}`}>{children}</div>;

const styles = `.fox {
   color: rgb(255, 124, 57);
   font-family: sans-serif;
   font-size: 2rem;
}`;

server.string(
	render(
		<Headers styles={styles}>
			<Box type='open'>
				<Fox name='Fuzzy' />
			</Box>
		</Headers>
	),
	'text/html; charset=UTF-8'
);
