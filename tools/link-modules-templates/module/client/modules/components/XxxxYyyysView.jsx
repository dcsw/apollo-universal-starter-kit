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
    addYyyy: PropTypes.func.isRequired,
    editYyyy: PropTypes.func.isRequired,
    deleteYyyy: PropTypes.func.isRequired,
    onYyyySelect: PropTypes.func.isRequired,
    onFormSubmitted: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  keyExtractor = item => item.id;

  renderItem = ({ item: { id, content } }) => {
    const { yyyy, deleteYyyy, onYyyySelect } = this.props;
    return (
      <SwipeAction
        onPress={() => onYyyySelect({ id: id, content: content })}
        right={{
          text: 'Delete',
          onPress: () => this.onYyyyDelete(yyyy, deleteYyyy, onYyyySelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  onYyyyDelete = (yyyy, deleteYyyy, onYyyySelect, id) => {
    if (yyyy.id === id) {
      onYyyySelect({ id: null, content: '' });
    }

    deleteYyyy(id);
  };

  onSubmit = (yyyy, xxxxId, addYyyy, editYyyy, onYyyySelect, onFormSubmitted) => values => {
    if (yyyy.id === null) {
      addYyyy(values.content, xxxxId);
    } else {
      editYyyy(yyyy.id, values.content);
    }

    onYyyySelect({ id: null, content: '' });
    onFormSubmitted();
    Keyboard.dismiss();
  };

  render() {
    const { xxxxId, yyyy, addYyyy, editYyyy, yyyys, onYyyySelect, onFormSubmitted } = this.props;

    return (
      <View>
        <Text style={styles.title}>Yyyys</Text>
        <XxxxYyyyForm
          xxxxId={xxxxId}
          onSubmit={this.onSubmit(yyyy, xxxxId, addYyyy, editYyyy, onYyyySelect, onFormSubmitted)}
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
