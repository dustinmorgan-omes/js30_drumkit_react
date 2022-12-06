import React, { useState } from "react";
import "./App.css";
import boom from "./sounds/boom.wav";
import clap from "./sounds/clap.wav";
import hihat from "./sounds/hihat.wav";
import kick from "./sounds/kick.wav";
import openhat from "./sounds/openhat.wav";
import ride from "./sounds/ride.wav";
import snare from "./sounds/snare.wav";
import tink from "./sounds/tink.wav";
import tom from "./sounds/tom.wav";

function AddSounds(props) {
  return (
    <div id="add-sounds">
      <select id="sound-select">
        <option value="boom" data-import={boom}>
          Boom
        </option>
        <option value="clap" data-import={clap}>
          Clap
        </option>
        <option value="hihat" data-import={hihat}>
          High Hat
        </option>
        <option value="kick" data-import={kick}>
          Kick
        </option>
        <option value="openhat" data-import={openhat}>
          Open Hat
        </option>
        <option value="ride" data-import={ride}>
          Ride
        </option>
        <option value="snare" data-import={snare}>
          Snare
        </option>
        <option value="tink" data-import={tink}>
          Tink
        </option>
        <option value="tom" data-import={tom}>
          Tom
        </option>
      </select>
      <h1 id="keyAssignment">Press Any Key</h1>
      <button
        id="add-sound"
        onClick={() => {
          const e = document.getElementById("sound-select");
          const text = e.options[e.selectedIndex].text;
          const src = e.options[e.selectedIndex].dataset.import;
          const soundAssignField = document.querySelector(`#keyAssignment`);

          //Check if that key has already been assigned to another sound
          let alreadyAssigned = false;
          for (let i = 0; i < props.soundKeyPairs.length; i++) {
            if (props.soundKeyPairs[i].dataKey === soundAssignField.innerHTML) {
              alreadyAssigned = true;
            }
          }

          //If key is already assigned, or soundAssignField length is invalid, adjust message displayed, else add to state
          if (alreadyAssigned) {
            soundAssignField.innerHTML =
              "That key has already been assigned to another sound!";
          } else if (
            soundAssignField.innerHTML.length < 2 ||
            soundAssignField.innerHTML.length > 3
          ) {
            soundAssignField.innerHTML = "Press Any Key";
          } else {
            props.setSoundKeyPairs((current) => [
              ...current,
              {
                //Fix this, can't be hardcoded
                name: text,
                sound: src,
                dataKey: soundAssignField.innerHTML,
              },
            ]);
          }
        }}
      >
        Add
      </button>
    </div>
  );
}

function App() {
  const [soundKeyPairs, setSoundKeyPairs] = useState([]);

  //On change, reapply event listener to key elements
  React.useEffect(() => {
    console.log("hey");
    window.addEventListener("keydown", function (e) {
      const element = document.querySelector(`div[data-key="${e.keyCode}"]`);
      const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
      const soundAssignField = document.querySelector(`#keyAssignment`);
      soundAssignField.innerHTML = e.keyCode;

      if (!audio) return;

      audio.currentTime = 0; //rewind to start
      audio.play();

      element.classList.add("playing");
    });

    function removeTransition(e) {
      e.target.classList.remove("playing");
    }

    const keys = document.querySelectorAll(".key");
    keys.forEach((key) =>
      key.addEventListener("transitionend", removeTransition)
    );
  });

  //To do: Make the .keys div its own component, pass soundKeyPairs as props
  return (
    <div className="App">
      <AddSounds
        soundKeyPairs={soundKeyPairs}
        setSoundKeyPairs={setSoundKeyPairs}
      />
      <div className="keys">
        {soundKeyPairs.map((sound) => (
          <div data-key={sound.dataKey} className="key">
            <kbd>{String.fromCharCode(sound.dataKey)}</kbd>
            <span className="sound">{sound.name}</span>
            <audio
              data-key={sound.dataKey}
              crossOrigin="anonymous"
              src={sound.sound}
            ></audio>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
