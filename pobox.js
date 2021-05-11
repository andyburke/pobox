const Pobox = require( './index.js' );

const pobox = Pobox();

const port = process.env.POBOX_PORT ?? 8000;
const host = process.env.POBOX_HOST ?? '::';

pobox.lixten( {
	port,
	host,
	ipv6Only: false
}, () => {
	console.log( `POBOX listening on ${ host }:${ port }` );
} );