import React from "react";
import { createGlobalStyle } from "styled-components";
import { StartGamePage } from "./StartGame";
import {
  GameContextProvider,
  gameReducers,
  initialGameContext,
} from "./GameContext";
import Game from "./Game";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { JoinGame } from "./JoinGame";

const Global = createGlobalStyle`
  body {
    margin: 0;
  }
`;
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/join",
    element: <JoinGame />,
  },
]);

function App() {
  return (
    <StartGamePage>
      <Game />
    </StartGamePage>
  );
}

export default function RoutedApp() {
  const [state, dispatch] = React.useReducer(
    gameReducers,
    initialGameContext.state
  );

  return (
    <GameContextProvider value={{ state, dispatch }}>
      <Global />
      <RouterProvider router={router} />
    </GameContextProvider>
  );
}
