import React, { Component } from "react";
import { Layout, Row, Col } from "antd";
import "./app-header.layout.less";

const { Content } = Layout;

export class AppHeader extends Component {
  render() {
    const { banner, title } = this.props;

    return (
      <Layout className="layout">
        <Content>
          <div
            className="app-banner"
            style={{
              backgroundImage: `url(${banner})`,
            }}
          >
            <Row>
              <Col span={24}>
                <h1 className="app-banner__title">{title}</h1>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default AppHeader;
