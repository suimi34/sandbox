import { initUrqlClient } from 'next-urql';
import { Client, cacheExchange, fetchExchange } from 'urql';

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql'

export function urqlClient(): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client = initUrqlClient(
      {
        url: GRAPHQL_ENDPOINT,
        exchanges: [cacheExchange, fetchExchange]
      },
      false,
    );
    if (!client) {
      reject(Error('Failed to init initUrqlClient.'));
    } else {
      resolve(client);
    }
  });
}
