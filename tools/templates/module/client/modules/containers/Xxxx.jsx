/*eslint-disable no-unused-vars*/
import React from 'react';
import { graphql, compose } from 'react-apollo';

import XxxxView from '../components/XxxxView';

class Xxxx extends React.Component {
  render() {
    return <XxxxView {...this.props} />;
  }
}

const XxxxWithApollo = compose()(Xxxx);

export default XxxxWithApollo;
