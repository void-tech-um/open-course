import React, { useState, useEffect } from "react";
import { TypeAnimation } from 'react-type-animation';
import ResourceFeed from "./resourcefeed";
import Feed from "./mainPage/feed";

export default function App() {
  const [activeTab, setActiveTab] = useState('StudyGroupTab');
  const tabs = {
        StudyGroupTab: {
            title: "Study Groups",
            component: <StudyGroupTab />,
        },
        //UNCOMMENT THIS TO BRING BACK RESOURCE PAGE
        // ResourcesTab: { 
        //     title: "Resources",
        //     component: <ResourcesTab />,
        // },
    };

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
                {/* Dynamically render tab buttons */}
                {Object.keys(tabs).map((tabKey) => (
                    <button
                        key={tabKey}
                        className={activeTab === tabKey ? 'active-tab' : ''}
                        onClick={() => setActiveTab(tabKey)}
                    >
                        {tabs[tabKey].title}
                    </button>
                ))}
            </div>
            <hr/>
            {/* Dynamically render the active tab's content */}
            <div>
                {tabs[activeTab].component}
            </div>
        </div>
    );
}

function StudyGroupTab() {
  return (
    <div>
      <Feed type = "group"/>
    </div>
  );
}

function ResourcesTab() {
  return (
    <div>
      <ResourceFeed></ResourceFeed>
    </div>
  );
}