import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../common/components/web';
import XxxxForm from './XxxxForm';
// START-LINKED-MODULE-TEMPLATE-0
// import XxxxYyyys from '../containers/XxxxYyyys';
// END-LINKED-MODULE-TEMPLATE-0
// TARGET-LINKED-MODULE-TEMPLATE-0
import settings from '../../../../../settings';

const onSubmit = (xxxx, addXxxx, editXxxx) => values => {
  if (xxxx) {
    editXxxx(xxxx.id, values.title, values.content);
  } else {
    addXxxx(values.title, values.content);
  }
};

const XxxxEditView = ({ loading, xxxx, match, location, subscribeToMore, addXxxx, editXxxx }) => {
  let xxxxObj = xxxx;

  // if new xxxx was just added read it from router
  if (!xxxxObj && location.state) {
    xxxxObj = location.state.xxxx;
  }

  const renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Edit xxxx`}
      meta={[
        {
          name: 'descripition',
          content: 'Edit xxxx example page'
        }
      ]}
    />
  );

  if (loading && !xxxxObj) {
    return (
      <PageLayout>
        {renderMetaData()}
        <div className="text-center">Loading...</div>
      </PageLayout>
    );
  } else {
    return (
      <PageLayout>
        {renderMetaData()}
        <Link id="back-button" to="/xxxxs">
          Back
        </Link>
        <h2>{xxxx ? 'Edit' : 'Create'} Xxxx</h2>
        <XxxxForm onSubmit={onSubmit(xxxxObj, addXxxx, editXxxx)} initialValues={xxxxObj} />
        <br />
        {
          // START-LINKED-MODULE-TEMPLATE-1
          // xxxxObj && (
          //   <XxxxYyyys xxxxId={Number(match.params.id)} yyyys={xxxxObj.yyyys} subscribeToMore={subscribeToMore} />
          // )
          // END-LINKED-MODULE-TEMPLATE-1
          // TARGET-LINKED-MODULE-TEMPLATE-1
        }
      </PageLayout>
    );
  }
};

XxxxEditView.propTypes = {
  loading: PropTypes.bool.isRequired,
  xxxx: PropTypes.object,
  addXxxx: PropTypes.func.isRequired,
  editXxxx: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  subscribeToMore: PropTypes.func.isRequired
};

export default XxxxEditView;
