"use client";

import React from "react";
import { useState } from "react";
import SceneRow from "./components/SceneRow";
import TransitionRow from "./components/TransitionRow";

type Scene = {
  id: number;
  name: string;
  duration: number;
};

export default function ShowPage() {
  const [scenes, setScenes] = useState<Scene[]>([
    { id: 1, name: "Scene 1", duration: 30 },
  ]);
  const [transitions, setTransitions] = useState<{ from: string; to: string; duration: number }[]>([]);

  const [saveMessage, setSaveMessage] = useState("");

  const addScene = () => {
    const newId = scenes.length + 1;
    const newScene: Scene = { id: newId, name: `Scene ${newId}`, duration: 30 };
    setScenes((prevScenes) => [...prevScenes, newScene]);

    if (scenes.length > 0) {
      const lastScene = scenes[scenes.length - 1];

      setTransitions((prevTransitions) => [
        ...prevTransitions,
        { from: lastScene.name, to: newScene.name, duration: 10 },
      ]);
    }
  };

  const removeScene = (id: number) => {
    setScenes((prevScenes) => {
      const updatedScenes = prevScenes
        .filter((scene) => scene.id !== id)
        .map((scene, index) => ({
          ...scene,
          id: index + 1,
        }));
  
      return updatedScenes;
    });
  
    setTransitions((prevTransitions) =>
      prevTransitions
        .filter((transition) => transition.from !== `Scene ${id}` && transition.to !== `Scene ${id}`)
        .map((transition) => ({
          ...transition,
          from: transition.from.replace(/\d+/, (num) => (parseInt(num) > id ? parseInt(num) - 1 : parseInt(num)).toString()),
          to: transition.to.replace(/\d+/, (num) => (parseInt(num) > id ? parseInt(num) - 1 : parseInt(num)).toString()),
        }))
    );
  };
  

  const updateSceneName = (id: number, newName: string) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) =>
        scene.id === id ? { ...scene, name: newName } : scene
      )
    );
  
    setTransitions((prevTransitions) =>
      prevTransitions.map((transition) => {
        const sceneFrom = scenes.find((scene) => scene.name === transition.from);
        const sceneTo = scenes.find((scene) => scene.name === transition.to);
  
        return {
          ...transition,
          from: sceneFrom?.id === id ? newName : transition.from,
          to: sceneTo?.id === id ? newName : transition.to,
        };
      })
    );
  };
  

  const updateSceneDuration = (id: number, newDuration: number) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) => (scene.id === id ? { ...scene, duration: newDuration } : scene))
    );
  };

  const updateTransitionDuration = (index: number, newDuration: number) => {
    setTransitions((prevTransitions) =>
      prevTransitions.map((transition, i) =>
        i === index ? { ...transition, duration: newDuration } : transition
      )
    );
  };  

  const resetScenes = () => {
    setScenes([{ id: 1, name: "Scene 1", duration: 30 }]);
    setTransitions([]);
  };

  const loadExampleScenes = () => {
    const savedData = localStorage.getItem("showData");
  
    if (savedData) {
      const { scenes: savedScenes, transitions: savedTransitions } = JSON.parse(savedData);
      setScenes(savedScenes);
      setTransitions(savedTransitions);
    } else {
      setScenes([
        { id: 1, name: "Torche", duration: 30 },
        { id: 2, name: "Phoenix", duration: 45 },
        { id: 3, name: "Logo", duration: 60 },
      ]);
  
      setTransitions([
        { from: "Torche", to: "Phoenix", duration: 12 },
        { from: "Phoenix", to: "Logo", duration: 19 },
      ]);
    }
  };
  

  const saveScenes = () => {
    const data = {
      scenes,
      transitions,
    };

    localStorage.setItem("showData", JSON.stringify(data)); 

    setSaveMessage("Data saved successfully!");

    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  }
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-[#263d5c] mb-5 flex items-center">
        Show Planner
        <img src="Logo-allumee.jpg" alt="Allumée Logo" 
        className="h-12 w-12 inline-block ml-2"
        />
        </h1>
        

      <section className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Scenes and Transitions</h2>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Order</th>
              <th className="border border-gray-300 px-4 py-2">Scene Name</th>
              <th className="border border-gray-300 px-4 py-2">Duration (s)</th>
            </tr>
          </thead>
          <tbody>
          {scenes.length > 0 ? (
          scenes.map((scene, index) => (
            <React.Fragment key={scene.id}>
              <SceneRow
                key={`scene-${scene.id}`}
                {...scene}
                isLast={index === scenes.length - 1}
                onNameChange={updateSceneName}
                onDurationChange={updateSceneDuration}
                onRemove={removeScene}
                onAdd={addScene}
              />
              {index < transitions.length && (
              <TransitionRow
                key={`transition-${index}`}
                {...transitions[index]}
                onDurationChange={(newDuration) => updateTransitionDuration(index, newDuration)}
              />
            )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center p-4">
              <button
                onClick={addScene}
                className="bg-green-500 text-white px-4 py-2 rounded">
                + Add Scene
              </button> 
            </td>
          </tr>
        )}
        </tbody>
        </table>
        <div className="flex justify-start mt-4 gap-4">
          <button
            onClick={resetScenes}
            className="bg-red-500 text-white px-4 py-2 rounded">
            Reset 
          </button>
          <button
            onClick={loadExampleScenes}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Load
          </button>
          <button
            onClick={saveScenes}
            className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          {saveMessage && <p className="text-green-500">{saveMessage}</p>}
        </div>
      </section>
    </main>
  );
}