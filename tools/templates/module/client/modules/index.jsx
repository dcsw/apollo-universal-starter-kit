import { Ionicons } from '@expo/vector-icons';
import { createTabBarIconWrapper } from '../common/components/native';
import Xxxx from './containers/Xxxx';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  tabItem: {
    Xxxx: {
      screen: Xxxx,
      navigationOptions: {
        tabBarIcon: createTabBarIconWrapper(Ionicons, {
          name: 'ios-browsers-outline',
          size: 30
        })
      }
    }
  },
  reducer: { xxxx: reducers }
});
