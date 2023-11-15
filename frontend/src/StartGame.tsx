import React from "react";
import { useGameContext } from "./GameContext";
import { gameStatusUpdated, startGameAction } from "./actions";
import { buildShareLink, startGame } from "./api";
import { Button } from "./ui-components/Button";
import { GameTitle } from "./ui-components/GameTitle";
import { Input, InputGroup } from "./ui-components/Input";
import { Page } from "./ui-components/Page";
import { Spacer } from "./ui-components/Spacer";
import { useGameStatusPolling } from "./useGameStatusPolling";

function GameStarterForm() {
  const { state, dispatch } = useGameContext();
  const [inputs, setInputs] = React.useState<{
    title: string;
    player_name: string;
  }>({ title: "", player_name: "" });
  React.useEffect(() => {
    async function createNewGame() {
      const { game_id, game_state } = await startGame(
        { player_name: inputs.player_name, player_type: "O" },
        inputs.title
      );
      dispatch(gameStatusUpdated({ game_state, game_id }));
    }
    if (state?.starting) {
      createNewGame();
    }
  }, [state?.starting]);
  return (
    <Page>
      <GameTitle text="Le jeu du Morpion" />
      <InputGroup>
        <Input
          placeholder="Entrez votre pseudonyme"
          value={inputs.player_name}
          onChange={(e) => {
            setInputs((previousInputs) => ({
              ...previousInputs,
              player_name: e.target.value,
            }));
          }}
        ></Input>
        <Input
          placeholder="Entrez un nom pour la partie"
          value={inputs.title}
          onChange={(e) => {
            setInputs((previousInputs) => ({
              ...previousInputs,
              title: e.target.value,
            }));
          }}
        ></Input>
        <Button
          disabled={!(inputs.player_name && inputs.title)}
          onClick={() => {
            if (inputs.player_name && inputs.title) {
              dispatch(startGameAction({}));
            }
          }}
        >
          Démarrer
        </Button>
      </InputGroup>
      <Spacer />
    </Page>
  );
}

function ShareGameLinkPage({
  link,
  children,
}: React.PropsWithChildren<{ link: string }>) {
  const poller = useGameStatusPolling();
  const {
    state: { game_state },
  } = useGameContext();
  React.useEffect(() => {
    if (game_state?.player_joined) {
      if (poller.current) {
        clearInterval(poller.current);
      }
    }
  }, [game_state, poller]);

  return game_state?.player_joined ? (
    children
  ) : (
    <Page>
      <h1>Partagez ce lien avec l'autre joueur pour rejoindre la partie: </h1>
      <pre>{link}</pre>
    </Page>
  );
}

export function StartGamePage({ children }: React.PropsWithChildren) {
  const {
    state: { game_id },
  } = useGameContext();
  if (!game_id) {
    return <GameStarterForm />;
  } else
    return (
      <ShareGameLinkPage link={buildShareLink(game_id)}>
        {children}
      </ShareGameLinkPage>
    );
}
