import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Xxxx from './containers/Xxxx';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/xxxx" component={Xxxx} />,
  navItem: (
    <MenuItem key="xxxx">
      <NavLink to="/xxxx" className="nav-link" activeClassName="active">
        Xxxx
      </NavLink>
    </MenuItem>
  ),
  reducer: { xxxx: reducers }
});
