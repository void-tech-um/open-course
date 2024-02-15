import React, { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';
import '../static/css/style.css';

export default function App() {
    const [activeTab, setActiveTab] = useState('StudyGroupTab');

    return (
        <div>
            <div className="feed-banner">
                <h1>Enrich your academic life with Open Course’s</h1>
                <TypeAnimation
                sequence={[
                    // Same substring at the start will only be typed out once, initially
                    'study group finder',
                    2000, // wait 1s before replacing "Mice" with "Hamsters"
                    '',
                    'class resource locator',
                    2000, // wait 1s before replacing "Mice" with "Hamsters"
                    '',
                ]}
                wrapper="span"
                speed={25}
                style={{ fontSize: '32px', display: 'inline-block' }}
                repeat={Infinity}
                />
            </div>
            <div className="tabStyling">
                <button onClick={() => setActiveTab('StudyGroupTab')}>Study Groups</button>
                <button onClick={() => setActiveTab('ResourcesTab')}>Resources</button>
            </div>
            <div>
                {activeTab === 'StudyGroupTab' && <StudyGroupTab />}
                {activeTab === 'ResourcesTab' && <ResourcesTab />}
            </div>
        </div>
    );
}

function StudyGroupTab() {
  return (
    <div>
      <h2>Study Groups</h2>
      <p>This is the content for Study Groups.</p>
    </div>
  );
}

function ResourcesTab() {
  return (
    <div>
      <h2>Class Resources</h2>
      <p>This is the content for Resources.</p>
    </div>
  );
}