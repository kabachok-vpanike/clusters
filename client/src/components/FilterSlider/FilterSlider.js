import React, { useState } from 'react';

const FilterSlider = ({ jsonData, onChange }) => {
    const min = Math.min(...jsonData.options.map(option => option.value));
    const max = Math.max(...jsonData.options.map(option => option.value));
    const step = jsonData.step;
    const isFloat = jsonData.float;

    const [currentValue, setCurrentValue] = useState(jsonData.defaultValue);

    const handleChange = (e) => {
        const value = parseFloat(e.target.value);
        setCurrentValue(value);
        onChange(value === 0 && isFloat ? "0.0" : value);
    };

    return (
        <div className="textPlusSlider">
            <p className="sliderDesc" style={{ fontSize: 24 }}>{jsonData.name}</p>
            <input
                type="range"
                id={jsonData.id}
                className="filterSlider"
                min={min}
                max={max}
                step={step}
                value={currentValue}
                onChange={handleChange}
                style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20 }}>
                <span>{'> '}{isFloat ? currentValue.toFixed(2) : currentValue}</span>
            </div>
        </div>
    );
};

export default FilterSlider;