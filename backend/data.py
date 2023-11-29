from typing import Dict, Union
from pydantic import BaseModel


class Player(BaseModel):
    player_name: str
    player_type: str


class GameState(BaseModel):
    title: str
    created_at: int
    board: Dict[str, Union[str, None]]
    result: Union[Player, None, str]
    player_owner: Player
    player_joined: Union[Player, None]
    player_active: Union[Player, None]
    move_count: int


class GameStartInput(BaseModel):
    title: str
    player_owner: Player
    timestamp: int


class GameJoinStatusInput(BaseModel):
    game_id: str


class GameJoinInput(BaseModel):
    game_id: str
    player_joined: Player


class GameMoveInput(BaseModel):
    game_id: str
    player_name: str
    next_player: str
    cell: str


class PlayerMoveInput(BaseModel):
    cell: str
    currentPlayer: Player
    game_id: str
