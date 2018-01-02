import React from 'react';
import Helmet from 'react-helmet';
import { PageLayout } from '../../common/components/web';

const renderMetaData = () => (
  <Helmet
    title="Xxxx"
    meta={[
      {
        name: 'description',
        content: 'Xxxx page'
      }
    ]}
  />
);

const XxxxView = () => {
  return (
    <PageLayout>
      {renderMetaData()}
      <div className="text-center mt-4 mb-4">
        <p>Hello Xxxx!</p>
      </div>
    </PageLayout>
  );
};

export default XxxxView;
