import GameManager from '../gameLogic/gameManager'
import GameMode from '../gameLogic/gameMode'
import Player from '../gameLogic/player'

const testManager = new GameManager(10, GameMode.Modes.NORMAL);

describe("Game Managers", () => { 
    it("should host ten players if constructed with a '10' for the first argument", () => {
        expect(testManager.getTotalPlayers()).toEqual(10);
    }); 
});

describe("Game Managers", () => { 
    it("should be set to Normal Mode if constructed with a 'Normal Mode' string for the second argument", () => {
        expect(testManager.getGameMode()).toEqual("Normal Mode");
    }); 
});