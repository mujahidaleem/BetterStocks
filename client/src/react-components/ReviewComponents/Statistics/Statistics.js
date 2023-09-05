import React from 'react';
import './Statistics.css';
import FiveStar from '../../FiveStar/index';

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            avg: props.avg,
            numComment: props.numComment,
            fiveStar: props.fiveStar,
            fourStar: props.fourStar,
            threeStar: props.threeStar,
            twoStar: props.twoStar,
            oneStar: props.oneStar
        };
    }


    render() {

        return (
            <div className='statsSection'>
                <div className='averageScore'>
                    {this.state.avg}
                </div>
                <p><span className='numComments'>{this.state.numComment} comments have been written</span></p>
                <span className='averageStars'>
                    <FiveStar stars={this.state.avg} size_mult={2.5} />
                </span>
                <span className='starData'>
                    <FiveStar stars={5} size_mult={2.5} />
                    <FiveStar stars={4} size_mult={2.5} />
                    <FiveStar stars={3} size_mult={2.5} />
                    <FiveStar stars={2} size_mult={2.5} />
                    <FiveStar stars={1} size_mult={2.5} />
                </span>
            

                <span className='numData'>
                    <h2>{this.state.fiveStar} </h2>
                    <h2>{this.state.fourStar} </h2>
                    <h2>{this.state.threeStar} </h2>
                    <h2>{this.state.twoStar} </h2>
                    <h2>{this.state.oneStar} </h2>
                </span>
                
            </div>

        )
    }
}

export default Statistics;
