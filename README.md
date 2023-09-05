
## BetterStocks™

*Team 26*

aleemmuj - Mujahid Muhammad Aleem  
shenxuez - Xuezhou Shen  
liraym11 - Raymond Lin-Feng Li  
cokisler - Can Cokisler

## Description

Welcome to BetterStocks™: A social paper trading platform that tracks real time stocks, crypto, and other assets (built with React Native, Node.js & Mongo DB)! The website utilizes the Yahoo Finance API to get its information about stocks. On the website, users can buy and sell assets with our own Better Coins™. Users can rate stocks out of 5 stars and write reviews too. If users find themselves with low capital, they can play our stock typeracer game to add more Better Coins™ to their wallet. In this game module, top user high scores will be featured on a leaderboard. With our app, we hope to provide a unique platform that empowers users to make the right trades. 

Link: https://mighty-citadel-04530.herokuapp.com/

## Installation

*In the root folder*

1.  Install NPM packages
   
    ```
    npm install
    ```

2.  Create Build

    ```
    npm run build-run
    ```

3.  Start the local web server and database

    ```
    mongod --dbpath mongo-data
    ```

### External Dependencies

*   React
*   React Router
*   Chart.js / react-chart-js-2
*   React Icons
*   Material UI
*   Express

## Usage

### User:

Log in with the default username and password of `user` and `user`. Otherwise, you can create your own account!

+ **Profile:** Click on the profile button in the navbar to view the user's profile page, which includes their profile picture, username (which is an unique identifier), display name, email, phone number and biography. Users can edit their display name, email, and biography. Users can logout from the profile page by clickling the logout button.
+ **Stocks:**  Click on the Stocks button to view a list of stocks. Users can see the symbol 24Hr price history graph, last know price and the 7 day average review rating. Users can sort by stock symbol in this table. Users from this page can also search for a stock via the search bar by typing the symbol of a stock. When clicking on a stock, that will navigate the user to the page of the stock, where they can view additional information about it.
+ **Stocks (single stock)** In the Stock page, it shows the stock's critical summary data. Users can choose to view the trend for time periods such as 1 day, 1 week, 1 month, 3 months, 6 months, 1 year. There are also user comments and ratings below the stock summary. Users can also write a comment. However, if a user is in the blacklist, the comment feature will be blocked from him.
+ **Paper Trading**: In the Paper Trading page, a simulation of the stock market can be run. Each user initially has 1000 better coins/capital. Users can earn more capitals by buy and sell stocks/assets. To the left of the screen, it has information about the user's portfolio. Users can type in a stock symbol to search for a stock. The list of holdings appears beneath the portfolio summary and the buy/sell buttons. A limitation is that the API has a limit of calls for the free tier - so we had to limit the pool of stocks available to trade on our platform.
+ **TypeGame** In the type game page, users can play a simple typeracer game to increase the value of their wallets. Typing the following stock related words conrrectly will net additional points for the users, which is converted into Better Coins™. To start the game, users can type anything in the input box and the timer will start counting. To submit a word, type 'Enter'. Each game has 30 seconds of time limit. On the left side of the screen, users are able to see a count down timer, the current score and the personal best of this account. On the right side of the screen,
there is a detailed instruction of the game as well. There are a list of words in the middle and each of them has a difficulty attribute. Words with difficulty "easy", "medium", "hard" earns 10, 20, 30 points respectively.
+ **GameOver**
When the timer counts to 0, the game is over and a game over page will be displayed. On the top it displays a 
congratulation message with the scores and user's personbal best score. Each point of the score will be converted to 1 better coin. Below that is a leaderboard that shows at most 5 top users who have the highest scores. If there are less than 5 gameplay records in our database, it may show less than 5 top users. Users can hit the play again button to play the game again.

### Admin:

Log in with the default username and password of `admin` and `admin`. Admins are able to access all pages that users can access. Admins can also access the Admin Page.

+ **Admin:** Admin accounts have an extra link on the navigation bar. Admins can view the information of all users and users in the blacklist. By clicking on the Add to Blacklist button, Admins can one user to the blacklist. By clicking on the Remove button, Admins can remove one user from the blacklist. Users in the blacklist cannot access the write comment feature. This feature is designed to punish users who do not comment properly. When they are removed from the blacklist, they will be able to write comments. Admins can also edit the user information - such as the displayname, email, phone number, and the amount of better coins/capitals they have in their portfolio. When admins click on the Edit button, there will ba a pop-up box that allow them to enter the new displayname, email, phone number, and the amount of better coins/capitals respectively. They can choose to change all four attributes at once, or they can only change some of them. Empty inputs will not be recorded.


## Routes:

### admin.js

 + POST /api/admin/users  
Create a new ADMIN user.  
Parameters:  
Body: User information. {username: <username>, displayName: <display name>, password: <password>, secret: "verylongsupersecretandsecurestring"}  
 Returns: 200 on success, and the database representation of the user.

 + PATCH /api/admin/users  
Update a regular user's information.  
Parameters: username (username of the user to change)  
Body: Array of operations to complete: {"op", "replace", "path", "/<attribute to replace>", "value": <new value>}  
     The only attributes that can be modified are: "displayName", "email", "phone", "betterCoins", 'bio'  
Response: 200 on success and the new user's representation.  

+ DELETE /api/stocks/:stock/reviews/:reviewID  
Delete a review from this stock page.  
Parameters: stock (stock symbol), reviewID (ObjectID of the review to delete)  
Body: None  
Returns: 200 on success and the stock representation  

### game.js

+ POST /api/game/score  
Record a new score for the currently logged in user.  
Handles adding capital to the user's paper trading information, and overwriting high scores if necessary.  
Parameters: None  
Body: {score: <score>}  
Returns: 200 on success  

