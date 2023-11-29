import { useGameContext } from "./GameContext";
import { gameStatusUpdated } from "./actions";
import { getGameStatus } from "./api";

export function useGameStatusPolling() {
  const {
    state: { game_id },
    dispatch,
  } = useGameContext();
  function startPolling() {
    let pollerRef;
    async function pollPlayerJoined() {
      if (game_id) {
        const { game_state } = await getGameStatus(game_id);
        dispatch(gameStatusUpdated({ game_state, game_id }));
      }
    }
    if (game_id) {
      pollerRef = setInterval(pollPlayerJoined, 1000);
      pollPlayerJoined();
    }
    return pollerRef;
  }
  return startPolling;
}
