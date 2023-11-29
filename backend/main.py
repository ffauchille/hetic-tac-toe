from typing import Union

from fastapi import FastAPI
from data import GameJoinInput, GameJoinStatusInput, GameStartInput, PlayerMoveInput
from fastapi.middleware.cors import CORSMiddleware
from game_engine import create_new_game, move, player_joined_game

from memory_db import DB

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/v1/game/start")
def create_game(game_start_input: GameStartInput):
    db = DB()
    new_game = create_new_game(game_start_input)
    (game_id, game_state) = db.create_game(new_game)
    return {"game_id": game_id, "game_state": game_state}


@app.post("/v1/game/join")
def create_join_game(game_join_input: GameJoinInput):
    db = DB()
    game_state = db.game_status(game_join_input.game_id)
    if game_state is None:
        return {"error": "game not found"}
    new_game_state = player_joined_game(game_state, game_join_input)
    saved_game_state = db.save_game_state(game_join_input.game_id, new_game_state)
    if saved_game_state is None:
        return {"error": "game not found"}
    return {"game_id": game_join_input.game_id, "game_state": saved_game_state}


@app.post("/v1/game/status")
def read_game_status(game_join_status_input: GameJoinStatusInput):
    db = DB()
    game_status = db.game_status(game_join_status_input.game_id)
    if game_status is None:
        return {"error": "game not found"}
    return {"game_id": game_join_status_input.game_id, "game_state": game_status}


@app.post("/v1/game/move")
def create_game_move(player_move_input: PlayerMoveInput):
    db = DB()
    game_state = db.game_status(player_move_input.game_id)
    if game_state is None:
        return {"error": "game not found"}
    try:
        new_game_state = move(game_state, player_move_input)
    except Exception as e:
        return {"error": str(e)}
    new_game_state = db.save_game_state(player_move_input.game_id, new_game_state)
    return {"game_state": new_game_state, "game_id": player_move_input.game_id}
