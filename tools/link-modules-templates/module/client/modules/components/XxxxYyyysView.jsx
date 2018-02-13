import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View, ScrollView, Keyboard } from 'react-native';
import { SwipeAction } from '../../common/components/native';

import XxxxYyyyForm from './XxxxYyyyForm';

export default class XxxxYyyysView extends React.PureComponent {
  static propTypes = {
    xxxxId: PropTypes.number.isRequired,
    yyyys: PropTypes.array.isRequired,
    yyyy: PropTypes.object,
    addYyyyToXxxx: PropTypes.func.isRequired,
    editYyyyInXxxx: PropTypes.func.isRequired,
    deleteYyyyFromXxxx: PropTypes.func.isRequired,
    onYyyySelect: PropTypes.func.isRequired,
    onFormSubmitted: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  keyExtractor = item => item.id;

  renderItem = ({ item: { id, content } }) => {
    const { yyyy, deleteYyyyFromXxxx, onYyyySelect } = this.props;
    return (
      <SwipeAction
        onPress={() => onYyyySelect({ id: id, content: content })}
        right={{
          text: 'Delete',
          onPress: () => this.onYyyyDelete(yyyy, deleteYyyyFromXxxx, onYyyySelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  onYyyyDelete = (yyyy, deleteYyyyFromXxxx, onYyyySelect, id) => {
    if (yyyy.id === id) {
      onYyyySelect({ id: null, content: '' });
    }

    deleteYyyyFromXxxx(id);
  };

  onSubmit = (yyyy, xxxxId, addYyyyToXxxx, editYyyyInXxxx, onYyyySelect, onFormSubmitted) => values => {
    if (yyyy.id === null) {
      addYyyyToXxxx(values.content, xxxxId);
    } else {
      editYyyyInXxxx(yyyy.id, values.content);
    }

    onYyyySelect({ id: null, content: '' });
    onFormSubmitted();
    Keyboard.dismiss();
  };

  render() {
    const { xxxxId, yyyy, addYyyyToXxxx, editYyyyInXxxx, yyyys, onYyyySelect, onFormSubmitted } = this.props;

    return (
      <View>
        <Text style={styles.title}>Yyyys</Text>
        <XxxxYyyyForm
          xxxxId={xxxxId}
          onSubmit={this.onSubmit(yyyy, xxxxId, addYyyyToXxxx, editYyyyInXxxx, onYyyySelect, onFormSubmitted)}
          initialValues={yyyy}
        />
        {yyyys.length > 0 && (
          <ScrollView style={styles.list} keyboardDismissMode="on-drag">
            <FlatList data={yyyys} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    margin: 10
  },
  list: {
    paddingTop: 10
  }
});
