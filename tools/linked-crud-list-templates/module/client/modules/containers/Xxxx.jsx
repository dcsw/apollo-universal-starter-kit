import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';

import XxxxList from '../components/XxxxList';

import XXXXS_QUERY from '../graphql/XxxxsQuery.graphql';
import XXXXS_SUBSCRIPTION from '../graphql/XxxxsSubscription.graphql';
import DELETE_XXXX from '../graphql/DeleteXxxx.graphql';

export function AddXxxx(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.xxxxs.edges.some(xxxx => node.id === xxxx.cursor)) {
    return prev;
  }

  const edge = {
    cursor: node.id,
    node: node,
    __typename: 'XxxxEdges'
  };

  return update(prev, {
    xxxxs: {
      totalCount: {
        $set: prev.xxxxs.totalCount + 1
      },
      edges: {
        $unshift: [edge]
      }
    }
  });
}

function DeleteXxxx(prev, id) {
  const index = prev.xxxxs.edges.findIndex(x => x.node.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    xxxxs: {
      totalCount: {
        $set: prev.xxxxs.totalCount - 1
      },
      edges: {
        $splice: [[index, 1]]
      }
    }
  });
}

class Xxxx extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    xxxxs: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      const endCursor = this.props.xxxxs ? this.props.xxxxs.pageInfo.endCursor : 0;
      const nextEndCursor = nextProps.xxxxs.pageInfo.endCursor;

      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && endCursor !== nextEndCursor) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription) {
        this.subscribeToXxxxList(nextEndCursor);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToXxxxList = endCursor => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: XXXXS_SUBSCRIPTION,
      variables: { endCursor },
      updateQuery: (prev, { subscriptionData: { data: { xxxxsUpdated: { mutation, node } } } }) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddXxxx(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteXxxx(prev, node.id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <XxxxList {...this.props} />;
  }
}

export default compose(
  graphql(XXXXS_QUERY, {
    options: () => {
      return {
        variables: { limit: 10, after: 0 }
      };
    },
    props: ({ data }) => {
      const { loading, error, xxxxs, fetchMore, subscribeToMore } = data;
      const loadMoreRows = () => {
        return fetchMore({
          variables: {
            after: xxxxs.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const totalCount = fetchMoreResult.xxxxs.totalCount;
            const newEdges = fetchMoreResult.xxxxs.edges;
            const pageInfo = fetchMoreResult.xxxxs.pageInfo;

            return {
              // By returning `cursor` here, we update the `fetchMore` function
              // to the new cursor.
              xxxxs: {
                totalCount,
                edges: [...previousResult.xxxxs.edges, ...newEdges],
                pageInfo,
                __typename: 'Xxxxs'
              }
            };
          }
        });
      };
      if (error) throw new Error(error);
      return { loading, xxxxs, subscribeToMore, loadMoreRows };
    }
  }),
  graphql(DELETE_XXXX, {
    props: ({ mutate }) => ({
      deleteXxxx: id => {
        mutate({
          variables: { id },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   deleteXxxx: {
          //     id: id,
          //     __typename: 'Xxxx'
          //   }
          // },
          updateQueries: {
            xxxxs: (prev, { mutationResult: { data: { deleteXxxx } } }) => {
              return DeleteXxxx(prev, deleteXxxx.id);
            }
          }
        });
      }
    })
  })
)(Xxxx);
