'use strict';

import ENV from '../config.js';
const API_HOST = ENV.api_host;

export async function getReviews(stock, setReviews) {
    try {
        const reviewUrl = `${API_HOST}/api/stocks/${stock}/reviews`;
        const res = await fetch(reviewUrl);
        if (res.status !== 200) {
            return;
        }
        const resJSON = await res.json();

        for (const review of resJSON) {
            const userUrl = `${API_HOST}/api/users/${review.author}`;
            const res2 = await fetch(userUrl);
            if (res.status !== 200) {
                return;
            }
            const res2JSON = await res2.json();
            review.displayName = res2JSON.displayName;
        }

        setReviews(resJSON.reverse());
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser(setIsBlackList){
    const sessionResponse = await fetch(`${API_HOST}/users/check-session`, {
        method: "GET",
        headers: {
            Accept: "application/json text/plain, */*",
            "Content-Type": "application/json",
        }
    });
    const sessionResponseJSON = await sessionResponse.json();

    if (!sessionResponse.ok) {
        console.log("check session response is not okay");
        console.log("---STOP users/check-sesion ---");
        return;
    }
    let currentUsername = sessionResponseJSON.username;
	let currentUserID = sessionResponseJSON.userID;

	let response = await fetch(`${API_HOST}/api/users/${currentUsername}`, {
		method: "GET",
		headers: {
			Accept: "application/json text/plain, */*",
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) console.log("user data gathering response is not okay");
	let user = await response.json()
    console.log(user)
    setIsBlackList(user.blacklist)

}


export async function makeReview(stock, review, stars, setReviews) {
    try {
        const reviewUrl = `${API_HOST}/api/stocks/${stock}/reviews`;
        const res = await fetch(reviewUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                review: review,
                stars: stars
            })
        });
        const reviews = await res.json();
        setReviews(reviews.reverse());
    } catch (error) {
        console.log(error);
    }
}
