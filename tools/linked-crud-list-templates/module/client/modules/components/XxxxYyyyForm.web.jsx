import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Form, RenderField, Row, Col, Label, Button } from '../../common/components/web';
import { required, minLength } from '../../../../common/validation';

const XxxxYyyyForm = ({ handleSubmit, submitting, initialValues, onSubmit }) => {
  let operation = 'Add';
  if (initialValues.id !== null) {
    operation = 'Edit';
  }

  return (
    <Form name="yyyy" onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col xs={2}>
          <Label>{operation} yyyy</Label>
        </Col>
        <Col xs={8}>
          <Field name="content" component={RenderField} type="text" validate={[required, minLength(1)]} />
        </Col>
        <Col xs={2}>
          <Button color="primary" type="submit" className="float-right" disabled={submitting}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

XxxxYyyyForm.propTypes = {
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  submitting: PropTypes.bool
};

export default reduxForm({
  form: 'yyyy',
  enableReinitialize: true
})(XxxxYyyyForm);
