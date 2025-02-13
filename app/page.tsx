"use client"

import React from "react"
import { useState } from "react"
import Image from "next/image"
import SceneRow from "./components/SceneRow"
import TransitionRow from "./components/TransitionRow"

type Scene = {
  id: number
  name: string
  duration: number
}

export default function ShowPage() {
  const [scenes, setScenes] = useState<Scene[]>([{ id: 1, name: "Scene 1", duration: 30 }])
  const [transitions, setTransitions] = useState<{ from: string; to: string; duration: number }[]>([])

  const [saveMessage, setSaveMessage] = useState("")

  const addScene = (id: number) => {
    setScenes((prevScenes) => {
      const index = prevScenes.findIndex((scene) => scene.id === id)
      if (index === -1) return prevScenes

      const newId = Math.max(...prevScenes.map((s) => s.id)) + 1
      const newScene: Scene = { id: newId, name: `Scene ${newId}`, duration: 30 }

      const updatedScenes = [...prevScenes]
      updatedScenes.splice(index + 1, 0, newScene)

      return updatedScenes
    })

    setTransitions((prevTransitions) => {
      const updatedTransitions = [...prevTransitions]
      const index = scenes.findIndex((scene) => scene.id === id)

      if (index !== -1) {
        const newTransition = {
          from: scenes[index].name,
          to: `Scene ${Math.max(...scenes.map((s) => s.id)) + 1}`,
          duration: 10,
        }

        updatedTransitions.splice(index, 0, newTransition)
        if (index < scenes.length - 1) {
          updatedTransitions[index + 1] = {
            ...updatedTransitions[index + 1],
            from: newTransition.to,
          }
        }
      }

      return updatedTransitions
    })
  }

  const removeScene = (id: number) => {
    setScenes((prevScenes) => {
      return prevScenes.filter((scene) => scene.id !== id)
    })

    setTransitions((prevTransitions) => {
      const sceneIndex = scenes.findIndex((scene) => scene.id === id)
      const updatedTransitions = [...prevTransitions]

      if (sceneIndex > 0 && sceneIndex < scenes.length - 1) {
        updatedTransitions[sceneIndex - 1] = {
          from: scenes[sceneIndex - 1].name,
          to: scenes[sceneIndex + 1].name,
          duration: updatedTransitions[sceneIndex - 1].duration,
        }
        updatedTransitions.splice(sceneIndex, 1)
      } else if (sceneIndex === 0 && scenes.length > 1) {
        updatedTransitions.splice(0, 1)
      } else if (sceneIndex === scenes.length - 1 && scenes.length > 1) {
        updatedTransitions.pop()
      }

      return updatedTransitions
    })
  }

  const updateSceneName = (id: number, newName: string) => {
    setScenes((prevScenes) => prevScenes.map((scene) => (scene.id === id ? { ...scene, name: newName } : scene)))

    setTransitions((prevTransitions) =>
      prevTransitions.map((transition) => {
        const sceneIndex = scenes.findIndex((scene) => scene.id === id)
        if (sceneIndex === -1) return transition

        if (sceneIndex > 0 && transition.to === scenes[sceneIndex].name) {
          return { ...transition, to: newName }
        }
        if (sceneIndex < scenes.length - 1 && transition.from === scenes[sceneIndex].name) {
          return { ...transition, from: newName }
        }
        return transition
      }),
    )
  }

  const updateSceneDuration = (id: number, newDuration: number) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene) => (scene.id === id ? { ...scene, duration: newDuration } : scene)),
    )
  }

  const updateTransitionDuration = (index: number, newDuration: number) => {
    setTransitions((prevTransitions) =>
      prevTransitions.map((transition, i) => (i === index ? { ...transition, duration: newDuration } : transition)),
    )
  }

  const resetScenes = () => {
    setScenes([{ id: 1, name: "Scene 1", duration: 30 }])
    setTransitions([])
  }

  const loadExampleScenes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/data")
      const data = await response.json()
      setScenes(data.scenes)
      setTransitions(data.transitions)
    } catch (error) {
      console.error("Error fetching data from backend:", error)
    }
  }

  const saveScenes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenes,
          transitions: transitions.map((t) => ({
            from: t.from,
            to: t.to,
            duration: t.duration,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      console.log("Server response:", data)
      setSaveMessage("Data saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Error saving data:", error)
      setSaveMessage("Error saving data!")
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-[#263d5c] mb-5 flex items-center">
        Show Planner
        <Image src="/Logo-allumee.jpg" alt="Allumée Logo" width={48} height={48} className="ml-2" />
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
                    order={index + 1}
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
                  <button onClick={() => addScene(1)} className="bg-green-500 text-white px-4 py-2 rounded">
                    + Add Scene
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-start mt-4 gap-4">
          <button onClick={resetScenes} className="bg-red-500 text-white px-4 py-2 rounded">
            Reset
          </button>
          <button onClick={loadExampleScenes} className="bg-blue-500 text-white px-4 py-2 rounded">
            Load
          </button>
          <button onClick={saveScenes} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
          {saveMessage && <p className="text-green-500">{saveMessage}</p>}
        </div>
      </section>
    </main>
  )
}