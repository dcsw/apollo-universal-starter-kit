import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from '../../common/components/web';
import XxxxDescriptionForm from './XxxxDescriptionForm';

export default class XxxxDescriptionsView extends React.PureComponent {
  static propTypes = {
    xxxxId: PropTypes.number.isRequired,
    descriptions: PropTypes.array.isRequired,
    description: PropTypes.object,
    addDescription: PropTypes.func.isRequired,
    editDescription: PropTypes.func.isRequired,
    deleteDescription: PropTypes.func.isRequired,
    onDescriptionSelect: PropTypes.func.isRequired,
    onFormSubmitted: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired
  };

  hendleEditDescription = (id, content) => {
    const { onDescriptionSelect } = this.props;
    onDescriptionSelect({ id, content });
  };

  hendleDeleteDescription = id => {
    const { description, onDescriptionSelect, deleteDescription } = this.props;

    if (description.id === id) {
      onDescriptionSelect({ id: null, content: '' });
    }

    deleteDescription(id);
  };

  onSubmit = () => values => {
    const { description, xxxxId, addDescription, editDescription, onDescriptionSelect, onFormSubmitted } = this.props;

    if (description.id === null) {
      addDescription(values.content, xxxxId);
    } else {
      editDescription(description.id, values.content);
    }

    onDescriptionSelect({ id: null, content: '' });
    onFormSubmitted();
  };

  render() {
    const { xxxxId, description, descriptions } = this.props;

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
              className="edit-description"
              onClick={() => this.hendleEditDescription(record.id, record.content)}
            >
              Edit
            </Button>{' '}
            <Button
              color="primary"
              size="sm"
              className="delete-description"
              onClick={() => this.hendleDeleteDescription(record.id)}
            >
              Delete
            </Button>
          </div>
        )
      }
    ];

    return (
      <div>
        <h3>Descriptions</h3>
        <XxxxDescriptionForm xxxxId={xxxxId} onSubmit={this.onSubmit()} initialValues={description} />
        <h1 />
        <Table dataSource={descriptions} columns={columns} />
      </div>
    );
  }
}
