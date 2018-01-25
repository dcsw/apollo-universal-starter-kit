import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from '../../common/components/web';
import XxxxYyyyForm from './XxxxYyyyForm';

export default class XxxxYyyysView extends React.PureComponent {
  static propTypes = {
    xxxxId: PropTypes.number.isRequired,
    yyyys: PropTypes.array.isRequired,
    yyyy: PropTypes.object,
    addYyyy: PropTypes.func.isRequired,
    editYyyy: PropTypes.func.isRequired,
    deleteYyyy: PropTypes.func.isRequired,
    onYyyySelect: PropTypes.func.isRequired,
    onFormSubmitted: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  hendleEditYyyy = (id, content) => {
    const { onYyyySelect } = this.props;
    onYyyySelect({ id, content });
  };

  hendleDeleteYyyy = id => {
    const { yyyy, onYyyySelect, deleteYyyy } = this.props;

    if (yyyy.id === id) {
      onYyyySelect({ id: null, content: '' });
    }

    deleteYyyy(id);
  };

  onSubmit = () => values => {
    const { yyyy, xxxxId, addYyyy, editYyyy, onYyyySelect, onFormSubmitted } = this.props;

    if (yyyy.id === null) {
      addYyyy(values.content, xxxxId);
    } else {
      editYyyy(yyyy.id, values.content);
    }

    onYyyySelect({ id: null, content: '' });
    onFormSubmitted();
  };

  render() {
    const { xxxxId, yyyy, yyyys } = this.props;

    const columns = [
      {
        title: 'Content',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (text, record) => (
          <div style={{ width: 120 }}>
            <Button
              color="primary"
              size="sm"
              className="edit-yyyy"
              onClick={() => this.hendleEditYyyy(record.id, record.content)}
            >
              Edit
            </Button>{' '}
            <Button color="primary" size="sm" className="delete-yyyy" onClick={() => this.hendleDeleteYyyy(record.id)}>
              Delete
            </Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <h3>Yyyys</h3>
        <XxxxYyyyForm xxxxId={xxxxId} onSubmit={this.onSubmit()} initialValues={yyyy} />
        <h1 />
        <Table dataSource={yyyys} columns={columns} />
      </div>
    );
  }
}