// DM-esque object that handles player management,
// such as chip forfeitures and determining the game's victor
import { useEffect, useState } from "react";
import Dice from "./dice";
import GameMode from "./gameMode";
import { useLocation } from "react-router-dom";

import rightIcon from '../assets/right.png'
import centerIcon from '../assets/center.png'
import leftIcon from '../assets/left.png'
import safeIcon from '../assets/safe.png'

const GameManager = (props) => {

    /* --- General game state --- */

    // All the players in the current game.
    //const [players, setPlayers] = useState<Array<Player>>([]);
    let players = Array<Player>();

    // Count of players in the game. 
    // I don't like the verbosity of "#players.length".
    //const [totalPlayers, setTotalPlayers] = useState<number>(0);
    let totalPlayers: number = 0;

    // Game rules (i.e., Normal Mode; High-Risk Mode; Unfair Mode)
    const [gameMode, setGameMode] = useState<string>("Normal Mode");

    // Total amount of chips in the pot.
    const [chipPot, setChipPot] = useState<number>(0);

    // Keeps track of the current player turn; used to determine the winner.
    //const [playNumber, setPlayNumber] = useState<number>(0);
    let playNumber: number = 0;

    /* --- Player-level state --- */

    // Number of chips the current player has.
    const [currentPlayerChips, setCurrentPlayerChips] = useState<number>(0);

    const [currentRolls, setCurrentRolls] = useState<Array<number>>([])

    const [dieImage, setDieImage] = useState<Array<string>>([]);

    const [playerCurrentRoll, setPlayerCurrentRoll] = useState<string>("");

    /* --- Other values --- */

    // State (number) passed from GameStartup
    const playerCountState = useLocation();
    const playerCount: number = playerCountState.state;

    // Counter for consecutive players that are out of chips.
    // Resets if a player has chips at the end of their turn.
    let consecutiveTappedPlayers: number = 0;

    // Determines whether to continue looping the game.
    let someoneWon: boolean = false;

    useEffect(() => {
        setup(playerCount)
        console.log("setup useEffect closing!")
    }, [])

    useEffect(() => {

    }, [playerCurrentRoll])

    const setup = (playerCount: number) => {
        console.log("Setting up game with " + playerCount + " players")
        totalPlayers = playerCount;

        players = []
        for (let i = 0; i < playerCount; i++) {
            players.push(new Player(i));
        }

        //setPlayers(players);
        console.log("Game set up!");
        startGame();
    }

    const startGame = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Game started!")
        while (!someoneWon) {
            playNumber += 1;
            console.log("On play #", playNumber);
            await new Promise(resolve => setTimeout(resolve, 1500));

            for (let i = 0; i < totalPlayers; i++) {
                // Check for a winner first
                let winningPlayer = getWinningPlayer();
                if (winningPlayer != -1) {
                    declareWinner(players[winningPlayer]);
                    break;
                }
                // Players can only roll if they have chips.
                if (players[i].hasMoney()) {
                    console.log("Player " + i + " is rolling...");
                    await players[i].play();
                }
                // Check again to see if they have chips; they may have run out
                // from playing after the last check
                if (!players[i].hasMoney()) {
                    console.log("Player " + i + " is currently out of chips.")
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            playNumber = 0;
        }
    }

    const addChipToPot = () => {
        setChipPot(currentChips => currentChips + 1);
    }

    const resetTappedCounter = () => {
        consecutiveTappedPlayers = 0;
    }

    const getCurrentPlayNumber = (): number => { return playNumber };

    const getTotalPlayers = (): number => { return totalPlayers };

    const getGameMode = (): string => { return gameMode };

    const getPlayer = (index: number): Player | undefined => {

        if (index >= 0 && index <= totalPlayers - 1) {
            return players[index];
        }
        else if (index < 0) {
            return players[totalPlayers + index];
        }
        else if (index > totalPlayers - 1) {
            return players[index - totalPlayers];
        }
    }

    const getWinningPlayer = (): number => {
        const playersWithChips = players.filter(
            (player) => player.hasMoney());

        if (playersWithChips.length == 1) {
            console.log("Found a winner:", playersWithChips[0].getPlayerId())
            return playersWithChips[0].getPlayerId();
        } else {
            return -1;
        }
    }

    const declareWinner = (player: Player) => {
        someoneWon = true;
        console.log(player.getPlayerId() + " won!")
        players.forEach(player =>
            (console.log("Player " + player.getPlayerId() + " had " + player.getChips() + " chips")))
    }

    const handleDiceImage = (imageSlot: number, rollValue: number) => {
        switch (rollValue) {
            case -1:
                handleRefreshDiceImage(imageSlot, leftIcon);
                return "Left";
            case 0:
                handleRefreshDiceImage(imageSlot, safeIcon);
                return "Dot";
            case 1:
                handleRefreshDiceImage(imageSlot, rightIcon);
                return "Right";
            case 2:
                handleRefreshDiceImage(imageSlot, centerIcon);
                return "Center";
        }
    }

    const handleRefreshDiceImage = (imageSlot: number, icon: string) => {
        setDieImage(oldImages => {
            const newImages = [...oldImages];
            newImages[imageSlot] = icon
            return newImages;
        })
    }

    const resetPlayerState = () => {
        setPlayerCurrentRoll("");
        setCurrentRolls([]);
        setDieImage([]);
    }

    // Inner class that used to be a separate file; I'm putting it here in gameManager 
    // so it can interact with this component's state for rendering purposes.
    class Player {

        constructor(playerId: number) {
            this.playerId = playerId;
        }

        private playerId: number;

        private chips: number = 3;

        // Determines whether the player can participate in a turn.
        // Only applicable on High-Risk Mode (currently).
        private disqualified: boolean = false;

        // Number of centers the player has rolled in one turn.
        // Should this reach three and the game is on High-Risk Mode,
        // the player will be disqualified.
        private centersRolled = 0;

        async play() {
            if (!this.disqualified) {
                setCurrentPlayerChips(this.chips);

                const rolls = this.numberOfRolls();
                console.log("Player " + this.playerId + " has " + rolls + " rolls");
                for (let i = 0; i < rolls; i++) {
                    const numberRolled = this.roll()!
                    const face = handleDiceImage(i, numberRolled);
                    setPlayerCurrentRoll("Player " + this.playerId + " rolled " + face);
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    setCurrentRolls[i] = numberRolled;

                    this.distributeChips(numberRolled);

                    if (this.isHighRiskMode() && this.centersRolled == 3) {
                        console.log("Player " + this.playerId + " has been disqualified!");
                        this.disqualify();
                    }
                }
                resetPlayerState();
                await new Promise(resolve => setTimeout(resolve, 3000));
                this.centersRolled = 0;
            }
        }

        roll() {
            let randomNumber = Math.random() * 6

            if (randomNumber >= 0 && randomNumber < 3) {
                return Dice.Faces.DOT
            }
            else if (randomNumber >= 3 && randomNumber < 4) {
                return Dice.Faces.LEFT
            }
            else if (randomNumber >= 4 && randomNumber < 5) {
                this.centersRolled += 1
                return Dice.Faces.CENTER
            }
            else if (randomNumber >= 5 && randomNumber < 6) {
                return Dice.Faces.RIGHT
            }

        }

        // Method to determine how many rolls a player can perform in a given turn.
        numberOfRolls(): number {
            if (this.chips >= 3 || this.isHighRiskMode()) {
                return 3
            }
            else {
                return this.chips;
            }
        }

        hasMoney(): boolean { return this.chips > 0 };

        getPlayerId(): number { return this.playerId };

        getChips(): number { return this.chips };

        disqualify() { this.disqualified = true }

        forfeitChipToPlayer(otherPlayer: Player) {
            if (this.hasMoney()) {
                console.log("Player " + this.playerId + " forfeits a chip to player " + otherPlayer.getPlayerId() + ".")
                otherPlayer.chips += 1;
                this.chips -= 1;
            }
        }

        forfeitChipToPot() {
            if (this.hasMoney()) {
                console.log("Player " + this.playerId + " forfeits a chip to the pot.")
                addChipToPot();
                this.chips -= 1;
            }

        }

        // Determines the disposition of chips after a player rolls.
        // Takes the number generated by roll() to determine where the chips go.
        // Takes the gameManager instance to put money in the pot and apply 
        // special (i.e., High-Risk/Unfair mode) rules.
        distributeChips(rollNumber: number) {
            const currentPlay = getCurrentPlayNumber();
            const player: Player = getPlayer(currentPlay + rollNumber)!;

            switch (rollNumber) {
                case Dice.Faces.LEFT:
                    // A previous player now has chips, so reset this counter
                    this.forfeitChipToPlayer(player);
                    break;
                case Dice.Faces.RIGHT:
                    this.forfeitChipToPlayer(player);
                    break;
                case Dice.Faces.CENTER:
                    this.forfeitChipToPot();
                    break;
                case Dice.Faces.DOT:
                    console.log(this.playerId, " rolls zero and keeps their chips.")
            }
        }

        // Assumed by the base game logic, but I added this *just in case*
        isNormalMode(): boolean { return getGameMode() == GameMode.Modes.NORMAL };

        isHighRiskMode(): boolean { return getGameMode() == GameMode.Modes.HIGH_RISK };

        isUnfairMode(): boolean { return getGameMode() == GameMode.Modes.UNFAIR };
    }

    return (
        <div>
            {playerCurrentRoll}
            <div>
                <img src={dieImage[0]} className="leftImage" />
                <img src={dieImage[1]} className="centerImage" />
                <img src={dieImage[2]} className="rightImage" />
            </div>
        </div>
    )
}

export default GameManager