const fastify = require( 'fastify' );
const parse_duration = require( 'parse-duration' );
const tinycache = require( 'tinycache' );

module.exports = ( options = {} ) => {
	const cache = new tinycache();
	const app = fastify( options );

	app.register( require( 'fastify-raw-body' ), {
		field: 'raw_body'
	} );

	app.post( '/__clear', ( request, reply ) => {
		if ( typeof process.env.POBOX_CLEAR_KEY !== 'string' ) {
			return reply
				.code( 400 )
				.send( {
					error: 'No clear key is configured, clearing is not allowed without one.'
				} );
		}

		if ( request.headers[ 'x-pobox-clear-key' ] !== process.env.POBOX_CLEAR_KEY ) {
			return reply
				.code( 401 )
				.send( {
					error: 'Unauthorized'
				} );
		}

		cache.clear();

		reply
			.code( 200 )
			.send( {
				cleared: true
			} );
	} );

	app.post( '/*', ( request, reply ) => {
		if ( typeof process.env.POBOX_WRITE_KEY === 'string' ) {
			if ( request.headers[ 'x-pobox-write-key' ] !== process.env.POBOX_WRITE_KEY ) {
				return reply
					.code( 401 )
					.send( {
						error: 'Unauthorized'
					} );
			}
		}

		const box = cache.get( request.url );

		if ( typeof box?.key === 'string' ) {
			if ( request.headers[ 'x-pobox-box-key' ] !== box.key ) {
				return reply
					.code( 401 )
					.send( {
						error: 'Unauthorized'
					} );
			}
		}

		const timeout = typeof request.headers[ 'x-pobox-timeout' ] === 'string' ? parse_duration( request.headers[ 'x-pobox-timeout' ] ) : undefined;

		if ( box ) {
			cache.del( request.url );
		}

		cache.put( request.url, {
			content_type: request.headers[ 'content-type' ],
			body: request.raw_body,
			key: request.headers[ 'x-pobox-box-key' ]
		}, timeout );

		reply
			.code( 200 )
			.send( {
				stored: true
			} );
	} );

	app.get( '/*', ( request, reply ) => {
		if ( typeof process.env.POBOX_READ_KEY === 'string' ) {
			if ( request.headers[ 'x-pobox-read-key' ] !== process.env.POBOX_READ_KEY ) {
				return reply
					.code( 401 )
					.send( {
						error: 'Unauthorized'
					} );
			}
		}

		const box = cache.get( request.url );

		if ( !box ) {
			return reply
				.code( 404 )
				.send( {
					error: 'Missing'
				} );
		}

		if ( typeof box.key === 'string' ) {
			if ( request.headers[ 'x-pobox-box-key' ] !== box.key ) {
				return reply
					.code( 401 )
					.send( {
						error: 'Unauthorized'
					} );
			}
		}

		reply
			.code( 200 )
			.headers( {
				'content-type': box.content_type
			} )
			.send( box.body );
	} );

	app.delete( '/*', ( request, reply ) => {
		if ( typeof process.env.POBOX_DELETE_KEY === 'string' ) {
			if ( request.headers[ 'x-pobox-delete-key' ] !== process.env.POBOX_DELETE_KEY ) {
				return reply
					.code( 401 )
					.send( {
						error: 'Unauthorized'
					} );
			}
		}

		const box = cache.get( request.url );

		if ( !box ) {
			return reply
				.code( 404 )
				.send( {
					error: 'Missing'
				} );
		}

		if ( typeof box.key === 'string' ) {
			if ( request.headers[ 'x-pobox-box-key' ] !== box.key ) {
				return reply
					.code( 401 )
					.send( {
						error: 'Unauthorized'
					} );
			}
		}

		cache.del( request.url );

		reply
			.code( 200 )
			.send( {
				deleted: true
			} );
	} );

	return app;
};