import React from "react";
import { Input, Form, Button, Col, Row } from "antd";
import { setTableDescription } from "../store/slices/cart";
import { connect } from "react-redux";

const TableDescription = ({
  setTableDescription,
  qr_order_title
}) => {
  const onFinish = values => setTableDescription(values.qr_order_title);
  
  return (
    <Form
      className="table-desc-form"
      initialValues={{ qr_order_title }}
      labelCol={{
        span: 24,
      }}
      wrapperCol={{
        span: 24,
      }}
      onFinish={onFinish}
      hideRequiredMark
      scrollToFirstError
    >
      <Form.Item
        name="qr_order_title"
        label="What is your table number or describe yourself?"

        rules={[
          {
            required: true,
            message:
              "Please enter your table number or a short description of yourself.",
          },
        ]}
      >
        <Row>
          <Col span={16}>
            <Input placeholder="16 or Red shirt with yellow pants" defaultValue={qr_order_title}/>
          </Col>
          <Col span={6} offset={1}>
            <Button
              type="primary"
              htmlType="submit"
              style={{height: '100%'}}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};
const mapStateToProps = ({cart: {qr_order_title}}) => ({
  qr_order_title
});
const mapDispatchToProps = (dispatch) => ({
  setTableDescription: (qr_order_title) => dispatch(setTableDescription(qr_order_title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableDescription);
