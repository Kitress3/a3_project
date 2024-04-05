import React from 'react';

function Keyboard({ putCharacter, delCharacter, handleEnter }) {
  const handleKeyClick = (key) => {
    if (key === 'DEL') {
      delCharacter();
    } else if (key === 'ENTER') {
      handleEnter();
    } else {
      putCharacter(key);
    }
  };

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['DEL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
  ];

  return (
   <center>
      {rows.map((row, rowIndex) => (
        <table className="keyboardrow" key={rowIndex}>
          <tbody>
            <tr>
              {row.map((key) => (
                <td key={key} onClick={() => handleKeyClick(key)}>{key}</td>
              ))}
            </tr>
          </tbody>
        </table>
      ))}
   </center>
  );
}

export default Keyboard;
