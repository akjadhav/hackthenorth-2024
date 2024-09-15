import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { updateEntities } from './entities';

const http = httpRouter();

http.route({
  path: '/.well-known/openid-configuration',
  method: 'GET',
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({
        issuer: 'https://silent-seahorse-185.convex.cloud',
        jwks_uri:
          'https://silent-seahorse-185.convex.cloud' + '/.well-known/jwks.json',
        authorization_endpoint:
          'https://silent-seahorse-185.convex.cloud' + '/oauth/authorize',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control':
            'public, max-age=15, stale-while-revalidate=15, stale-if-error=86400',
        },
      }
    );
  }),
});

http.route({
  path: '/.well-known/jwks.json',
  method: 'GET',
  handler: httpAction(async () => {
    if (process.env.JWKS === undefined) {
      throw new Error('Missing JWKS Convex environment variable');
    }
    return new Response(process.env.JWKS, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control':
          'public, max-age=15, stale-while-revalidate=15, stale-if-error=86400',
      },
    });
  }),
});

http.route({
  path: '/updateEntities',
  method: 'POST',
  handler: updateEntities,
});

export default http;
