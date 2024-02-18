import React, { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';
import '../static/css/style.css';
import StudyGroupFeed from "./studygroupfeed";
import ResourceFeed from "./resourcefeed";

export default function App() {
    const [activeTab, setActiveTab] = useState('StudyGroupTab');

    return (
        <div>
            <div className="feed-banner">
                <h1>Enrich your academic life with Open Course’s</h1>
                <TypeAnimation
                sequence={[
                    'study group finder',
                    2000,
                    '',
                    'class resource locator',
                    2000,
                    '',
                ]}
                wrapper="span"
                speed={25}
                style={{ fontSize: '32px', display: 'inline-block' }}
                repeat={Infinity}
                />
            </div>
            <div className="tab-styling">
                <button className={activeTab === 'StudyGroupTab' ? 'active-tab' : ''} onClick={() => setActiveTab('StudyGroupTab')}>Study Groups</button>
                <button className={activeTab === 'ResourcesTab' ? 'active-tab' : ''} onClick={() => setActiveTab('ResourcesTab')}>Resources</button>
            </div>
            <hr/>
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
      <StudyGroupFeed></StudyGroupFeed>
    </div>
  );
}

function ResourcesTab() {
  return (
    <div>
      <h2>Class Resources</h2>
      <p>This is the content for Resources.</p>
      <ResourceFeed></ResourceFeed>
    </div>
  );
}