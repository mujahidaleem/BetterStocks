'use strict';
import ENV from './../config.js';
const API_HOST = ENV.api_host;

export async function getTopScores(n, setTopUsers) {
    try {
        const scores = `${API_HOST}/api/game/highscores?n=${n}`;
        // fetch(scores)
        //     .then(res => {
        //         if (res.status === 200) {
        //             return res.json();
        //         } else {
        //             return null;
        //         }
        //     })
        //     .then(json => {
                

        //         setTopUsers(json)
        //     })
        //     .catch(error => {});

        const res = await fetch(scores)
        if (res.status !== 200) {
            return;
        }
        const resJSON = await res.json();

        console.log(resJSON)

        for (const user of resJSON) {
            const userUrl = `${API_HOST}/api/users/${user.username}`;
            const res2 = await fetch(userUrl);
            if (res.status !== 200) {
                return;
            }
            const res2JSON = await res2.json();
            user.username = res2JSON.username;
            user.displayName = res2JSON.displayName;
        }

        setTopUsers(resJSON);
    } catch (error) {
        console.log(error);
    }
}


export async function getHighscore(setBest) {

    const score = `${API_HOST}/api/game/highscore/user`;
    fetch(score)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                return null;
            }
        })
        .then(json => {
            if (json === null){
                setBest(0)
            } else {
                setBest(json.highScore)
            }
        })
        .catch(error => {});
}

export async function addScore(score) {
    console.log('trying')
    console.log(score);
    try {
        const req = new Request(
            `${API_HOST}/api/game/score`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    score: score
                })
            }
        );

        const res = await fetch(req);
        const resJSON = await res.json();
   
    } catch (error) {
        console.log(error);
    }
}

export function getInitialWords(setWords, setDifficulty) {
    const words = `${API_HOST}/api/game/words`;
    fetch(words)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return null;
            }
        })
        .then(json => {
            let words = []
            for(let i = 0; i < 9; i++){
                const index = Math.floor(Math.random() * Object.keys(json).length)
                words.push(json[index].word)
                if(i == 8){
                    setDifficulty(json[index].difficulty)
                }
            }
            setWords(words)

        })
        .catch(error => {});
}

export function cycleWords(words, setWords, setDifficulty){
    const req = `${API_HOST}/api/game/words`;
    fetch(req)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return null;
            }
        })
        .then(json => {
            const index = Math.floor(Math.random() * Object.keys(json).length)
            var tempWords = words
            tempWords.pop()
            tempWords.splice(0, 0, json[index].word)
            setWords(tempWords)
            for(let i = 0; i < Object.keys(json).length; i++){
                if(json[i].word == tempWords[tempWords.length - 1]){
                    setDifficulty(json[i].difficulty)
                }
            }
        })
        .catch(error => {});
}

export function getDifficulty(word, setDifficulty){
    const words = `${API_HOST}/api/game/words`;
    fetch(words)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                return null;
            }
        })
        .then(json => {
            for(let i = 0; i < Object.keys(json).length; i++){
                if(json[i].word == word){
                    console.log(json[i].difficulty)
                    setDifficulty(json[i].difficulty)
                }
            }
        })
        .catch(error => {});
}
