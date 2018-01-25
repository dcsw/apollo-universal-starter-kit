import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import XxxxForm from './XxxxForm';
// START-LINKED-MODULE-TEMPLATE-0
// import XxxxYyyys from '../containers/XxxxYyyys';
// END-LINKED-MODULE-TEMPLATE-0
// TARGET-LINKED-MODULE-TEMPLATE-0

const onSubmit = (xxxx, addXxxx, editXxxx) => values => {
  if (xxxx) {
    editXxxx(xxxx.id, values.title, values.content);
  } else {
    addXxxx(values.title, values.content);
  }
};

const XxxxEditView = ({ loading, xxxx, navigation, subscribeToMore, addXxxx, editXxxx }) => {
  let xxxxObj = xxxx;

  // if new xxxx was just added read it from router
  if (!xxxxObj && navigation.state) {
    xxxxObj = navigation.state.params.xxxx;
  }

  if (loading && !xxxxObj) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <XxxxForm onSubmit={onSubmit(xxxxObj, addXxxx, editXxxx)} initialValues={xxxxObj ? xxxxObj : {}} />
        {
          // START-LINKED-MODULE-TEMPLATE-1
          // xxxxObj && (
          //   <XxxxYyyys xxxxId={navigation.state.params.id} yyyys={xxxxObj.yyyys} subscribeToMore={subscribeToMore} />
          // )
          // END-LINKED-MODULE-TEMPLATE-1
          // TARGET-LINKED-MODULE-TEMPLATE-1
        }
      </View>
    );
  }
};

XxxxEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  xxxx: PropTypes.object,
  addXxxx: PropTypes.func.isRequired,
  editXxxx: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  }
});

export default XxxxEditView;