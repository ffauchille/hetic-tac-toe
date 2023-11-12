import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { Cross } from './Cross'
import { Circle } from './Circle'

const Global = createGlobalStyle`
  body {
    margin: 0;
  }
`

const TicTacToeGrid = styled.div`
  display: grid;
  grid-template-areas: 
            "a b c"
            "d e f"
            "g h i";
  max-width: fit-content;
`
const TicTacToeCell = styled.div`
  display: block;
  border: 4px solid black;
  height: 66px;
  width: 66px;
`
const GreenText = styled.span`
  color: #26e8a0;
`

const OrangeText = styled.span`
  color: #fd7e14;
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100dvw;
  position: relative;
  background-color: #343a40;
  color: white;
  align-items: center;
`

const AppTitle = styled.h1`
  height: 64px;
`

const Title = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
`

type Player = 'Player X' | 'Player O'

type TicTacToeSymbol = 'X' | 'O';
type CellFilling = TicTacToeSymbol | 'empty';

type TicTacToeCell =
  | '1-1'
  | '1-2'
  | '1-3'
  | '2-1'
  | '2-2'
  | '2-3'
  | '3-1'
  | '3-2'
  | '3-3'

type TicTacToBoard = {
  [c in TicTacToeCell]: CellFilling
}
function createEmptyBoard(): TicTacToBoard {
  const cells: TicTacToeCell[] = ['1-1',
    '1-2',
    '1-3',
    '2-1',
    '2-2',
    '2-3',
    '3-1',
    '3-2',
    '3-3']
  return cells.reduce((acc: TicTacToBoard, cell: TicTacToeCell) => ({ ...acc, [cell]: 'empty' }), {} as TicTacToBoard);

}

const WinningMoves = [
  ['1-1', '1-2', '1-3'],
  ['1-1', '2-1', '3-1'],
  ['1-1', '2-2', '3-3'],
  ['1-3', '2-2', '3-1'],
  ['1-3', '2-3', '3-3'],
  ['2-1', '2-2', '2-3'],
  ['3-1', '3-2', '3-3'],
  ['1-2', '2-2', '3-2'],
]

function Filling({ symbol, preview }: { symbol: CellFilling, preview: CellFilling }) {
  let SymbolCom = <></>;
  if (symbol === 'X') {
    SymbolCom = <Cross />;
  } else if (symbol === 'O') {
    SymbolCom = <Circle />;
  } else {
    if (preview !== 'empty') {
      SymbolCom = preview === 'O' ? <Circle preview={true} /> : <Cross preview={true} />
    }
  }
  return SymbolCom;
}

function getSymbol(player: Player): TicTacToeSymbol {
  return player.endsWith('X') ? 'X' : 'O';
}

function move(player: Player, cell: TicTacToeCell, board: TicTacToBoard): TicTacToBoard {
  const newBoard = { ...board };
  newBoard[cell] = getSymbol(player);
  return newBoard;
}

function isWinner(player: Player, board: TicTacToBoard): boolean {
  const playerSymbol = getSymbol(player);
  const playerMoves = Object.entries(board).filter(([_, move]) => move === playerSymbol).map(([cell, _]) => cell);
  const hasWon: boolean = WinningMoves.filter((winningArray) => winningArray.every(cell => playerMoves.includes(cell))).length > 0
  return hasWon;
}

function moveAllowed(cell: TicTacToeCell, board: TicTacToBoard): boolean {
  return board[cell] === 'empty'
}

function startingPlayer(): Player {
  return Date.now() % 2 === 0 ? 'Player X' : 'Player O';
}

function App() {
  const initialBoard: TicTacToBoard = createEmptyBoard();
  const [board, setBoard] = React.useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = React.useState(startingPlayer());
  const [currentCellHovered, setCurrentCellHovered] = React.useState<null | TicTacToeCell>();
  const [winner, setWinner] = React.useState<Player | null | 'no-winner'>(null);
  React.useEffect(() => {
    if (isWinner(currentPlayer, board)) {
      setWinner(currentPlayer);
    } else if (Object.values(board).every(v => v !== 'empty')) {
      setWinner('no-winner');
    }
    setCurrentPlayer(currentPlayer === 'Player O' ? 'Player X' : 'Player O')
  }, [board])

  const PlayerColor = currentPlayer === 'Player O' ? OrangeText : GreenText;
  let title = <PlayerColor>{`${currentPlayer} doit jouer`}</PlayerColor>;
  if (winner !== null) {
    if (winner === 'no-winner') {
      title = <span>{`Pas de gagnants :(`}</span>
    } else {
      const TitleColor = winner === 'Player O' ? OrangeText : GreenText;
      title = <TitleColor>{`${winner} a gagné!`}</TitleColor>
    }
  }
  return (
    <>
      <Global />
      <Page>
        <AppTitle><GreenText>HETIC</GreenText> <OrangeText>Tac</OrangeText> <GreenText>Toe</GreenText></AppTitle>
        <Title>{title}</Title>
        <TicTacToeGrid>
          {Object.entries<CellFilling>(board).map(([cell, symbol]) => (
            <TicTacToeCell
              key={cell}
              onMouseEnter={() => setCurrentCellHovered(cell as TicTacToeCell)}
              onMouseLeave={() => setCurrentCellHovered(null)}
              onClick={() => {
                if (winner === null && moveAllowed(cell as TicTacToeCell, board)) {
                  setBoard(move(currentPlayer, cell as TicTacToeCell, board))
                }
              }}>
              <Filling preview={winner === null && currentCellHovered === cell && moveAllowed(cell, board) ? getSymbol(currentPlayer) : 'empty'} symbol={symbol} />
            </TicTacToeCell>
          ))}
        </TicTacToeGrid>
      </Page>
    </>
  )
}

export default App
