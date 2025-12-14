import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: (process.env.VITE_API_BASE || 'http://localhost:4000/api').replace('/api', '/graphql'),
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// You can also export common queries here if you prefer not to keep them in components
import { gql } from '@apollo/client';

export const GET_INSPECTION_QUERY = gql`
  query GetInspection($id: ID!) {
    inspection(id: $id) {
      id
      date
      turbine {
        name
      }
      findings {
        id
        category
        severity
        notes
      }
    }
  }
`;

export const GENERATE_REPAIR_PLAN_MUTATION = gql`
  mutation GenerateRepairPlan($inspectionId: ID!) {
    generateRepairPlan(inspectionId: $inspectionId) {
      id
      priority
      totalEstimatedCost
    }
  }
`;