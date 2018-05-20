import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';

import Xxxx from './containers/Xxxx';
import XxxxEdit from './containers/XxxxEdit';

import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [<Route exact path="/xxxxs" component={Xxxx} />, <Route exact path="/xxxx/:id" component={XxxxEdit} />],
  // START-ADD-MENU-ITEM-TEMPLATE-1
  // navItem: (
  //   <MenuItem key="/xxxxs">
  //     <NavLink to="/xxxxs" className="nav-link" activeClassName="active">
  //       Xxxxs
  //     </NavLink>
  //   </MenuItem>
  // ),
  // END-ADD-MENU-ITEM-TEMPLATE-1
  // TARGET-ADD-MENU-ITEM-TEMPLATE-1
  reducer: { xxxx: reducers }
});
