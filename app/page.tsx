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
    setScenes((prevScenes) => prevScenes.filter((scene) => scene.id !== id));
    setTransitions((prevTransitions) =>
      prevTransitions.filter((transition) => transition.from !== `Scene ${id}` && transition.to !== `Scene ${id}`)
    );
  };

  const updateSceneName = (id: number, newName: string) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) => (scene.id === id ? { ...scene, name: newName } : scene))
    );
  };

  const updateSceneDuration = (id: number, newDuration: number) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) => (scene.id === id ? { ...scene, duration: newDuration } : scene))
    );
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Show Planner 🎭</h1>

      <section className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Scenes and Transitions</h2>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Scene</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Duration (s)</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {scenes.map((scene, index) => (
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
                <TransitionRow onDurationChange={function (newDuration: number): void {
                  throw new Error("Function not implemented.");
                } } key={`transition-${index}`} {...transitions[index]} />
              )}
            </React.Fragment>
          ))}
        </tbody>
        </table>
      </section>
    </main>
  );
}