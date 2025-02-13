type SceneProps = {
  id: number
  order: number
  name: string
  duration: number
  isLast: boolean
  onNameChange: (id: number, newName: string) => void
  onDurationChange: (id: number, newDuration: number) => void
  onRemove: (id: number) => void
  onAdd: (id: number) => void
}

export default function SceneRow({
  id,
  order,
  name,
  duration,
  onNameChange,
  onDurationChange,
  onRemove,
  onAdd,
}: SceneProps) {
  return (
    <tr className="border border-gray-300">
      <td className="border border-gray-300 px-4 py-2 text-center">Scene {order}</td>
      <td className="border border-gray-300 px-4 py-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          className="w-full border p-1"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <input
          type="number"
          value={duration}
          onChange={(e) => onDurationChange(id, Number(e.target.value))}
          className="w-full border p-1"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        <button onClick={() => onRemove(id)} className="bg-red-500 text-white px-2 py-1 rounded">
          -
        </button>
        <button onClick={() => onAdd(id)} className="bg-green-500 text-white px-2 py-1 rounded ml-2">
          +
        </button>
      </td>
    </tr>
  )
}

