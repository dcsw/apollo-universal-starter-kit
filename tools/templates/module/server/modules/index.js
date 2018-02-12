import DataLoader from 'dataloader';

import Xxxx from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
  schema,
  createResolversFunc: createResolvers,
  createContextFunc: () => {
    const xxxx = new Xxxx();

    return {
      Xxxx: xxxx,
      // START-TEMPLATE-0
      // loaders: {
      //   getYyyysForXxxxIds: new DataLoader(xxxx.getYyyysForXxxxIds)
      // }
      // END-TEMPLATE-0
      // TARGET-TEMPLATE-0
    };
  }
});