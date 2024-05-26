import React, { useState } from 'react';
import '../../styles/styles.css';
import { artists } from '../../constants/constants.js';

export function SearchBar({ onSearch, onOptionClick }) {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);

    const allOptions = artists;

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 1) {
            const filteredOptions = allOptions.filter(option =>
                option.toLowerCase().startsWith(value.toLowerCase())
            );
            setOptions(filteredOptions);
        } else {
            setOptions([]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
        setOptions([]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ alignContent: "center", justifyContent: "center", display: "flex", flexDirection: "column", position: "relative", width: "40%", margin: "16px auto" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder="Search..."
                        className='searchBar'
                        style={{ width: "100%" }}
                    />
                    {false && <button type="submit" style={{ border: "solid black 1px", borderRadius: "64px", padding: "8px 16px", backgroundColor: "transparent", fontSize: "20px", marginLeft: "16px" }}>Search</button>}
                </div>
                {options.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid black', borderRadius: '25px', zIndex: 1000, marginTop: '8px', overflowY: 'auto', maxHeight: '480px' }}>
                        {options.map((option, index) => (
                            <div key={index} className={`dropdown-item ${index === 0 ? 'dropdown-item-first' : ''} ${index === options.length - 1 ? 'dropdown-item-last' : ''}`} style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '20px' }} onClick={() => { setQuery(option); setOptions([]); onOptionClick(option); }}>
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </form>
    );
}

export default SearchBar;
