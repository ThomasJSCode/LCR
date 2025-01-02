import Player from '../gameLogic/player'
import GameManager from '../gameLogic/gameManager'
import GameMode from '../gameLogic/gameMode'

const testManager = new GameManager(1, GameMode.Modes.NORMAL);
const testPlayer = new Player(0, testManager);

describe('Players', () => { 
    it("should roll no higher than a six", () => {
        expect(testPlayer.roll()).toBeLessThanOrEqual(6);
    }); 
});

describe('Players', () => { 
    it("should roll no lower than a zero", () => {
        expect(testPlayer.roll()).toBeGreaterThanOrEqual(0);
    }); 
});

describe('Players', () => { 
    it("should start with three rolls", () => {
        expect(testPlayer.numberOfRolls()).toEqual(3);
    }); 
});