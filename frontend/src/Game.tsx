import React from "react";
import styled from "styled-components";
import { Circle } from "./Circle";
import { Cross } from "./Cross";
import { useGameContext } from "./GameContext";
import { currentPlayerMovedAction, moveSaved } from "./actions";
import { savePlayerMove } from "./api";
import {
  CellFilling,
  Player,
  PlayerSetup,
  TicTacToBoard,
  TicTacToeCell,
} from "./types";
import { Page } from "./ui-components/Page";
import { colors } from "./ui-components/colors";
import { useGameStatusPolling } from "./useGameStatusPolling";

const TicTacToeGrid = styled.div`
  display: grid;
  grid-template-areas:
    "a b c"
    "d e f"
    "g h i";
  max-width: fit-content;
`;
const TicTacToeCellWrapper = styled.div`
  display: block;
  border: 4px solid black;
  height: 66px;
  width: 66px;
`;
const GreenText = styled.span`
  color: ${colors.green};
`;

const OrangeText = styled.span`
  color: ${colors.orange};
`;

const AppTitle = styled.h1`
  height: 64px;
  text-align: center;
`;

const Title = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
`;

function Filling({
  symbol,
  preview,
}: {
  symbol: CellFilling;
  preview: CellFilling;
}) {
  let SymbolCom = <></>;
  if (symbol === "X") {
    SymbolCom = <Cross />;
  } else if (symbol === "O") {
    SymbolCom = <Circle />;
  } else {
    if (preview !== "empty") {
      SymbolCom =
        preview === "O" ? <Circle preview={true} /> : <Cross preview={true} />;
    }
  }
  return SymbolCom;
}

function moveAllowed(cell: TicTacToeCell, board: TicTacToBoard): boolean {
  return board[cell] === null;
}

function isAllowedToPlay(
  whoami: PlayerSetup,
  currentPlayer: Player,
  ownerPlayer: Player,
  joinerPlayer: Player
) {
  return (
    (whoami === "owner" &&
      currentPlayer.player_type === ownerPlayer.player_type) ||
    (whoami === "joiner" &&
      currentPlayer.player_type === joinerPlayer?.player_type)
  );
}

function Game() {
  const {
    state: { game_state, whoami, game_id, savingMove },
    dispatch,
  } = useGameContext();
  if (
    !(
      game_id &&
      game_state &&
      game_state.player_active &&
      game_state.player_joined &&
      whoami
    )
  ) {
    return <>No board found ...</>;
  }
  const startPolling = useGameStatusPolling();
  const pollerRef = React.useRef<number>();
  const winner = game_state.result;
  const board = game_state.board;
  const currentPlayer = game_state.player_active;
  const ownerPlayer = game_state.player_owner;
  const joinerPlayer = game_state.player_joined;
  React.useEffect(() => {
    if (!pollerRef.current) {
      pollerRef.current = startPolling();
    }
    if (winner !== null) {
      pollerRef.current && clearInterval(pollerRef.current);
    }
  }, [winner]);

  const [currentCellHovered, setCurrentCellHovered] =
    React.useState<null | TicTacToeCell>();

  const PlayerColor =
    currentPlayer.player_type === "O" ? OrangeText : GreenText;
  let playerTurn = (
    <PlayerColor>
      <br />
      {`${currentPlayer.player_name} doit jouer`}
    </PlayerColor>
  );
  if (winner !== null) {
    if (winner === "draw") {
      playerTurn = <span>{`Pas de gagnants :(`}</span>;
    } else {
      const TitleColor = winner.player_type === "O" ? OrangeText : GreenText;
      playerTurn = <TitleColor>{`${winner.player_name} a gagné!`}</TitleColor>;
    }
  }
  const isMyTurn = isAllowedToPlay(
    whoami,
    currentPlayer,
    ownerPlayer,
    joinerPlayer
  );

  async function playerMove(
    game_id: string,
    cell: TicTacToeCell,
    player: Player
  ) {
    const newBoard = { ...board };
    newBoard[cell] = player.player_type;
    dispatch(currentPlayerMovedAction({ newBoardState: newBoard }));
    const { game_state: next_game_state } = await savePlayerMove(
      game_id,
      cell,
      player
    );
    dispatch(moveSaved({ game_state: next_game_state, game_id }));
  }

  return (
    <Page>
      <AppTitle>
        <GreenText>HETIC</GreenText> <OrangeText>Tac</OrangeText>{" "}
        <GreenText>Toe</GreenText>
        <br />
        {game_state.title}
      </AppTitle>
      <Title>{playerTurn}</Title>
      <TicTacToeGrid>
        {Object.entries<CellFilling>(board).map(([cell, symbol]) => (
          <TicTacToeCellWrapper
            key={cell}
            onMouseEnter={() => setCurrentCellHovered(cell as TicTacToeCell)}
            onMouseLeave={() => setCurrentCellHovered(null)}
            onClick={() => {
              if (
                !savingMove &&
                winner === null &&
                isMyTurn &&
                moveAllowed(cell as TicTacToeCell, board)
              ) {
                playerMove(game_id, cell as TicTacToeCell, currentPlayer);
              }
            }}
          >
            <Filling
              preview={
                !savingMove &&
                winner === null &&
                isMyTurn &&
                currentCellHovered === cell &&
                moveAllowed(cell, board)
                  ? currentPlayer.player_type
                  : "empty"
              }
              symbol={symbol}
            />
          </TicTacToeCellWrapper>
        ))}
      </TicTacToeGrid>
    </Page>
  );
}

export default Game;
