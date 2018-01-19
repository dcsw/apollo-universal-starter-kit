import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import { createTabBarIconWrapper } from '../common/components/native';

import Xxxx from './containers/Xxxx';
import XxxxEdit from './containers/XxxxEdit';

import reducers from './reducers';

import Feature from '../connector';

class XxxxListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Xxxx list',
    headerRight: <Button title="Add" onPress={() => navigation.navigate('XxxxEdit', { id: 0 })} />
  });
  render() {
    return <Xxxx navigation={this.props.navigation} />;
  }
}

XxxxListScreen.propTypes = {
  navigation: PropTypes.object
};

class XxxxEditScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.id === 0 ? 'Create' : 'Edit'} xxxx`
  });
  render() {
    return <XxxxEdit navigation={this.props.navigation} />;
  }
}

XxxxEditScreen.propTypes = {
  navigation: PropTypes.object
};

const XxxxNavigator = StackNavigator({
  XxxxList: { screen: XxxxListScreen },
  XxxxEdit: { screen: XxxxEditScreen }
});

export default new Feature({
  tabItem: {
    Xxxx: {
      screen: XxxxNavigator,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-book-outline',
          size: 30
        })
      }
    }
  },
  reducer: { xxxx: reducers }
});
