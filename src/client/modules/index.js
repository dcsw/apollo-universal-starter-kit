import cat from './cat';
import dog from './dog';
import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './subscription';
import contact from './contact';
import pageNotFound from './pageNotFound';
import './favicon';

import Feature from './connector';

export default new Feature(cat, dog, counter, post, upload, user, subscription, contact, pageNotFound);
