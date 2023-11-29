import React from "react";
import { GameSetupState } from "./types";
import {
  CurrentPlayerMoved,
  GameActions,
  GameJoinedActionPayload,
  GameStateAction,
  GameStatusUpdate,
} from "./actions";

export const initialGameContext: GameContextValue = {
  state: {},
  dispatch: () => {},
};

export function gameReducers(
  state: GameSetupState,
  action: GameStateAction
): GameSetupState {
  switch (action.type) {
    case GameActions.startGame:
      return {
        ...state,
        whoami: "owner",
        starting: true,
      };
    case GameActions.askToJoin:
      return {
        ...state,
        joining: true,
      };
    case GameActions.anotherPlayerJoined:
      return {
        ...state,
        ...(action.payload as GameJoinedActionPayload),
        joining: false,
        whoami: "joiner",
      };
    case GameActions.gameStatus:
      return {
        ...state,
        ...(action.payload as GameStatusUpdate),
        starting: false,
      };
    case GameActions.currentPlayerMoved:
      if (!state.game_state) return state;
      return {
        ...state,
        game_state: {
          ...state.game_state,
          board: (action.payload as CurrentPlayerMoved).newBoardState,
        },
        savingMove: true,
      };
    case GameActions.moveSaved:
      return {
        ...state,
        ...(action.payload as GameStatusUpdate),
        savingMove: false,
      };
    default:
      return state;
  }
}

export type GameContextValue = {
  state: GameSetupState;
  dispatch: (action: GameStateAction) => void;
};

export const GameContext = React.createContext<undefined | GameContextValue>(
  undefined
);

type GeoContextProviderProps = {
  children?: React.ReactNode;
  value: GameContextValue;
};

export function GameContextProvider({
  children,
  value,
}: GeoContextProviderProps) {
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextValue {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw Error("useGameContext can only be used within a GeoContextProvider");
  }
  return context;
}
