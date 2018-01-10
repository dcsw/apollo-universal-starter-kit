import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';

import Xxxx from './containers/Xxxx';
import XxxxEdit from './containers/XxxxEdit';

import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [<Route exact path="/xxxxs" component={Xxxx} />, <Route exact path="/xxxx/:id" component={XxxxEdit} />],
  navItem: (
    <MenuItem key="/xxxxs">
      <NavLink to="/xxxxs" className="nav-link" activeClassName="active">
        Xxxxs
      </NavLink>
    </MenuItem>
  ),
  reducer: { xxxx: reducers }
});