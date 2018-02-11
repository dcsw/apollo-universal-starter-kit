import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { reset } from 'redux-form';

import XxxxYyyysView from '../components/XxxxYyyysView';

import ADD_YYYY_TO_XXXX from '../graphql/AddYyyy.graphql';
import EDIT_YYYY_IN_XXXX from '../graphql/EditYyyy.graphql';
import DELETE_YYYY_FROM_XXXX from '../graphql/DeleteYyyy.graphql';
import YYYY_SUBSCRIPTION from '../../yyyy/graphql/YyyySubscription.graphql';

function AddYyyyToXxxx(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.xxxx.yyyys.some(yyyy => node.id === yyyy.id)) {
    return prev;
  }

  return update(prev, {
    xxxx: {
      yyyys: {
        $push: [node]
      }
    }
  });
}

function DeleteYyyyFromXxxx(prev, id) {
  const index = prev.xxxx.yyyys.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    xxxx: {
      yyyys: {
        $splice: [[index, 1]]
      }
    }
  });
}

class XxxxYyyys extends React.Component {
  static propTypes = {
    xxxxId: PropTypes.number.isRequired,
    yyyys: PropTypes.array.isRequired,
    yyyy: PropTypes.object.isRequired,
    onYyyySelect: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    // Check if props have changed and, if necessary, stop the subscription
    if (this.subscription && this.props.xxxxId !== nextProps.xxxxId) {
      this.subscription = null;
    }

    // Subscribe or re-subscribe
    if (!this.subscription) {
      this.subscribeToYyyyList(nextProps.xxxxId);
    }
  }

  componentWillUnmount() {
    this.props.onYyyySelect({ id: null, content: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToYyyyList = xxxxId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: YYYY_SUBSCRIPTION,
      variables: { xxxxId },
      // updateQuery: (prev, { subscriptionData: { data: { yyyyUpdated: { mutation, id, node } } } }) => {
      //   let newResult = prev;

      //   if (mutation === 'CREATED') {
      //     newResult = AddYyyyToXxxx(prev, node);
      //   } else if (mutation === 'DELETED') {
      //     newResult = DeleteYyyyFromXxxx(prev, id);
      //   }

      //   return newResult;
      // }
    });
  };

  render() {
    return <XxxxYyyysView {...this.props} />;
  }
}

const XxxxYyyysWithApollo = compose(
  graphql(ADD_YYYY_TO_XXXX, {
    props: ({ mutate }) => ({
      addYyyyToXxxx: (content, xxxxId) =>
        mutate({
          variables: { input: { content, xxxxId } },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   addYyyyToXxxx: {
          //     __typename: 'Yyyy',
          //     id: null,
          //     content: content
          //   }
          // },
          updateQueries: {
            xxxx: (prev, { mutationResult: { data: { addYyyyToXxxx } } }) => {
              if (prev.xxxx) {
                return AddYyyyToXxxx(prev, addYyyyToXxxx);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_YYYY_IN_XXXX, {
    props: ({ ownProps: { xxxxId }, mutate }) => ({
      editYyyyInXxxx: (id, content) =>
        mutate({
          variables: { input: { id, xxxxId, content } }
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   editYyyyInXxxx: {
          //     __typename: 'Yyyy',
          //     id: id,
          //     content: content
          //   }
          // }
        })
    })
  }),
  graphql(DELETE_YYYY_FROM_XXXX, {
    props: ({ ownProps: { xxxxId }, mutate }) => ({
      deleteYyyyFromXxxx: id =>
        mutate({
          variables: { input: { id, xxxxId } },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   deleteYyyyFromXxxx: {
          //     __typename: 'Yyyy',
          //     id: id
          //   }
          // },
          updateQueries: {
            xxxx: (prev, { mutationResult: { data: { deleteYyyyFromXxxx } } }) => {
              if (prev.xxxx) {
                return DeleteYyyyFromXxxx(prev, deleteYyyyFromXxxx.id);
              }
            }
          }
        })
    })
  })
)(XxxxYyyys);

export default connect(
  state => ({ yyyy: state.xxxx.yyyy }),
  dispatch => ({
    onYyyySelect(yyyy) {
      dispatch({
        type: 'YYYY_SELECT',
        value: yyyy
      });
    },
    onFormSubmitted() {
      dispatch(reset('yyyy'));
    }
  })
)(XxxxYyyysWithApollo);
