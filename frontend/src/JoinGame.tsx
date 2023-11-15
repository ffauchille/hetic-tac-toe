import React from "react";
import { Page } from "./ui-components/Page";
import styled from "styled-components";
import { useGameContext } from "./GameContext";
import { anotherPlayerJoined, askToJoinGame } from "./actions";
import { Player } from "./types";
import { useLocation, useNavigate } from "react-router-dom";
import { joinGame } from "./api";
import { Input, InputGroup } from "./ui-components/Input";
import { GameTitle } from "./ui-components/GameTitle";
import { Spacer } from "./ui-components/Spacer";
import { Button } from "./ui-components/Button";

const Submission = styled.div`
    display: flex;
    flex-direction: column;
`

export function JoinGame() {
    const { search } = useLocation();
    const gameId = new URLSearchParams(search).get('game_id');
    const [player_joined, setPlayerJoined] = React.useState<Player>({ player_name: '', player_type: 'X' });
    const navigateTo = useNavigate();
    const { state, dispatch } = useGameContext();
    React.useEffect(() => {
        async function askToJoin() {
            if (gameId && player_joined.player_name) {
                const {game_id, game_state} = await joinGame(gameId, player_joined);
                dispatch(anotherPlayerJoined({ game_id, game_state }));
                navigateTo('/');
            }
        }
        if (state?.joining) {
            askToJoin();
        }
    }, [state?.joining])
    return (
        <>
        <Page>
            <GameTitle text={`Rejoindre la partie`} />
            <InputGroup>
                <Input placeholder="Entrer votre pseudonyme" value={player_joined.player_name} onChange={(e) => {
                    setPlayerJoined({ ...player_joined, player_name: e.currentTarget.value });
                }} />
                <Button disabled={!(gameId && player_joined.player_name)} onClick={() => { 
                    if (gameId && player_joined.player_name) {
                        dispatch(askToJoinGame({}))
                    }
                }
                }>Rejoindre</Button>
            </InputGroup>
            <Spacer />
        </Page>
        </>
    )
}