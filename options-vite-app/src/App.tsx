import React, { useCallback, useEffect, useState } from "react";
import ModelViewer from "@metamask/logo";
import {
  getAnObjectFromLocalStorage,
  writeAnObjectToLocalStorage,
} from "./chromeStorageHelper";

function App() {
  const [modes, setModes] = useState([]);

  const [selectedMode, setSelectedMode] = useState<{
    name: string;
    tabsToOpen?: string[];
    siteToBlock?: string[];
  }>(null);
  const removeUrlFromList = useCallback(async (section: 'tabsToOpen' | 'siteToBlock', urlToRemove: string) => {
    const newUrlList = selectedMode[section].filter((url) => url !== urlToRemove);
    selectedMode[section] = newUrlList;
    const storedModesToUpdate: any =
      await getAnObjectFromLocalStorage("modes");
    // replace mode in modes with selectedMode
    let modeToUpdate = storedModesToUpdate.find(
      (mode: any) => mode.name === selectedMode.name
    );
    modeToUpdate[section] = selectedMode[section];
    writeAnObjectToLocalStorage(
      "modes",
      storedModesToUpdate
    );
    setModes(storedModesToUpdate);
    if (section === 'siteToBlock') {
      alert('If you already start the mode, please restart the browser for this change to take effect');
    }
  }, [selectedMode]);
  useEffect(() => {
    getAnObjectFromLocalStorage("modes").then((storedModes: any) => {
      console.log(
        "🚀 ~ file: App.tsx:20 ~ getAnObjectFromLocalStorage ~ storedModes:",
        storedModes
      );

      setModes(storedModes);
    });
  }, []);
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
              
              if (mode.name === "doing something offscreen") {
                // close browser
                alert("Turn off your computer and go outside");
                window.close();
                return;
              }
              setSelectedMode(mode);
            }}
          >
            <label htmlFor={mode.name}>{mode.name}</label>
          </button>
        ))}
      </div>
      {!!selectedMode && (
        <div
          style={{
            padding: 16,
            background: "yellow",
          }}
        >
          <h1>Mode to set: {selectedMode?.name}</h1>

          <div
            style={{
              marginBottom: 16,
            }}
          >
            These sites will be opened in advance:
            <ul>
              {selectedMode?.tabsToOpen?.map((url) => (
                <li>
                  <div>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                    <button
                      onClick={() => {
                        removeUrlFromList('tabsToOpen', url);
                      }}
                    >
                      x
                    </button>

                  </div>
                </li>
                
                
              ))}
            </ul>
            <button
              onClick={async () => {
                const urlToAdd = prompt("Enter url to open in advance");
                let modes: any = await getAnObjectFromLocalStorage("modes");
  
                selectedMode.tabsToOpen = [
                  ...selectedMode.tabsToOpen,
                  urlToAdd,
                ];
                // replace mode in modes with selectedMode
                const modeToUpdate = modes.find(
                  (mode: any) => mode.name === selectedMode.name
                );
                modeToUpdate.tabsToOpen = selectedMode.tabsToOpen;

                // modes.find((mode: any) => mode.name === selectedMode.name) = selectedMode;
                writeAnObjectToLocalStorage("modes", modes);
                setModes(modes);
              }}
            >
              + Add url to open in advance
            </button>
          </div>
          <div>These sites will be blocked:</div>
          <ul>
            {selectedMode?.siteToBlock?.map((url) => (
              <li>
                <div>
                  <a href={url} target="_blank" rel="noreferrer">
                    {url}
                  </a>
                  <button
                    onClick={() => {
                      removeUrlFromList('siteToBlock', url);
                    }}
                  >
                    x
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={async () => {
              const urlToAdd = prompt("Enter url to block");
              selectedMode.siteToBlock = [
                ...selectedMode.siteToBlock,
                urlToAdd,
              ];
              const storedModesToUpdate: any =
                await getAnObjectFromLocalStorage("modes");
              // replace mode in modes with selectedMode
              let modesToUpdate = storedModesToUpdate.find(
                (mode: any) => mode.name === selectedMode.name
              );
              modesToUpdate.siteToBlock = selectedMode.siteToBlock;
              writeAnObjectToLocalStorage("modes", storedModesToUpdate);
              setModes(storedModesToUpdate);
            }}
          >
            + Add site to block
          </button>

          <button
            style={{
              marginTop: 32,
            }}
            onClick={async () => {
              chrome.runtime.sendMessage({
                action: "setMode",
                data: {
                  mode: selectedMode,
                },
              });
              if (!selectedMode.tabsToOpen || selectedMode.tabsToOpen?.length === 0) {
                await chrome.tabs.create({ url: "chrome://newtab" });
              }
              selectedMode.tabsToOpen?.forEach((url) => {
                chrome.tabs.create({ url });
              });

              window.close();
            }}
          >
            Ok
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
