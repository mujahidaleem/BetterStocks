import React, {useEffect, useState} from 'react'
import './TypeGame.css'
import { uid } from 'react-uid'
import { getHighscore, getTopScores, addScore, getInitialWords, cycleWords } from '../../actions/game';


function TypeGame(){
    const state = {
        timeLimit: 30
    }

    const [topUsers, setTopUsers] = useState([])
    const [difficulty, setDifficulty] = useState(null)
    const [words, setWords] = useState([]);
    const [started, setStarted] = useState(null)
    const [ended, setEnded] = useState(false)
    const [time, setTime] = useState(state.timeLimit);
    const [score, setScores] = useState(0);
    const [best, setBest] = useState();

    useEffect(() =>{
        if(started != null){
            var timer = setInterval(() => {
                updateTime(timer)
            }, 1000)
        }
    }, [started])

    useEffect(()=>{
        getInitialWords(setWords, setDifficulty)
    }, [])

    useEffect(() =>{
        if(score > best){
            setBest(score)
        }
    }, [score])

    useEffect(()=>{
        getHighscore(setBest)
        setTime(state.timeLimit)
    }, [])

    useEffect(() => {
        if(ended == true){
            console.log(score)
            addScore(score)
        }
    }, [ended])

    function startTimer(){
        setStarted(Date.now())
    }

    function updateTime(timer){
        const timeDiff = +(Date.now()) - +started
        const timeLeft = state.timeLimit - Math.floor(timeDiff / 1000) % 60
        console.log(timeLeft)
        if(started == null){
            setTime(state.timeLimit)
        }else if(timeLeft > 0){
            setTime(timeLeft)
        }else{
            setEnded(true)
            getTopScores(5, setTopUsers)
            const game = document.getElementById("game")
            const over = document.getElementById("gameOver")
            game.style.display = "none"
            over.style.display = "block"
            clearInterval(timer)
        }

    }

    function handlePlayAgain(){
        getInitialWords(setWords, setDifficulty)
        setTime(state.timeLimit)
        setScores(0)
        setStarted(null)
        setEnded(false)
        const game = document.getElementById("game")
        const over = document.getElementById("gameOver")
        const input = document.getElementById("gameInput")
        game.style.display = "block"
        over.style.display = "none"
        input.value = ""
    }


    function handleKeyPress(e){
        if(started == null){
            startTimer()
        }
        if(e.key == 'Enter'){
            const input = e.target.value
            const word = String(words[8])
            if(input == word){
                if(difficulty == 'easy'){
                    setScores(score + 10)
                }else if(difficulty == 'medium'){
                    setScores(score + 20)
                }else if(difficulty == 'hard'){
                    setScores(score + 30)
                }
                cycleWords(words, setWords, setDifficulty)
            }
            e.target.value = ''
        }
    }

    const [leaderboard, setLeaderboard] = useState([])

    useEffect(()=>{
        getTopScores(5, setTopUsers)
    }, [])

    useEffect(() => {
        updateLeaderboard()
    }, [topUsers])

    function updateLeaderboard(){
        let count = 0
        setLeaderboard(topUsers.map((user) => {
            count += 1
            return(<>
                <div className='grid-item'>{count}</div>
                <div className='grid-item'>{user.username}</div>
                <div className='grid-item'>{user.displayName}</div>
                <div className='grid-item'>{user.highScore}</div>
            </>
            )
        }))
    }
    
    return(
        <div>
            <div id='game'>
                <div className='scores'>
                    <h1>Time Left: <span className='red'>{time}</span>s</h1>
                    <h1>Score: {score}</h1>
                    <h1>Best: {best}</h1>
                </div>
                <input id="gameInput" autoComplete="off" onKeyPress={handleKeyPress}/>
                <div className='wordBox'>
                    {Array.from(words.entries()).map(entry => <p key={ uid(entry[0] + entry[1]) } className='word'>{entry[1]}</p>)}
                </div>
                <p className='instructions'>Type any letter in the input box to start the game.<br/>
                Press Enter to submit a word.<br/>
                If you type it correctly, then you'll get points! <br/>
                Points you accumulate will be added to your wallet. <br/>
                Longer words give more points.<br/>
                 Try your best to get on the leaderboard! </p>
            </div>
            
            <div id='gameOver'>
                <h1 className='gameOverScore'>Score: {score}</h1>
                <h2 className='gameOverScore'>Congratulations! You earned {score} better coins!</h2>
                <h1 className='gameOverScore'>Your Best: {best}</h1>
                <div className='leaderBoard'>
                    <div className="grid-item-bold">Rank</div>
                    <div className="grid-item-bold">User Name</div>
                    <div className="grid-item-bold">Display Name</div>  
                    <div className="grid-item-bold">Score</div>

                    {leaderboard}
                </div>
                <button className='playAgain button10' onClick={handlePlayAgain}>Play Again</button>
            </div>
        </div>
    );
}

export default TypeGame;
