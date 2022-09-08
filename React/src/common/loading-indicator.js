import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingIndicator = () => {
  const indicator = <LoadingOutlined style={{ fontSize: 72 }} spin />;
  return <Spin indicator={indicator} />;
};

export default LoadingIndicator;
