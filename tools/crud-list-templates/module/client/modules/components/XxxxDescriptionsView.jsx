import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View, ScrollView, Keyboard } from 'react-native';
import { SwipeAction } from '../../common/components/native';

import XxxxDescriptionForm from './XxxxDescriptionForm';

export default class XxxxDescriptionsView extends React.PureComponent {
  static propTypes = {
    xxxxId: PropTypes.number.isRequired,
    descriptions: PropTypes.array.isRequired,
    description: PropTypes.object,
    addDescription: PropTypes.func.isRequired,
    editDescription: PropTypes.func.isRequired,
    deleteDescription: PropTypes.func.isRequired,
    onDescriptionSelect: PropTypes.func.isRequired,
    onFormSubmitted: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  keyExtractor = item => item.id;

  renderItem = ({ item: { id, content } }) => {
    const { description, deleteDescription, onDescriptionSelect } = this.props;
    return (
      <SwipeAction
        onPress={() => onDescriptionSelect({ id: id, content: content })}
        right={{
          text: 'Delete',
          onPress: () => this.onDescriptionDelete(description, deleteDescription, onDescriptionSelect, id)
        }}
      >
        {content}
      </SwipeAction>
    );
  };

  onDescriptionDelete = (description, deleteDescription, onDescriptionSelect, id) => {
    if (description.id === id) {
      onDescriptionSelect({ id: null, content: '' });
    }

    deleteDescription(id);
  };

  onSubmit = (description, xxxxId, addDescription, editDescription, onDescriptionSelect, onFormSubmitted) => values => {
    if (description.id === null) {
      addDescription(values.content, xxxxId);
    } else {
      editDescription(description.id, values.content);
    }

    onDescriptionSelect({ id: null, content: '' });
    onFormSubmitted();
    Keyboard.dismiss();
  };

  render() {
    const {
      xxxxId,
      description,
      addDescription,
      editDescription,
      descriptions,
      onDescriptionSelect,
      onFormSubmitted
    } = this.props;

    return (
      <View>
        <Text style={styles.title}>Descriptions</Text>
        <XxxxDescriptionForm
          xxxxId={xxxxId}
          onSubmit={this.onSubmit(
            description,
            xxxxId,
            addDescription,
            editDescription,
            onDescriptionSelect,
            onFormSubmitted
          )}
          initialValues={description}
        />
        {descriptions.length > 0 && (
          <ScrollView style={styles.list} keyboardDismissMode="on-drag">
            <FlatList data={descriptions} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
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
