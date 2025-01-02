// DM-esque object that handles player management, 
// such as chip forfeitures and determining the game's victor

import Player from "./player";

class GameManager {

    // All the players in the current game.
    private players: Array<Player>;

    // Count of players in the game. 
    // I don't like the verbosity of "this.#players.length".
    private totalPlayers: number = 0;

    // Game rules (i.e., Normal Mode; High-Risk Mode; Unfair Mode)
    private gameMode: string;

    // Total amount of chips in the pot.
    private chipPot: number = 0;

    // Keeps track of the current player turn; used to determine the winner.
    private playNumber: number = 0; 

    // Counter for consecutive players that are out of chips.
    // Resets if a player has chips at the end of their turn.
    private consecutiveTappedPlayers: number = 0;

    // Determines whether to continue looping the game.
    private someoneWon: boolean = false;

    constructor(numberOfPlayers: number, gameMode: string) {
        if (numberOfPlayers <= 0) {
            // In case the preceding validation in GameStartup fails somehow
            throw new Error("InvalidPlayerCount");
        }

        this.players = new Array<Player>;
        this.gameMode = gameMode;

        for (let i = 0; i < numberOfPlayers; i++) {
            this.players.push(new Player(i, this));
            this.totalPlayers += 1;
        }
    }

    startGame() {

        while (!this.someoneWon) {
            for (let i = 0; i < this.totalPlayers; i++) {
                this.players[i].play(this);
            }

            if (this.chipsRunningLow()) {
                this.checkForWinner();
            }
        }
    }

    addChipToPot() {
        this.chipPot += 1;
    }

    findPlayer(index: number): Player | undefined {

        if (index >= 0 && index <= this.totalPlayers - 1 ) {
            return this.players[index];
        } 
        else if (index < 0) {
            // First player passes to the left
            return this.players[this.totalPlayers - 1];
        }
        else if (index > this.totalPlayers - 1) {
            // Last player passes to the right
            return this.players[0];
        }
    }

    getCurrentPlayNumber(): number {return this.playNumber}

    getTotalPlayers(): number {return this.totalPlayers}

    getGameMode(): string {return this.gameMode}

    // Checks to see if there are three or fewer chips amongst all players.
    // If so, it's probably appropriate to start checking for a winner.
    // See "checkForWinner" method.
    private chipsRunningLow() {
        return this.chipPot >= (this.totalPlayers * 3) - 3;
    }

    // First check to see whether all but one player is out of chips via
    // the "tappedOutPlayers" variable; if that variable equals totalPlayers - 1,
    // then someone either to the left or right of the current player has won.
    private checkForWinner() {
        if (this.consecutiveTappedPlayers = this.totalPlayers - 1) {
            const winner: Player = this.findPlayer(this.playNumber + 1)!;
            this.declareVictor();
        }
    }

    private declareVictor() {
        this.someoneWon = true;
    }
}

export default GameManager