import React, { useState, useEffect } from 'react';
import { useIonViewWillEnter } from '@ionic/react';
import './Tab1.css';

const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🔔', '⭐', '🍀'];

interface Bonus {
  title: string;
  amount: string;
  link: string;
  image: string;
}

const fetchBonuses = async (
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): Promise<Bonus[]> => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('https://freebet.space/wp-json/wp/v2/posts/1729');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const post = await response.json();
    console.log('Fetched post:', post);  // Вывод данных в консоль

    // Проверка наличия frebets_json в корне JSON-ответа
    if (post.frebets_json) {
      try {
        const bonuses = JSON.parse(post.frebets_json);
        console.log('Parsed bonuses:', bonuses);  // Вывод данных в консоль
        return bonuses;
      } catch (parseError) {
        console.error('Error parsing bonuses:', parseError);
        throw new Error('Error parsing frebets_json');
      }
    } else {
      throw new Error('Missing frebets_json in the response');
    }
  } catch (error) {
    console.error('Error fetching bonuses:', error);
    if (error instanceof Error) {
      setError(`Failed to load bonuses: ${error.message}`);
    } else {
      setError('Failed to load bonuses');
    }
  } finally {
    setLoading(false);
  }
  return [];
};

type SymbolMatrix = string[][];
type WinCoordinates = { row: number; col: number }[];

const getRandomSymbols = (win = false): SymbolMatrix => {
  const generateRandomSymbols = (): SymbolMatrix =>
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null).map(() => symbols[Math.floor(Math.random() * symbols.length)]));

  const symbolsMatrix = generateRandomSymbols();

  if (win) {
    const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const winPattern = Math.floor(Math.random() * 4);

    switch (winPattern) {
      case 0: // Диагональ 1
        for (let i = 0; i < 3; i++) {
          symbolsMatrix[i][i] = winningSymbol;
        }
        break;
      case 1: // Диагональ 2
        for (let i = 0; i < 3; i++) {
          symbolsMatrix[i][2 - i] = winningSymbol;
        }
        break;
      case 2: // Ряд
        const rowIndex = Math.floor(Math.random() * 3);
        for (let i = 0; i < 3; i++) {
          symbolsMatrix[rowIndex][i] = winningSymbol;
        }
        break;
      case 3: // Колонка
        const colIndex = Math.floor(Math.random() * 3);
        for (let i = 0; i < 3; i++) {
          symbolsMatrix[i][colIndex] = winningSymbol;
        }
        break;
      default:
        break;
    }
  }

  return symbolsMatrix;
};

const checkWin = (result: SymbolMatrix): WinCoordinates | null => {
  const diagonal1 = [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }];
  const diagonal2 = [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }];

  const isWin = (coords: WinCoordinates): boolean =>
    coords.every(({ row, col }) => result[row][col] === result[coords[0].row][coords[0].col]);

  if (isWin(diagonal1)) {
    return diagonal1;
  } else if (isWin(diagonal2)) {
    return diagonal2;
  }

  for (let row = 0; row < 3; row++) {
    const rowCoords = [{ row, col: 0 }, { row, col: 1 }, { row, col: 2 }];
    if (isWin(rowCoords)) {
      return rowCoords;
    }
  }

  for (let col = 0; col < 3; col++) {
    const colCoords = [{ row: 0, col }, { row: 1, col }, { row: 2, col }];
    if (isWin(colCoords)) {
      return colCoords;
    }
  }

  return null;
};

const Tab1: React.FC = () => {
  const [result, setResult] = useState<SymbolMatrix>(getRandomSymbols());
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [winCoords, setWinCoords] = useState<WinCoordinates | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentBonus, setCurrentBonus] = useState<Bonus | null>(null);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBonuses(setLoading, setError).then(fetchedBonuses => {
      if (fetchedBonuses && fetchedBonuses.length > 0) {
        setBonuses(fetchedBonuses);
      } else {
        console.warn('No bonuses fetched or parsed.');
      }
    });
  }, []);

  useIonViewWillEnter(() => {
    const storedData = JSON.parse(localStorage.getItem('slotMachineData') || '{}');
    const today = new Date().toLocaleDateString();

    if (storedData.date !== today) {
      localStorage.setItem('slotMachineData', JSON.stringify({ date: today, attempts: 10 }));
      setAttemptsLeft(10);
    } else {
      setAttemptsLeft(storedData.attempts);
    }

    setResult(getRandomSymbols());
    setSpinning(false);
    setSpinCount(0);
    setWinCount(0);
    setWinCoords(null);
  });

  const spin = () => {
    if (attemptsLeft <= 0) {
      alert('Вы исчерпали свои 10 попыток на сегодня.');
      return;
    }

    setSpinning(true);
    const winNext = winCount < 3 && Math.random() > 0.5;

    setTimeout(() => {
      const newResult = getRandomSymbols(winNext);
      const winCoordinates = checkWin(newResult);

      setResult(newResult);
      setWinCoords(winCoordinates);
      setSpinning(false);
      setSpinCount(prevCount => prevCount + 1);
      setAttemptsLeft(prevAttempts => {
        const updatedAttempts = prevAttempts - 1;
        const today = new Date().toLocaleDateString();
        localStorage.setItem('slotMachineData', JSON.stringify({ date: today, attempts: updatedAttempts }));
        return updatedAttempts;
      });

      if (winCoordinates) {
        setWinCount(prevCount => prevCount + 1);
        const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)];
        setCurrentBonus(randomBonus);
        setShowModal(true);
      }
    }, 2000);
  };

  const closeModal = () => {
    if (window.confirm("Вы уверены, что хотите закрыть окно? Вы потеряете свой фрибет.")) {
      setShowModal(false);
    }
  };

  return (
    <div className="tab1">
      <h1>Freebet Slot Machine</h1>
      <div className="attempts">
        <span>Оставшиеся попытки: <span className="attempts-number">{attemptsLeft}</span></span>
      </div>
      {loading && <div>Loading bonuses...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="slot-machine">
        {result.map((row, rowIndex) => (
          <div key={rowIndex} className="slot-column">
            {row.map((symbol, colIndex) => {
              const isWinningSymbol =
                winCoords && winCoords.some(coord => coord.row === rowIndex && coord.col === colIndex);
              return (
                <div key={colIndex} className={`reel ${spinning ? 'spinning' : ''} ${isWinningSymbol ? 'winning' : ''}`}>
                  {symbol}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={spin} disabled={spinning} className="spin-button">
        {spinning ? 'Spinning...' : 'Spin'}
      </button>

      {showModal && currentBonus && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <span className="close-icon" onClick={closeModal}>&times;</span>
            <h2 className="modal-title">Вы выиграли!</h2>
            <div className="modal-amount">
              <span>{currentBonus.title}</span>
              <span>{currentBonus.amount}</span>
            </div>
            <div className="bonus-image">
              <img src={currentBonus.image} alt="Bonus" />
            </div>
            <a href={currentBonus.link} target="_blank" rel="noopener noreferrer" className="claim-button">
              Забрать
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tab1;
