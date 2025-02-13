type TransitionProps = {
  from: string;
  to: string;
  duration: number;
  onDurationChange: (newDuration: number) => void;
};

export default function TransitionRow({ from, to, duration, onDurationChange }: TransitionProps) {
  return (
    <tr className="border border-gray-300 bg-gray-100">
      <td className="border border-gray-300 px-4 py-2 text-center" colSpan={2}>
        TR {from} ➝ {to}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <input
          type="number"
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="w-full border p-1"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2"></td>
    </tr>
  );
}