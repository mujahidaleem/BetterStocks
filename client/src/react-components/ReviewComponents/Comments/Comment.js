import React from 'react';
import './Comment.css';
import FiveStar from '../../FiveStar/index';

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: props.userName,
            displayName: props.displayName,
            profilePicture: props.profilePicture,
            rate: props.rate,
            text: props.text
        };
    }

    render() {

        return (
                <div className='reviewSection'>
                    <div className='review'>
 		
                        <div className='IconContainer'>
                            <img className="Icon" src={this.state.profilePicture} />
                        </div>

                        <div className='Content'>
                            <h2>{this.state.displayName} </h2>
                            <h2><span className="small"> @{this.state.userName} </span></h2>
                            <div className='textContent'>
                                <p>
                                    {this.state.text}
                                </p>
                            </div>
                            <div className='starContainer'>
                                <div className='emptyStar'>
                                    <FiveStar stars={5} size_mult={1.5} />
                                </div>
                                <div className='rateStar'>
                                    <FiveStar stars={this.state.rate} size_mult={1.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Comment;
