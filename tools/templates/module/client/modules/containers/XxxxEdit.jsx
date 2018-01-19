import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import XxxxEditView from '../components/XxxxEditView';
import { AddXxxx } from './Xxxx';

import XXXX_QUERY from '../graphql/XxxxQuery.graphql';
import ADD_XXXX from '../graphql/AddXxxx.graphql';
import EDIT_XXXX from '../graphql/EditXxxx.graphql';
import XXXX_SUBSCRIPTION from '../graphql/XxxxSubscription.graphql';

class XxxxEdit extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    xxxx: PropTypes.object,
    subscribeToMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading) {
      // Check if props have changed and, if necessary, stop the subscription
      if (this.subscription && this.props.xxxx.id !== nextProps.xxxx.id) {
        this.subscription();
        this.subscription = null;
      }

      // Subscribe or re-subscribe
      if (!this.subscription && nextProps.xxxx) {
        this.subscribeToXxxxEdit(nextProps.xxxx.id);
      }
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
    }
  }

  subscribeToXxxxEdit = xxxxId => {
    const { subscribeToMore } = this.props;

    this.subscription = subscribeToMore({
      document: XXXX_SUBSCRIPTION,
      variables: { id: xxxxId }
    });
  };

  render() {
    return <XxxxEditView {...this.props} />;
  }
}

export default compose(
  graphql(XXXX_QUERY, {
    options: props => {
      let id = 0;
      if (props.match) {
        id = props.match.params.id;
      } else if (props.navigation) {
        id = props.navigation.state.params.id;
      }

      return {
        variables: { id }
      };
    },
    props({ data: { loading, error, xxxx, subscribeToMore } }) {
      if (error) throw new Error(error);
      return { loading, xxxx, subscribeToMore };
    }
  }),
  graphql(ADD_XXXX, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      addXxxx: async (title, content) => {
        let xxxxData = await mutate({
          variables: { input: { title, content } },
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   addXxxx: {
          //     __typename: 'Xxxx',
          //     id: null,
          //     title: title,
          //     content: content,
          // START-LINKED-MODULE-TEMPLATE-0
          ////     yyyys: []
          // END-LINKED-MODULE-TEMPLATE-0
          // TARGET-LINKED-MODULE-TEMPLATE-0
          //   }
          // },
          updateQueries: {
            xxxxs: (prev, { mutationResult: { data: { addXxxx } } }) => {
              return AddXxxx(prev, addXxxx);
            }
          }
        });

        if (history) {
          return history.push('/xxxx/' + xxxxData.data.addXxxx.id, {
            xxxx: xxxxData.data.addXxxx
          });
        } else if (navigation) {
          return navigation.setParams({
            id: xxxxData.data.addXxxx.id,
            xxxx: xxxxData.data.addXxxx
          });
        }
      }
    })
  }),
  graphql(EDIT_XXXX, {
    props: ({ ownProps: { history, navigation }, mutate }) => ({
      editXxxx: async (id, title, content) => {
        await mutate({
          variables: { input: { id, title, content } }
        });

        if (history) {
          return history.push('/xxxxs');
        }
        if (navigation) {
          return navigation.goBack();
        }
      }
    })
  })
)(XxxxEdit);
