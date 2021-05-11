const Pobox = require( './index.js' );

const pobox = Pobox( {
	logger: {
		level: 'info',
		prettyPrint: true,
		redact: [ 'req.headers.cookie' ],
		serializers: {
			res ( reply ) {
				return {
					statusCode: reply.statusCode
				};
			},
			req ( request ) {
				return {
					method: request.method,
					url: request.url,
					path: request.path,
					parameters: request.parameters,
					headers: request.headers
				};
			}
		}
	}
} );

const port = process.env.POBOX_PORT ?? 8000;
const host = process.env.POBOX_HOST ?? '::';

pobox.listen( {
	port,
	host,
	ipv6Only: false
}, () => {
	console.log( `POBOX listening on ${ host }:${ port }` );
} );