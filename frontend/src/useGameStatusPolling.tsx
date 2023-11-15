import React from "react";
import { useGameContext } from "./GameContext";
import { getGameStatus } from "./api";
import { gameStatusUpdated } from "./actions";

export function useGameStatusPolling() {
    const { state: { game_id, game_state}, dispatch } = useGameContext();
    const timerRef = React.useRef<number>();
    React.useEffect(() => {
        async function pollPlayerJoined() {
            if (game_id) {
                const { game_state } = await getGameStatus(game_id);
                dispatch(gameStatusUpdated({ game_state, game_id }));
            }
        }
        if (game_id && !timerRef.current) {
            timerRef.current = setInterval(pollPlayerJoined, 1000);
            pollPlayerJoined();
        }
    }, [game_id, game_state, timerRef.current])
    return timerRef;
}