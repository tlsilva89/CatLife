import { ApplicationConfig, inject } from '@angular/core';
import { ApolloClientOptions, InMemoryCache, ApolloLink } from '@apollo/client/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../config/enviroment';

export function apolloOptionsFactory(): ApolloClientOptions {
  const httpLink = inject(HttpLink);
  const uri = environment.graphqlUrl;

  const authMiddleware = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');
    
    operation.setContext(({ headers = {} }: any) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }));
    
    return forward(operation);
  });

  return {
    link: authMiddleware.concat(httpLink.create({ uri })),
    cache: new InMemoryCache(),
  };
}

export const graphqlProvider: ApplicationConfig['providers'] = [
  Apollo,
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloOptionsFactory,
  },
];