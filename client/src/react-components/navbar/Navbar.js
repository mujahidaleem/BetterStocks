import React from 'react';
import ReactDOM from 'react-dom';
import './Navbar.css'
import { Navigate, NavLink } from 'react-router-dom';
import ENV from '../../config.js';
import { AiOutlineBlock } from 'react-icons/ai';
const API_HOST = ENV.api_host;

class Navbar extends React.Component {

    state = {
        profileRedirect:null,
        topstocksRedirect:null,
        searchRedirect:null,
        trendingRedirect:null
    };

    renderAdmin() {
        try {
            fetch(`${API_HOST}/users/check-session`, {
                method: "GET",
                headers: {
                    Accept: "application/json text/plain, */*",
                    "Content-Type": "application/json",
                }
            })
            .then((sessionResponse) =>{
                return sessionResponse.json();
            })
            .then((json) => {
                let currentUsername = json.username;
                fetch(`${API_HOST}/api/users/${currentUsername}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json text/plain, */*",
                        "Content-Type": "application/json",
                    }})
                    .then((response) => {
                        return response.json()
                    })
                    .then((json) => {
                        if (json.admin){
                            const admin = document.getElementById("admin")
                            admin.style.display = "inline-block";
                        }
                    })
                
            })  


                // let currentUsername = sessionResponseJSON.username;
                // fetch(`${API_HOST}/api/users/${currentUsername}`, {
                //     method: "GET",
                //     headers: {
                //         Accept: "application/json text/plain, */*",
                //         "Content-Type": "application/json",
                //     }
                // }).then((response) => {
                //     if (!response.ok) console.log("user data gathering response is not okay");
                //     let u =  response.json()
                //     console.log(u.admin)
                //     if (u.admin){
                //         return <li><NavLink className="nav-items" to="/admin">Admin</NavLink></li>;
                // }})})
        } catch (e) {
            console.log(e)
            console.log("ere")
        }

        return;
    }

    render() {


        return (
            <div className="navbar sticky">

                <div id="nav-section">
                    <ul>
                        <a className="logo">BetterStocks</a>
                        <li><NavLink className="nav-items" to="/stocklisting">Stocks</NavLink></li>
                        <li><NavLink className="nav-items" to="/paper-trade">Paper Trading</NavLink></li>
                        <li><NavLink className="nav-items" to="/game">TypeGame</NavLink></li>
                        <li><NavLink className="nav-items" to="/profile">Profile</NavLink></li>
                        <li><NavLink id = "admin" className="nav-items" to="/admin">Admin</NavLink></li>
                        { this.renderAdmin() }
                    </ul>


                </div>
            </div>
        )
    }
}
export default Navbar
