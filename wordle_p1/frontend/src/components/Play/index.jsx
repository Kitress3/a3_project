import React, { useState, useEffect } from 'react';
import Keyboard from './components/Keyboard';
import useGameStore from '../../store/gameStore';
export function Play() {
    const { gameState, setGameState } = useGameStore(state => ({
        gameState: state.gameState,
        setGameState: state.setGameState
    }));

    const [username, setUsername] = useState('');
    // Initialize letter state, first try to read from localStorage, if not then use default blank table
    const [letters, setLetters] = useState(() => {
        const savedLetters = localStorage.getItem('letters');
        return savedLetters ? JSON.parse(savedLetters) : Array(6).fill(Array(5).fill({ char: ' ', score: 0 }));
    });
    const [currentRow, setCurrentRow] = useState(() => {
        return Number(localStorage.getItem('currentRow')) || 0;
    });
    const [currentCol, setCurrentCol] = useState(() => {
        return Number(localStorage.getItem('currentCol')) || 0;
    });

    // Use useEffect to monitor changes in letters, currentRow, currentCol, and update localStorage
    useEffect(() => {
        localStorage.setItem('letters', JSON.stringify(letters));
        localStorage.setItem('currentRow', currentRow.toString());
        localStorage.setItem('currentCol', currentCol.toString());
    }, [letters, currentRow, currentCol]);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch('/api/username/');
                const data = await response.json();
                setUsername(data.username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };
        fetchUsername();

        if (gameState !== 'play') {
            clearTableData()
        }
    }, [gameState]);

    const clearTableData = () => {
        const resetLetters = Array(6).fill(Array(5).fill({ char: ' ', score: 0 }));
        setLetters(resetLetters);
        setCurrentRow(0);
        setCurrentCol(0);

        localStorage.removeItem('letters');
        localStorage.removeItem('currentRow');
        localStorage.removeItem('currentCol');
    }
    const putCharacter = (char) => {
        if (gameState !== 'play') {
            return
        } else {
            if (currentRow < 6 && currentCol < 5) {
                const updatedLetters = letters.map((row, rowIndex) =>
                    rowIndex === currentRow ? row.map((cell, cellIndex) =>
                        cellIndex === currentCol ? { char, score: 0 } : cell
                    ) : row
                );
                setLetters(updatedLetters);
                setCurrentCol(currentCol + 1);
            }
        }

    };

    const delCharacter = () => {
        if (currentCol > 0) {
            const updatedLetters = letters.map((row, rowIndex) =>
                rowIndex === currentRow ? row.map((cell, cellIndex) =>
                    cellIndex === currentCol - 1 ? { char: ' ', score: 0 } : cell
                ) : row
            );
            setLetters(updatedLetters);
            setCurrentCol(currentCol - 1);
        }
    };

    const handleEnter = async () => {
        // Do not process until the current line is 5 letters full
        if (currentRow < 6 && currentCol === 5) {
            // 从letters中获取当前行的字母并拼接成单词
            const currentGuess = letters[currentRow].map(cell => cell.char).join('');

            try {

                const response = await fetch(`/api/username/${username}/guess/${currentGuess}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                if (data.error) {
                    // Processing errors (such as displaying error messages)
                    console.error(data.error);
                } else {
                    // Handle correct guesses (e.g. update game status or display score)
                    console.log(data);
                    const updatedLetters = [...letters];
                    updatedLetters[currentRow] = updatedLetters[currentRow].map((cell, index) => ({
                        char: cell.char,
                        score: data.score[index].score,
                    }));

                    // Update letters status, only the current row data changes
                    setLetters(updatedLetters);
                    if (data.state === 'lost' || data.state === 'success') {
                        // Calculate and display the sum of the scores for all letters
                        const totalScore = updatedLetters.flat().reduce((sum, cell) => sum + cell.score, 0);
                        // Game over (user wins or loses)
                        const message = data.state === 'lost' ? `Sorry, you lost! Total Score: ${totalScore}` : `Congratulations, you won!Total Score: ${totalScore}`;
                        alert(message); // 

                        setGameState('');
                        clearTableData()
                        // Here you can choose a more appropriate way to show the total score

                    }
                    else {
                        // Prepare the input for the next line
                        setCurrentRow(currentRow + 1);
                        setCurrentCol(0);
                    }

                }
            } catch (error) {
                console.error('Error making guess:', error);
            }
        } else {
            // If the current line is not filled with 5 letters, the user may need to be reminded
            console.log('Please complete the guess.');
        }
    };


    const startNewGame = async () => {
        if (!username) return; // If the username has not been obtained, return directly
        console.log(letters)
        try {
            const response = await fetch(`/api/username/${username}/newgame`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();

            if (data.status === "created") {
                setGameState('play');
                clearTableData()
                // Reset letters, currentRow, currentCol and other states as needed

            } else {
                console.error('Failed to start new game');
            }
        } catch (error) {
            console.error('Error starting new game:', error);
        }
    };
    return (
        <div className="ui_top" >
            <center>
                <table className="letterbox">
                    <tbody>
                        {letters.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className={`row${rowIndex} col${cellIndex}`}
                                        style={{
                                            backgroundColor: cell.score === 3 ? 'green' : cell.score === 2 ? 'yellow' : 'black',
                                        }}
                                    >
                                        {cell.char}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

            </center><br />
            <br />
            <div style={{ justifyContent: "center", display: "flex" }}>
                <Keyboard
                    putCharacter={putCharacter}
                    delCharacter={delCharacter}
                    handleEnter={handleEnter}
                    gameState={gameState}
                />
            </div>
            <br />
            <br />
            <center>
                {gameState !== 'play' && (
                    <button className='btn-newGame' onClick={startNewGame}>NEW GAME</button>
                )}

            </center>
        </div>
    );
}