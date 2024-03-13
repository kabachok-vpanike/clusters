import React from 'react';

const FilterSelect = ({ jsonData, onChange }) => {
  return (
    <div className="textPlusSelect">
      <p className="selectDesc" style={{ fontSize: 24 }}>{jsonData.name}</p>
      <select style={{ fontSize: 20, paddingLeft: 4, paddingRight: 4 }}
        id={jsonData.id}
        className="filter"
        defaultValue={jsonData.defaultValue}
        onChange={onChange}
      >
        {jsonData.options.map(option => (
          <option key={option.value} value={option.value}>{option.text} </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
