import React from 'react'

const Select = ({ field_name, options, default_value, method, data }) => {
  return (
    <>
    {options && 
      <select className='form-control' defaultValue={default_value} onChange={(e)=>{method({ ...data, [field_name]: e.target.value })}}>
      {Object.keys(options).map((item) => (
        <option key={item} value={options[item].nid}>{options[item].title}</option>
      ))}
      </select>
    }
    </>
  );
}

export default Select