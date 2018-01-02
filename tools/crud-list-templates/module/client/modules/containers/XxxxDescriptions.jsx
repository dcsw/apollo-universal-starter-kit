import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { reset } from 'redux-form';

import XxxxDescriptionsView from '../components/XxxxDescriptionsView';

import ADD_DESCRIPTION from '../graphql/AddDescription.graphql';
import EDIT_DESCRIPTION from '../graphql/EditDescription.graphql';
import DELETE_DESCRIPTION from '../graphql/DeleteDescription.graphql';
import DESCRIPTION_SUBSCRIPTION from '../graphql/DescriptionSubscription.graphql';

function AddDescription(prev, node) {
  // ignore if duplicate
  if (node.id !== null && prev.xxxx.descriptions.some(description => node.id === description.id)) {
    return prev;
  }

  return update(prev, {
    xxxx: {
      descriptions: {
        $push: [node]
      }
    }
  });
}

function DeleteDescription(prev, id) {
  const index = prev.xxxx.descriptions.findIndex(x => x.id === id);

  // ignore if not found
  if (index < 0) {
    return prev;
  }

  return update(prev, {
    xxxx: {
      descriptions: {
        $splice: [[index, 1]]
      }
    }
  });
}

class XxxxDescriptions extends React.Component {
  static propTypes = {
    xxxxId: PropTypes.number.isRequired,
    descriptions: PropTypes.array.isRequired,
    description: PropTypes.object.isRequired,
    onDescriptionSelect: PropTypes.func.isRequired,
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
      this.subscribeToDescriptionList(nextProps.xxxxId);
    }
  }

  componentWillUnmount() {
    this.props.onDescriptionSelect({ id: null, content: '' });

    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToDescriptionList = xxxxId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: DESCRIPTION_SUBSCRIPTION,
      variables: { xxxxId },
      updateQuery: (prev, { subscriptionData: { data: { descriptionUpdated: { mutation, id, node } } } }) => {
        let newResult = prev;

        if (mutation === 'CREATED') {
          newResult = AddDescription(prev, node);
        } else if (mutation === 'DELETED') {
          newResult = DeleteDescription(prev, id);
        }

        return newResult;
      }
    });
  };

  render() {
    return <XxxxDescriptionsView {...this.props} />;
  }
}

const XxxxDescriptionsWithApollo = compose(
  graphql(ADD_DESCRIPTION, {
    props: ({ mutate }) => ({
      addDescription: (content, xxxxId) =>
        mutate({
          variables: { input: { content, xxxxId } },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   addDescription: {
          //     __typename: 'Description',
          //     id: null,
          //     content: content
          //   }
          // },
          updateQueries: {
            xxxx: (prev, { mutationResult: { data: { addDescription } } }) => {
              if (prev.xxxx) {
                return AddDescription(prev, addDescription);
              }
            }
          }
        })
    })
  }),
  graphql(EDIT_DESCRIPTION, {
    props: ({ ownProps: { xxxxId }, mutate }) => ({
      editDescription: (id, content) =>
        mutate({
          variables: { input: { id, xxxxId, content } }
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   editDescription: {
          //     __typename: 'Description',
          //     id: id,
          //     content: content
          //   }
          // }
        })
    })
  }),
  graphql(DELETE_DESCRIPTION, {
    props: ({ ownProps: { xxxxId }, mutate }) => ({
      deleteDescription: id =>
        mutate({
          variables: { input: { id, xxxxId } },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   deleteDescription: {
          //     __typename: 'Description',
          //     id: id
          //   }
          // },
          updateQueries: {
            xxxx: (prev, { mutationResult: { data: { deleteDescription } } }) => {
              if (prev.xxxx) {
                return DeleteDescription(prev, deleteDescription.id);
              }
            }
          }
        })
    })
  })
)(XxxxDescriptions);

export default connect(
  state => ({ description: state.xxxx.description }),
  dispatch => ({
    onDescriptionSelect(description) {
      dispatch({
        type: 'DESCRIPTION_SELECT',
        value: description
      });
    },
    onFormSubmitted() {
      dispatch(reset('description'));
    }
  })
)(XxxxDescriptionsWithApollo);
