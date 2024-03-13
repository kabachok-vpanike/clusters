import React, { useState } from 'react';

const MoreButton = ({ id, textToShow }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div id={id} className="showChordsButton">
      <button onClick={toggleVisibility}>{isVisible ? 'hide chords' : 'show chords'}</button>
      {isVisible && <div id={`textForId${id}`} style={{ display: isVisible ? 'block' : 'none', fontSize: 20 }}>{textToShow}</div>}
    </div>
  );
};

export default MoreButton;
