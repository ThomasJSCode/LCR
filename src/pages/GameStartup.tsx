import { ChangeEvent, useRef, useState } from 'react'
import { Tooltip } from 'react-tooltip'
import './GameStartup.css'
import { Navigate } from "react-router-dom";


const GameStartup = () => {

    const [playerCount, setPlayerCount] = useState(0)
    const [gameMode, setGameMode] = useState('')
    const [gameStartupPrompt, setGameStartupPrompt] = useState('')
    const [setupIsValid, setSetupIsValid] = useState(false)
    const [gameIsReady, setGameReadiness] = useState(false)

    const startupDialog = useRef<HTMLDialogElement>(null)


    const handlePlayerCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Regex sorcery to replace non-numerical values
        const numericalValue = e.target.value.replace(/\D/g, "")
        setPlayerCount(parseInt(numericalValue))
    }

    const validateGameSettings = () => {

        if (playerCount === 0 || playerCount < 2) {
            setGameStartupPrompt("You need at least two players to start a game.")
            setSetupIsValid(false) // In case it was valid beforehand
            return
        }

        if (gameMode === '') {
            setGameStartupPrompt("Please select a game mode.")
            setSetupIsValid(false) // In case it was valid beforehand
            return
        }

        setSetupIsValid(true)
        setGameStartupPrompt("Start game on " + gameMode + " with " + playerCount + " players?")
    }

    const handleDialog = () => {

        if (!startupDialog.current) {
            return
        }

        if (startupDialog.current.hasAttribute("open")) {
            startupDialog.current.close()
        } else {
            validateGameSettings()
            startupDialog.current.showModal()
        }
    }

    const handleRenderStartButton = () => {
        if (setupIsValid) {
            return (
                <button onClick={() => (startTheGame())}>Start</button>
            )
        }
    }

    const startTheGame = () => {
        handleDialog()
        setGameReadiness(true)
        // From here, the Navigate component will handle the rest
    }

    return (
        <>
            <div className="top-div">
                <h1>Game Startup</h1>
                <div className="description">

                    Total Players:
                    <a className="playerInputSpacing">
                        <input className="playerInput"
                            name="playerCount"
                            value={playerCount}
                            onChange={(e) => handlePlayerCountChange(e)} />
                    </a>

                </div>

                <div className="description">

                    Normal Mode: <input
                        value="Normal Mode"
                        type="radio"
                        name="game-mode"
                        defaultChecked={false}
                        onChange={(e) => setGameMode(e.target.value)} />

                    <a className="tooltip-normal-mode"> ?</a>
                    <Tooltip anchorSelect=".tooltip-normal-mode" place="right">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Conventional LCR rules with no special gimmicks.</span>
                        </div>
                    </Tooltip>
                </div>

                <div className="description">

                    High-Risk Mode: <input
                        value="High-Risk Mode"
                        type="radio"
                        name="game-mode"
                        defaultChecked={false}
                        onChange={(e) => setGameMode(e.target.value)} />

                    <a className="tooltip-risky-mode"> ?</a>
                    <Tooltip anchorSelect=".tooltip-risky-mode" place="right">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Three total rolls will always be performed, regardless of the player's chip count.</span>
                            <span>Should the player have fewer than three chips, the other roll(s) will calculated invisibly and not factor into the "play" roll.</span>
                            <span>Should the player roll three "centers", they will not only forfeit all their chips but be disqualified from the game.</span>
                            This also affects NPCs.
                        </div>
                    </Tooltip>
                </div>

                <div className="description">

                    Unfair Mode: <input
                        value="Unfair Mode"
                        type="radio"
                        name="game-mode"
                        defaultChecked={false}
                        onChange={(e) => setGameMode(e.target.value)} />

                    <a className="tooltip-unfair-mode"> ?</a>
                    <Tooltip anchorSelect=".tooltip-unfair-mode" place="right">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Rolls that require a forfeiture of chips are doubled for the main player.</span>
                            <span>If an NPC rolls and is to forfeit chips to the main player, they will reroll once for a chance to retain their chips.</span>
                            <span>If an NPC rolls a "center", they will reroll once <i>and</i> have a small chance of taking one chip from the player.</span>
                            <span>Don't expect to win.</span>
                        </div>
                    </Tooltip>
                </div>

                <div className="spacing">
                    <button onClick={() => handleDialog()}>
                        Confirm Settings
                    </button>
                </div>

                {/* Game startup dialog */}
                <dialog className="startupDialog" ref={startupDialog}> {gameStartupPrompt}
                    <div className="spacing">
                        <a>
                            {setupIsValid && handleRenderStartButton()}
                            <button onClick={() => handleDialog()}>Cancel</button>
                        </a>
                    </div>
                </dialog>
            </div>
            {gameIsReady && <Navigate to="/gameSession" state={playerCount} />}
        </>
    )
}

export default GameStartup;