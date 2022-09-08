import React from "react";
import "cleave.js/dist/addons/cleave-phone.us";
import Cleave from "cleave.js/react";

export default function PhoneInput(props) {
  // const wrappedOnChange = (e) => {
  //   // This is needed to make this input compatible with
  //   // with antd forms
  //   const raw = e.target.rawValue;

  //   const fakeEvent = {
  //     target: { value: raw },
  //   };

  //   props.onChange(fakeEvent);
  // };

  return (
    <Cleave
      placeholder="415-555-1212"
      options={{
        phone: true,
        phoneRegionCode: "US",
        delimiter: "-",
      }}
      onChange={props.onChange}
      className="ant-input"
    />
  );
}
