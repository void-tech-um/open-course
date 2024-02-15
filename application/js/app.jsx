import React, { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';

export default function App() {
    const [text, setText] = useState('');

    return (
        <div>
            <div className="feed-banner">
                <h1>Enrich Your Academic Life with Open Course’s</h1>
                <TypeAnimation
                sequence={[
                    // Same substring at the start will only be typed out once, initially
                    'study group finder',
                    2000, // wait 1s before replacing "Mice" with "Hamsters"
                    '',
                ]}
                wrapper="span"
                speed={25}
                style={{ fontSize: '2em', display: 'inline-block' }}
                repeat={Infinity}
                />
            </div>
        </div>
    );
}
