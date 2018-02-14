/*eslint-disable react/display-name*/
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SwipeAction } from '../../common/components/native';

export default class XxxxList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    xxxxs: PropTypes.object,
    navigation: PropTypes.object,
    deleteXxxx: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  onEndReachedCalledDuringMomentum = false;

  keyExtractor = item => item.node.id;

  renderItem = ({ item: { node: { id, title } } }) => {
    const { deleteXxxx, navigation } = this.props;
    return (
      <SwipeAction
        onPress={() => navigation.navigate('XxxxEdit', { id })}
        right={{
          text: 'Delete',
          onPress: () => deleteXxxx(id)
        }}
      >
        {title}
      </SwipeAction>
    );
  };

  render() {
    const { loading, xxxxs, loadMoreRows } = this.props;

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    } else {
      return (
        <FlatList
          data={xxxxs.edges}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              if (xxxxs.pageInfo.hasNextPage) {
                this.onEndReachedCalledDuringMomentum = true;
                return loadMoreRows().then(moreXxxxs => { this.onEndReachedCalledDuringMomentum = moreXxxxs.hasNextPage; });
              }
            }
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