+ GET /api/game/highscores/:n  
Retrieve up to n of the highest scores for the game.  
Parameters: n (maximum number of records to retrieve)  
Body: None  
Returns: 200 on success and an array of up to n of the highest scores  

+ GET /api/game/highscore/user  
Retrieve the highest score for the currently logged in user.  
Parameters: None  
Body: None  
Returns: 200 on success and the user's highest score. 404 if the current user does not have a high score.  

### gameWords.js

+ POST /api/game/words  
Add a new game word.  
Parameters: None  
Body: {word: (word to add), difficulty: (one of "easy", "medium", "hard")}  
Returns: 200 on success, and the represetation of the game word.  

+ GET /api/game/words  
Get all game words.  
Parameters: None  
Body: None  
Returns: 200 on success and a list of words.  

### paperTrade.js

+ POST /api/papertrade  
Purchase a stock for the currently logged in user.  
Parameters: None  
Body: {stock: <stock symbol>}  
Returns: 200 on success and the new paper trade information  
         {capital: <user's capital>, holdings: <list of stock holdings and the number of holdings>}  
         400 on a bad request, such as not having enough capital, or a bad stock symbol. Response body will contain  
         information about the failed request: {reason: <reason>}, where reason could be one of  
         "Not enough capital"  
         "Invalid stock symbol"  
         "Other error"  

+ DELETE /api/papertrade  
Sell a stock for the currently logged in user.  
Parameters: None  
Body: {stock: <stock symbol>}  
Returns: 200 on success and the new paper trade information  
         {capital: <user's capital>, holdings: <list of stock holdings and the number of holdings>}   
         400 on a bad request, such as not holding the stock, or a bad stock symbol. Response body will contain  
         information about the failed request: {reason: <reason>}, where reason could be one of  
         "No stock units"  
         "Invalid stock symbol"  
         "Other error"  

### stocks.js

+ POST /api/stocks  
Parameters: None  
Body: {symbol: <stock symbol>, price: <current stock price>}  
Returns: 200 on success and the representation of the stock  

+ GET /api/stocks?stock=aapl&stock=...  
Get list of stock information  
Parameters: In the query parameters, use the "stock" key for multiple stocks.  
Body: None  
Returns: 200 on success and the array of stocks.  

+ GET /api/stocks/history/:stock?interval=1d  
Get the specified stock's historical price.  
Parameters: interval (interval of time backwards) accepts the following values: "1d"  
Body: None  
Returns: 200 on success and an array of {timestamp: <timestamp>, price: <price>} sorted by increasing timestamp  

+ GET /api/stocks/search?prefix=A&n=5  
Get a listing of stocks with symbols beginning with the given prefix.  
Parameters: prefix (beginning of the stock symbol to search for), n (maximum number of stocks to return, default 10)  
Body: None  
Returns: 200 on success and an array of matching stocks sorted alphabetically  

+ PUT /api/stocks/:symbol/price  
Update a given stock's price.  
Parameters: symbol (stock symbol)  
Body: {price: <new stock price>}  
Returns: 200 on success and the stock representation in the database  

+ POST /api/stocks/:stock/reviews  
Create a new review for the given stock.  
Parameters: stock (stock symbol to add a review to)  
Body: {review: <review string>, stars: <number of stars>}  
 Returns: 200 on success and the updated array of reviews, or a 403 if the user is blacklisted.  

+ GET /api/stocks/:stock/reviews  
Get review information for a given stock.  
Parameters: stock (stock symbol)  
Body: None  
Returns: 200 on success and the reviews for the given stock  

+ DELETE /api/stocks/:stock/reviews/:reviewID  
Delete a review from this stock page. Must be removing a review posted by the logged in user.  
Parameters: stock (stock symbol), reviewID (ObjectID of the review to delete)  
Body: None  
Returns: 200 on success and the stock representation  

### users.js

+ POST /users/login  
Log in and generate session information.  
Parameters: None  
Body: {username: <username>, password: <password>}  
Returns: The logged in user's information as represented in the database.  

+ GET /users/logout  
Log out and destroy session information.  
Parameters: None  
Body: None  
Returns: 200 on success, no other content.  

+ GET /users/check-session  
Check whether the current user's session is valid.  
Parameters: None  
Body: None  
Returns: 200 if a valid session is found and {currentUser: <user ID>, username: <username>}.  
         401 if no valid session is found  

+ POST /api/users  
Create a new user.  
Parameters: None  
Body: User information. {username: <username>, displayName: <display name>, password: <password>}  
Returns: 200 on success, and the database representation of the user.  

+ GET /api/users/:username  
Retrieve a user's information by username.  
Parameters: username (of the user to retrieve information for)  
Body: None  
Returns: 200 on success and the database representation of the user.  

+ GET /api/users/  
Retrieve all users.  
Parameters: None  
Body: None  
Returns: 200 on success and the database representations of all users.  

+ PATCH /api/users/  
Change information for the current session's user.  
Parameters: None  
Body: Array of operations to complete: {"op", "replace", "path", "/<attribute to replace>", "value": <new value>}  
      The only attributes that can be modified are: "displayName", "email", "phone", "bio"  
Returns: 200 on success and the updated user's database representation.  

+ POST /api/users/watchlist  
Add a stock to the logged in user's watch list.  
Parameters: None  
Body: {stock: <stock symbol>}  
Returns: 200 on success and the updated user.  


## Sources
+ Log-in background video: https://static.videezy.com/system/resources/previews/000/041/687/original/02.mp4
+ Default profile picture: https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg
+ Log-out Icon: https://pngtree.com/element/down?id=NDIzOTYyNg==&type=1&time=1649188840&token=OTI0NzQzYmJlZDBhNDgxYzNmMjRmOTg4MDdhZWZjZmI=
