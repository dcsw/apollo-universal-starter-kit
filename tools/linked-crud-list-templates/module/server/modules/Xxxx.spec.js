import { expect } from 'chai';
import { step } from 'mocha-steps';

import { getApollo } from '../../testHelpers/integrationSetup';
import XXXXS_QUERY from '../../../client/modules/xxxx/graphql/XxxxsQuery.graphql';
import XXXX_QUERY from '../../../client/modules/xxxx/graphql/XxxxQuery.graphql';
import ADD_XXXX from '../../../client/modules/xxxx/graphql/AddXxxx.graphql';
import EDIT_XXXX from '../../../client/modules/xxxx/graphql/EditXxxx.graphql';
import DELETE_XXXX from '../../../client/modules/xxxx/graphql/DeleteXxxx.graphql';
import XXXXS_SUBSCRIPTION from '../../../client/modules/xxxx/graphql/XxxxsSubscription.graphql';

describe('Xxxx and yyyys example API works', () => {
  let apollo;

  before(() => {
    apollo = getApollo();
  });

  step('Query xxxx list works', async () => {
    let result = await apollo.query({
      query: XXXXS_QUERY,
      variables: { limit: 1, after: 0 }
    });

    expect(result.data).to.deep.equal({
      xxxxs: {
        totalCount: 20,
        edges: [
          {
            cursor: 20,
            node: {
              id: 20,
              title: 'Xxxx title 20',
              content: 'Xxxx content 20',
              __typename: 'Xxxx'
            },
            __typename: 'XxxxEdges'
          }
        ],
        pageInfo: {
          endCursor: 20,
          hasNextPage: true,
          __typename: 'XxxxPageInfo'
        },
        __typename: 'Xxxxs'
      }
    });
  });

  step('Query single xxxx with yyyys works', async () => {
    let result = await apollo.query({ query: XXXX_QUERY, variables: { id: 1 } });

    expect(result.data).to.deep.equal({
      xxxx: {
        id: 1,
        title: 'Xxxx title 1',
        content: 'Xxxx content 1',
        __typename: 'Xxxx',
        yyyys: [
          {
            id: 1,
            content: 'Yyyy title 1 for xxxx 1',
            __typename: 'Yyyy'
          },
          {
            id: 2,
            content: 'Yyyy title 2 for xxxx 1',
            __typename: 'Yyyy'
          }
        ]
      }
    });
  });

  step('Publishes xxxx on add', done => {
    apollo.mutate({
      mutation: ADD_XXXX,
      variables: {
        input: {
          title: 'New xxxx 1',
          content: 'New xxxx content 1'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: XXXXS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              xxxxsUpdated: {
                mutation: 'CREATED',
                node: {
                  id: 21,
                  title: 'New xxxx 1',
                  content: 'New xxxx content 1',
                  __typename: 'Xxxx'
                },
                __typename: 'UpdateXxxxPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Adding xxxx works', async () => {
    let result = await apollo.query({
      query: XXXXS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.xxxxs).to.have.property('totalCount', 21);
    expect(result.data.xxxxs).to.have.nested.property('edges[0].node.title', 'New xxxx 1');
    expect(result.data.xxxxs).to.have.nested.property('edges[0].node.content', 'New xxxx content 1');
  });

  step('Publishes xxxx on update', done => {
    apollo.mutate({
      mutation: EDIT_XXXX,
      variables: {
        input: {
          id: 21,
          title: 'New xxxx 2',
          content: 'New xxxx content 2'
        }
      }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: XXXXS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              xxxxsUpdated: {
                mutation: 'UPDATED',
                node: {
                  id: 21,
                  title: 'New xxxx 2',
                  content: 'New xxxx content 2',
                  __typename: 'Xxxx'
                },
                __typename: 'UpdateXxxxPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Updating xxxx works', async () => {
    let result = await apollo.query({
      query: XXXXS_QUERY,
      variables: { limit: 1, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.xxxxs).to.have.property('totalCount', 21);
    expect(result.data.xxxxs).to.have.nested.property('edges[0].node.title', 'New xxxx 2');
    expect(result.data.xxxxs).to.have.nested.property('edges[0].node.content', 'New xxxx content 2');
  });

  step('Publishes xxxx on removal', done => {
    apollo.mutate({
      mutation: DELETE_XXXX,
      variables: { id: '21' }
    });

    let subscription;

    subscription = apollo
      .subscribe({
        query: XXXXS_SUBSCRIPTION,
        variables: { endCursor: 10 }
      })
      .subscribe({
        next(data) {
          expect(data).to.deep.equal({
            data: {
              xxxxsUpdated: {
                mutation: 'DELETED',
                node: {
                  id: 21,
                  title: 'New xxxx 2',
                  content: 'New xxxx content 2',
                  __typename: 'Xxxx'
                },
                __typename: 'UpdateXxxxPayload'
              }
            }
          });
          subscription.unsubscribe();
          done();
        }
      });
  });

  step('Deleting xxxx works', async () => {
    let result = await apollo.query({
      query: XXXXS_QUERY,
      variables: { limit: 2, after: 0 },
      fetchPolicy: 'network-only'
    });
    expect(result.data.xxxxs).to.have.property('totalCount', 20);
    expect(result.data.xxxxs).to.have.nested.property('edges[0].node.title', 'Xxxx title 20');
    expect(result.data.xxxxs).to.have.nested.property('edges[0].node.content', 'Xxxx content 20');
  });
});
