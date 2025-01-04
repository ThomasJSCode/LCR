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

        console.log("Starting up game...")

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
                // If everyone else is out of chips, this player must be the winner!
                if (this.onlyOnePlayerHasChips()) {
                    this.declareWinner(this.players[i]);
                    break;
                }   

                // Players can only roll if they have chips
                if (this.players[i].hasMoney()) {
                    console.log("Player " + i + " is rolling...");
                    this.players[i].play(this);
                }
                
                // Check again to see if they have chips; they may have run out
                // from playing after the last check
                if (!this.players[i].hasMoney()) {
                    console.log("Player " + i + " is currently out of chips.")
                    // Increment if they're tapped out
                    this.consecutiveTappedPlayers += 1; 
                }
                else {
                    // Otherwise, ensure the counter is reset
                    this.consecutiveTappedPlayers = 0; 
                }
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

    private onlyOnePlayerHasChips(): boolean {
        return (this.consecutiveTappedPlayers == this.totalPlayers - 1)
    }

    private declareWinner(player: Player) {
        this.someoneWon = true;
        console.log(player.getPlayerId() + " won!")
        this.players.forEach(player => 
            (console.log("Player " + player.getPlayerId() + " had " + player.getChips() + " chips")))
    }

    // Obsolete legacy code. I'll probably nuke this outright in a later commit.
/*
    // Checks to see if there are three or fewer chips amongst all players.
    // If so, it's probably appropriate to start checking for a winner.
    // See "checkForWinner" method.
    private chipsRunningLow(): boolean {
        return this.chipPot >= (this.totalPlayers * 3) - 3;
    }

    // First check to see whether all but one player is out of chips via
    // the "tappedOutPlayers" variable; if that variable equals totalPlayers - 1,
    // then someone either to the left or right of the current player has won.
    private checkForWinner() {
        if (this.consecutiveTappedPlayers == this.totalPlayers - 1) {
            const playerToTheRight: Player = this.findPlayer(this.playNumber + 1)!;
            const playerToTheLeft: Player = this.findPlayer(this.playNumber - 1)!;
            const winner = this.determineWinner(playerToTheRight, playerToTheLeft);

            if (winner) {
                this.declareWinner(winner);
            }
        }
    }

    // Basic comparative method to figure out whether a player has won.
    private determineWinner(playerOne: Player, playerTwo: Player): Player | null {
        console.log("Comparing players: " + playerOne.getPlayerId(), playerTwo.getPlayerId())

        // Both players have chips, so we can't possibly have a winner. Bail out.
        if (playerOne.hasMoney() && playerTwo.hasMoney()) {
            return null;
        }
        else if (playerOne.hasMoney() && !playerTwo.hasMoney()) {
            return playerOne;
        }
        else if (!playerOne.hasMoney() && playerTwo.hasMoney()) {
            return playerTwo;
        }

        return null; // Something went wrong; assume no one won yet
    }
*/
}

export default GameManager