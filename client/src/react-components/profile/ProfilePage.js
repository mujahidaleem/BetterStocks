import React from "react";
import { uid } from "react-uid";
import "./ProfilePage.css";
import { Navigate, NavLink, withRouter } from "react-router-dom";
import ENV from "../../config.js";
import logOutPic from "./logout.png";
import editButtonImage from "./edit-button-img.png";
const API_HOST = ENV.api_host;
class ProfilePage extends React.Component {
	state = {
		logOutRedirect: false,
		editProfileRedirect: false,
		//no need for these states, will be props when backend implemented
		loggedInUser: {
			displayName: "",
			userName: "",
			//
			watchlist: [],
			bio: "",
			profilePicture: "", //profile picture is a url-based image at the moment
			phoneNumber: "",
			email: "",
			isAdmin: false,
		},
		profilePictureStock:
			"https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg",

		stockList: [],
	};

	constructProfileElements = async () => {
		const sessionResponse = await fetch(`${API_HOST}/users/check-session`, {
			method: "GET",
			headers: {
				Accept: "application/json text/plain, */*",
				"Content-Type": "application/json",
			},
		});
		console.log(sessionResponse);
		const sessionResponseJSON = await sessionResponse.json();
		console.log(sessionResponseJSON);

		if (!sessionResponse.ok) {
			console.log("check session response is not okay");
			console.log("---STOP users/check-sesion ---");
			return;
		} else {
			console.log(sessionResponseJSON);
		}
		const currentUsername = sessionResponseJSON.username;
		const currentUserID = sessionResponseJSON.userID;

		const response = await fetch(`${API_HOST}/api/users/${currentUsername}`, {
			method: "GET",
			headers: {
				Accept: "application/json text/plain, */*",
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) console.log("user data gathering response is not okay");
		else {
			const userJSONDATA = await response.json();
			// console.log(userJSONDATA);
			this.setState({ loggedInUser: userJSONDATA });
		}

		// fetch("/users/check-session", {
		// 	method: "GET",
		// 	headers: {
		// 		Accept: "application/json text/plain, */*",
		// 		"Content-Type": "application/json",
		// 	},
		// 	credentials: "include",
		// }).then((response) => {
		// 	console.log(response.json());
		// 	if (!response.ok) console.log("check session response is not okay");
		// 	else {
		// 		currentUsername = response.body.username;
		// 		currentUserID = response.body.userID;
		// 		console.log(response.body);
		// 	}
		// 	fetch(`/api/users/${currentUsername}`, {
		// 		method: "GET",
		// 		headers: {
		// 			Accept: "application/json text/plain, */*",
		// 			"Content-Type": "application/json",
		// 		},
		// 	}).then((response) => {
		// 		if (!response.ok)
		// 			console.log("user data gathering response is not okay");
		// 		else {
		// 			this.setState({ loggedInUser: response.body });
		// 		}
		// 	});
		// });
	};

	logOutAccount = () => {
		fetch(`${API_HOST}/users/logout`, {
			method: "GET",
			headers: {
				Accept: "application/json text/plain, */*",
				"Content-Type": "application/json",
			},
		}).then((response) => {
			if (!response.ok) {
				console.log("COULD NOT LOGOUT");
			} else {
				console.log("LOGGING OUT");
				this.setState({ logOutRedirect: true });
			}
		});
	};

	editAccount = () => {
		this.setState({ editProfileRedirect: true });
	};

	constructor(props) {
		super(props);
		this.constructProfileElements();

		try {
		} catch (e) {
			if (this.props.loggedInUser.watchlist.length > 0) {
				this.props.loggedInUser.watchlist.forEach((stock, index) => {
					// stockList.push(<NavLink className="watchlist-stock" to={`/stock?symbol=${stock}`}></NavLink>)
					this.state.stockList.push(
						<NavLink
							id={uid(stock)}
							className="watchlist-stock"
							to={`/stocks?symbol=${stock}`}
						></NavLink>
					);
				});
			}
		}
	}
	//THE COMPONENTS WILL RELY ON API CALLS TO THE SERVER TO FILL
	// IN THE DATA
	render() {
		if (this.state.logOutRedirect) {
			this.setState({ logOutRedirect: false });
			return <Navigate to="/login"></Navigate>;
		}
		if (this.state.editProfileRedirect) {
			return <Navigate to="/profile-edit"></Navigate>;
		}
		return (
			<div>
				<div id="profile-page">
					<div id="contact-info">
						<h2 className="grid-element" id="display-name">
							{this.state.loggedInUser.displayName}
						</h2>
						<img
							id="profile-picture"
							className="grid-element"
							src={this.state.profilePictureStock}
							alt="Profile"
						/>
						<h2 className="grid-element" id="user-name">
							@ {this.state.loggedInUser.username}
						</h2>
						<h2 className="grid-element" id="bio">
							{this.state.loggedInUser.bio}
						</h2>
						<h2 className="grid-element" id="phone-number">
							{this.state.loggedInUser.phone}
						</h2>
						<h2 className="grid-element" id="email">
							{this.state.loggedInUser.email}
						</h2>
						<div>
							<img className="logOut" src={logOutPic} />
							<button onClick={this.logOutAccount} className="logOutButton">
								Log Out
							</button>
						</div>
						<div>
							<img className="edit-profile-img" src={editButtonImage} />
							<button
								onClick={this.editAccount}
								className="edit-profile-button"
							>
								Edit Profile
							</button>
						</div>

						<div id="watchlist-section">
							<h2>My Watchlist</h2>
							<ul id="profileWatchlist">{this.stockList}</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfilePage;
