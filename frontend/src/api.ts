import { API_URL } from "./constants";
import { GameErrorResponse, GameEngineResponse, Player, TicTacToBoard, TicTacToeCell } from "./types";

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function post<Payload>(url: string, data: Payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
}


function responseIsSuccessfull(response: any): response is GameEngineResponse {
    return response?.game_id && response?.game_state;
}
function responseIsError(response: any): response is GameErrorResponse {
    return response?.error;
}

export const GameEngineErrorName = 'GameEngineError';
export class GameEngineError extends Error {
    constructor(message: string) {
        super(message);
        this.name = GameEngineErrorName;
    }
}

function raiseError(response: any): never {
    if (responseIsError(response)) {
        throw new GameEngineError(response.error);
    }
    throw new Error("unhandled error from api");
}

export async function joinGame(gameId: string, player: Player): Promise<GameEngineResponse> {
    const response = await post(`${API_URL}/v1/game/join`, { game_id: gameId, player_joined: player });
    if (responseIsSuccessfull(response)) {
        return response;
    } else raiseError(response)
    
}
export async function getGameStatus(game_id: string): Promise<GameEngineResponse> {
    const response = await post(`${API_URL}/v1/game/status`, {game_id});
    if (responseIsSuccessfull(response)) {
        return response;
    } else raiseError(response)
}

export async function startGame(player_owner: Player, title: string): Promise<GameEngineResponse> {
    const response = await post(`${API_URL}/v1/game/start`, { player_owner, title, timestamp: Date.now()})
    if (responseIsSuccessfull(response)) {
        return response;
    }  else raiseError(response)
}

export async function savePlayerMove(game_id: string, cell: TicTacToeCell, currentPlayer: Player): Promise<GameEngineResponse> {
    const response = await post(`${API_URL}/v1/game/move`, { cell, game_id, currentPlayer });
    if (responseIsSuccessfull(response)) {
        return response;
    } else raiseError(response)
}


export function buildShareLink(game_id: string) {
    return `${window.origin}/join?game_id=${game_id}`;
}