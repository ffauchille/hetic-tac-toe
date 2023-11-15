import base64
from copy import copy
from typing import Dict, Tuple, Union

from data import (
    GameJoinInput,
    GameJoinStatusInput,
    GameMoveInput,
    GameStartInput,
    GameState,
    Player,
)


class DB(object):
    class __Data:
        games: Dict[str, GameState] = dict()

        def __init__(self):
            self.val = None

        def __str__(self):
            return f"{self}" + self.val

        def create_game(self, game_state: GameState) -> Tuple[str, GameState]:
            game_hash_decoded = f"{game_state.title}-{game_state.created_at}"
            game_hash_encoded = base64.b64encode(bytes(game_hash_decoded, "utf-8"))
            self.games.update({game_hash_encoded: game_state})
            return (game_hash_encoded, game_state)

        def save_game_state(
            self, game_id: str, game_state: GameState
        ) -> Union[GameState, None]:
            try:
                self.games[bytes(game_id, 'utf-8')] = game_state
                return game_state
            except:
                return None

        def game_status(self, game_id: str) -> Union[GameState, None]:
            game = self.games.get(bytes(game_id, 'utf-8'), None)
            return game

    instance = None

    def __new__(cls):  # __new__ always a classmethod
        if not DB.instance:
            DB.instance = DB.__Data()
        return DB.instance

    def __getattr__(self, name):
        return getattr(self.instance, name)

    def __setattr__(self, name):
        return setattr(self.instance, name)
