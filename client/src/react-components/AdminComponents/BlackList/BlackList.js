import React from 'react';
import './BlackList.css'

class BlackList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: props.user.username,
            displayName: props.user.displayName,
            profilePicture: props.profilePicture,
            
        };
    }

    
    onTrigger = () => {
        this.props.parentCallBack(this.state.userName);
    }

    render() {

        return (
            <div className='section'>
                    <div className='blacklistUser'>
                        <div className='IconContainer'>
                            <img className="Icon" src={this.state.profilePicture} />
                        </div>

                        <div className='Content'>
                            <h2>{this.state.displayName} </h2>
                            <h2><span className="small"> @{this.state.userName} </span></h2>
                        </div>
                        <button className='blackButton button2' onClick={this.onTrigger} >Remove</button>
                    </div>
                </div>
        )
    }

}

export default BlackList;
