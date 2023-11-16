import type { GameState, TicTacToBoard } from "./types";

export const enum GameActions {
  startGame = "START_GAME",
  gameStatus = "GAME_STATUS",
  anotherPlayerJoined = "ANOTHER_PLAYER_JOINED",
  askToJoin = "ASK_TO_JOIN_GAME",
  gameStarted = "GAME_STARTED",
  currentPlayerMoved = "CURRENT_PLAYER_MOVED",
  moveSaved = "MOVE_SAVED",
}

export type StartGamePayload = {};

export type GameJoinedActionPayload = {
  game_id: string;
  game_state: GameState;
};

export type AskToJoinGamePayload = {};

export type GameStatusUpdate = {
  game_id: string;
  game_state: GameState;
};

export type CurrentPlayerMoved = {
  newBoardState: TicTacToBoard;
};

export function startGameAction(
  payload: StartGamePayload
): GameStateAction & { payload: StartGamePayload } {
  return { type: GameActions.startGame, payload };
}

export function gameStartedAction(
  payload: StartGamePayload
): GameStateAction & { payload: StartGamePayload } {
  return { type: GameActions.gameStarted, payload };
}

export function askToJoinGame(
  payload: AskToJoinGamePayload
): GameStateAction & { payload: AskToJoinGamePayload } {
  return { type: GameActions.askToJoin, payload };
}

export function gameStatusUpdated(
  payload: GameStatusUpdate
): GameStateAction & { payload: GameStatusUpdate } {
  return { type: GameActions.gameStatus, payload };
}

export function moveSaved(
  payload: GameStatusUpdate
): GameStateAction & { payload: GameStatusUpdate } {
  return { type: GameActions.moveSaved, payload };
}

export function anotherPlayerJoined(
  payload: GameStatusUpdate
): GameStateAction & { payload: GameStatusUpdate } {
  return { type: GameActions.anotherPlayerJoined, payload };
}

export function currentPlayerMovedAction(
  payload: CurrentPlayerMoved
): GameStateAction & { payload: CurrentPlayerMoved } {
  return { type: GameActions.currentPlayerMoved, payload };
}

export type GameStateAction = {
  type: GameActions;
  payload: AskToJoinGamePayload | GameJoinedActionPayload | StartGamePayload;
};
