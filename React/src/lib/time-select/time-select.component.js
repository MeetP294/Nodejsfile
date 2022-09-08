/* --------------------------------- IMPORTS -------------------------------- */

import React from "react";
import moment from "moment";
import { Select } from "antd";
import "./time-select.component.less";

const { Option } = Select;

function TimeSelect(props) {
  const { timeSlots } = props;

  const renderSlot = (slot) => {
    let [start, end] = slot;
    return (
      moment.unix(start).format("h:mm A") +
      " - " +
      moment.unix(end).format("h:mm A")
    );
  };

  const selectProps = {
    onChange: (val) => {
      // console.log(val);
      props.onChange(val);
    },
    disabled: props.disabled,
    value: props.value,
  };

  if (!props.disabled) {
    selectProps.placeholder = renderSlot(timeSlots[0]);
  }

  return (
    <Select {...selectProps}>
      {timeSlots &&
        timeSlots.map((slot) => (
          <Option key={slot[1]} value={slot[1]} title={renderSlot(slot)}>
            {renderSlot(slot)}
          </Option>
        ))}
    </Select>
  );
}

export default TimeSelect;
