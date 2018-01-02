import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { PageLayout, Table, Button } from '../../common/components/web';
import settings from '../../../../../settings';

export default class XxxxList extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    xxxxs: PropTypes.object,
    deleteXxxx: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func.isRequired
  };

  hendleDeleteXxxx = id => {
    const { deleteXxxx } = this.props;
    deleteXxxx(id);
  };

  renderLoadMore = (xxxxs, loadMoreRows) => {
    if (xxxxs.pageInfo.hasNextPage) {
      return (
        <Button id="load-more" color="primary" onClick={loadMoreRows}>
          Load more ...
        </Button>
      );
    }
  };

  renderMetaData = () => (
    <Helmet
      title={`${settings.app.name} - Xxxxs list`}
      meta={[
        {
          name: 'description',
          content: `${settings.app.name} - List of all xxxxs example page`
        }
      ]}
    />
  );

  render() {
    const { loading, xxxxs, loadMoreRows } = this.props;
    if (loading) {
      return (
        <PageLayout>
          {this.renderMetaData()}
          <div className="text-center">Loading...</div>
        </PageLayout>
      );
    } else {
      const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          render: (text, record) => (
            <Link className="xxxx-link" to={`/xxxx/${record.id}`}>
              {text}
            </Link>
          )
        },
        {
          title: 'Actions',
          key: 'actions',
          width: 50,
          render: (text, record) => (
            <Button
              color="primary"
              size="sm"
              className="delete-button"
              onClick={() => this.hendleDeleteXxxx(record.id)}
            >
              Delete
            </Button>
          )
        }
      ];
      return (
        <PageLayout>
          {this.renderMetaData()}
          <h2>Xxxxs</h2>
          <Link to="/xxxx/0">
            <Button color="primary">Add</Button>
          </Link>
          <h1 />
          <Table dataSource={xxxxs.edges.map(({ node }) => node)} columns={columns} />
          <div>
            <small>
              ({xxxxs.edges.length} / {xxxxs.totalCount})
            </small>
          </div>
          {this.renderLoadMore(xxxxs, loadMoreRows)}
        </PageLayout>
      );
    }
  }
}
