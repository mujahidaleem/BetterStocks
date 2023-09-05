import React from "react";
import { uid } from "react-uid";
import "./ProfilePage.css";
import { Navigate, NavLink, withRouter } from "react-router-dom";
import ENV from "../../config.js";
import backButtonImg from "./backButtonImg.png";
const API_HOST = ENV.api_host;
class ProfileEditPage extends React.Component {
	state = {
		backToProfileRedirect: false,
		email: null,
		displayName: null,
		phoneNumber: null,
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

		stockList: [],
	};
	handleInputChange = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value,
		});
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
			console.log(userJSONDATA);
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

	handleEditData = () => {
		// api calls
		console.log("This is the edited state", this.state);
	};

	goBackToProfile = () => {
		this.setState({ backToProfileRedirect: true });
	};

	submitEditInfo = async () => {
		let NONemptyFields = ["email", "displayName", "phone"];
		if (this.state.email === null || this.state.email === "") {
			NONemptyFields = NONemptyFields.filter((e) => e !== "email");
		}
		if (this.state.displayName === null || this.state.displayName === "") {
			NONemptyFields = NONemptyFields.filter((e) => e !== "displayName");
		}
		if (this.state.phoneNumber === null || this.state.phoneNumber === "") {
			NONemptyFields = NONemptyFields.filter((e) => e !== "phone");
		}
		console.log(NONemptyFields);

		const bodyArray = [];
		for (var i = 0; i < NONemptyFields.length; i++) {
			if (NONemptyFields[i] === "email") {
				bodyArray.push({
					op: "replace",
					path: "/email",
					value: this.state.email,
				});
			} else if (NONemptyFields[i] === "displayName") {
				bodyArray.push({
					op: "replace",
					path: "/displayName",
					value: this.state.displayName,
				});
			} else if (NONemptyFields[i] === "phone") {
				bodyArray.push({
					op: "replace",
					path: "/phone",
					value: this.state.phoneNumber,
				});
			}
		}
		console.log(bodyArray);
		const body1 = bodyArray;
		if (body1.length !== 0) {
			const patchResponse = await fetch(`${API_HOST}/api/users/`, {
				method: "PATCH",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body1),
				// JSON.stringify({
				// 	op: "replace",
				// 	path: "/bio",
				// 	value: this.state.bio,
				// }),
			});
			console.log("THIS EXECUTED");
			const patchResponseJson = patchResponse;
			console.log(patchResponseJson);
			if (!patchResponse.ok) console.log("Problem in patch request profile");
			else this.setState({ loggedInUser: patchResponse });
			console.log(this.state.loggedInUser);
		}
	};
	constructor(props) {
		super(props);

		this.constructProfileElements();
	}
	//THE COMPONENTS WILL RELY ON API CALLS TO THE SERVER TO FILL
	// IN THE DATA
	render() {
		if (this.state.backToProfileRedirect) {
			return <Navigate to="/profile"></Navigate>;
		}
		return (
			<div>
				<div id="profile-edit">
					<input
						className="textbox"
						type="text"
						name="bio"
						onChange={this.handleInputChange}
						value={this.state.bio}
						placeholder="Bio"
					/>
					<input
						className="textbox"
						type="text"
						name="displayName"
						onChange={this.handleInputChange}
						value={this.state.displayName}
						placeholder="Display Name"
					/>
					<input
						className="textbox"
						type="text"
						name="phoneNumber"
						onChange={this.handleInputChange}
						value={this.state.phoneNumber}
						placeholder="Phone number"
					/>
					<input
						className="textbox"
						type="text"
						name="email"
						onChange={this.handleInputChange}
						value={this.state.email}
						placeholder="Email"
					/>
					<input
						id="submit-button-login"
						type="submit"
						value="Submit"
						onClick={this.submitEditInfo}
					/>
				</div>
				<div>
					<img className="back-button-img" src={backButtonImg} />
					<button onClick={this.goBackToProfile} className="back-button-button">
						Back to Profile
					</button>
				</div>
			</div>
		);
	}
}

export default ProfileEditPage;
