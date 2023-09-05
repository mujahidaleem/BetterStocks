import React from 'react';
import './backgroundVideo.css';

export default function BackgroundVideo() {
    return (
        <div>
            <video loop autoPlay muted id="bg-video">
                <source src={require('./backgroundVid.mp4')} type="video/mp4"/>
            </video>
        </div>
    )
}