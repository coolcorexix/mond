import React, { useEffect, useState } from "react";
import ModelViewer from "@metamask/logo";
import { getAnObjectFromLocalStorage, writeAnObjectToLocalStorage } from "./chromeStorageHelper";

const modes = [
  {
    name: "9-5",
    tabsToOpen: [
      "https://saleshood.content-stage.saleshood.com/",
      "https://saleshood.atlassian.net/jira/software/c/projects/DEV/boards/101",
    ],
    siteToBlock: ["facebook.com", "twitter.com"],
  },
  {
    name: "freelance",
    tabsToOpen: [
      "https://trello.com/b/I25lKdLI/intaface",
      "https://intaface.me/create",
    ],
  },
  {
    name: "indie hacking",
    siteToBlock: ["facebook.com", "youtube.com"],
  },
  {
    name: "Internet explorer",
    tabsToOpen: ["https://nemothecollector.dev/read2"],
  },
  {
    name: "doing something offscreen",
  },
];

function App() {
  const [selectedMode, setSelectedMode] = useState<{
    name: string;
    tabsToOpen?: string[];
    siteToBlock?: string[];
  }>(null);
  useEffect(() => {
    const container = document.getElementById("logo-container");
    if (container?.hasChildNodes()) {
      return;
    }
    const viewer = ModelViewer({
      pxNotRatio: false,
      width: 0.3,
      height: 0.3,

      // To make the face follow the mouse.
      followMouse: true,

      // head should slowly drift (overrides lookAt)
      slowDrift: true,
    });

    // move the svg in body to the container

    // console.log("🚀 ~ file: App.tsx:24 ~ useEffect ~ container:", container)
    if (!container) {
      return;
    }
    // console.log("🚀 ~ file: App.tsx:29 ~ useEffect ~ container.firstChild:", container.firstChild)
    // // replace if existing and append if null
    container.firstChild
      ? container.replaceChild(container.firstChild, viewer.container)
      : container.appendChild(viewer.container);
  }, []);
 

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "16px 32px",

        // green neon background
        backgroundColor: "#00ff00",
        justifyContent: "start",
      }}
      className="App"
    >
      <div
        style={{
          background: "teal",
          width: "30vw",
          marginRight: 16,
          padding: 16,
        }}
      >
        <h1>I am feeling like:</h1>
        <div id="logo-container" />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          background: "cyan",
          marginRight: 16,
          padding: 16,
        }}
      >
        <h1>Modes:</h1>
        {modes.map((mode) => (
          <button
            style={{
              marginBottom: 16,
            }}
            onClick={() => {
              setSelectedMode(mode);
            }}
          >
            <label htmlFor={mode.name}>{mode.name}</label>
          </button>
        ))}
      </div>
      {
        !!selectedMode &&   <div style={{
          padding: 16,
          background: "yellow",
        }}>
        <h1>Mode to set: {selectedMode?.name}</h1>

        <div style={{
          marginBottom: 16,
        }}>
          These sites will be opened in advance:
          <ul>
            {selectedMode?.tabsToOpen?.map((url) => (
              <li>{url}</li>
            ))}
          </ul>
          <button onClick={async () => {
            const urlToAdd = prompt("Enter url to open in advance");
            let modes: any = await getAnObjectFromLocalStorage("modes") || {
              [selectedMode.name]: [
                {
                  tabsToOpen: [],
                  siteToBlock: [],
                }
              ]
            };
            console.log("🚀 ~ file: App.tsx:145 ~ letmodes:any=awaitgetAnObjectFromLocalStorage ~ modes:", modes)
            modes[selectedMode.name].tabsToOpen = [...modes[selectedMode.name].tabsToOpen, urlToAdd];
            writeAnObjectToLocalStorage("modes", modes);
          }}>
            + Add url to open in advance v2
          </button>
        </div>
        <div>
          These sites will be blocked:
        </div>
        <ul>
          {selectedMode?.siteToBlock?.map((url) => (
            <li>{url}</li>
          ))}
        </ul>
        <button>
          + Add site to block
        </button>
<div>
  </div>
        <button
          style={{
            marginTop: 32,
          }}
          onClick={() => {
            chrome.runtime.sendMessage({
              action: 'setMode',
              data: {
                mode: selectedMode,
              }
            })
            selectedMode.tabsToOpen?.forEach((url) => {
              chrome.tabs.create({ url });
            });
            // window.close();
            if (selectedMode.name === "doing something offscreen") {
              // close browser
              alert("Turn off your computer and go outside");
            }
            window.close();
          }}
        >
          Ok
        </button>
      </div>
      }
    
    </div>
  );
}

export default App;
