import React from 'react';
import './UserInfo.css'

class UserInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: props.user.username,
            displayName: props.user.displayName,
            profilePicture: props.profilePicture,
            email: props.user.email ? props.user.email : '',
            phone: props.user.phone ? props.user.phone: '',
            coins: props.user.paperTrade.capital,
        };
    }

    onTrigger = () => {
        this.props.parentCallBack(this.state.userName)
    }
 
    openPopup = (e) => {
        const x = e.target.parentNode.nextSibling;
        if (x.style.display === "none") {
            x.style.display = "block"
        } else {
            x.style.display = "none"
        }
    }

    closePopup = (e) => {
        const x = e.target.parentNode.parentNode;
        if (x.style.display === "none") {
            x.style.display = "block"
        } else {
            x.style.display = "none"
        }
    }

    handleSubmitChange = (e) => {
        const parent = e.target.parentNode;
        const newName = parent.children[3].value
        const newEmail = parent.children[5].value
        const newPhone= parent.children[7].value
        const newCoins = parent.children[9].value

        if (newName != ""){
            this.setState({ ["displayName"]: newName })
        }
        if (newEmail != ""){
            this.setState({ ["email"]: newEmail })
        }
        if (newPhone != ""){
            this.setState({ ["phone"]: newPhone })
        } 
        if (newCoins != ""){
            this.setState({ ["coins"]: newCoins}) 
        }
        
        this.props.parentUpdate(this.state.userName, this.state.displayName, this.state.email, this.state.phone, this.state.coins)
        const x = e.target.parentNode.parentNode;
        if (x.style.display === "none") {
            x.style.display = "block"
        } else {
            x.style.display = "none"
        }
    }

    render() {

        return (
            <div className='userSection'>
                    <div className='user'>
                        <div className='IconContainer'>
                            <img className="Icon" src={this.state.profilePicture} />
                        </div>

                        <div className='Content'>
                            <h2>{this.state.displayName} </h2>
                            <h2><span className="small"> @{this.state.userName} </span></h2>
                            <div className='textContent'>
                                <p>
                                    Email: {this.state.email}
                                </p>
                                <p>
                                    Phone Number: {this.state.phone}
                                </p>
                                <p>
                                    Better Coins: {Number(this.state.coins).toFixed(2)}
                                </p>
                                
                            </div>
                        </div>
                        <button className='addToBlackListButton button1' onClick={this.onTrigger}>Add to BlackList</button>
                        <button className='editButton button1' onClick={this.openPopup}>Edit</button>
                    </div>
                    <div id="popup-box">
                        <div className="box">
                            <div className="close-icon" onClick={this.closePopup} >x</div>
                            <h2>{this.state.userName} </h2>
                            <p className='editInfoTitle'>Display Name </p>
                            <input id='box1' className="editTextbox"  placeholder='Enter a new display name' value={this.state.displayName} onChange={e => this.setState({displayName: e.target.value})}/>
                            <p className='editInfoTitle'>Email </p>
                            <input id='box2' className="editTextbox" placeholder='Enter a new email' value={this.state.email} onChange={e => this.setState({email: e.target.value})}/>
                            <p className='editInfoTitle'>Phone Number </p>
                            <input id='box3' className="editTextbox"  placeholder='Enter a new phone number' value={this.state.phone} onChange={e => this.setState({phone: e.target.value})}/>
                            <p className='editInfoTitle'>Better Coins </p>
                            <input id='box4' className="editTextbox" placeholder='Enter a new better coins value' value={this.state.coins} onChange={e => this.setState({coins: e.target.value})}/>
                            <button className='submitButton button1' onClick={this.handleSubmitChange}>Submit</button>
                        </div>
                    </div>
            </div>
        )
    }

}

export default UserInfo;
