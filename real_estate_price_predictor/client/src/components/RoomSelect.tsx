type RoomSelectProps = {
  id: string
  label: string
  options: number[]
  value: string
  onValueChange: (value: string) => void
}

export function RoomSelect({
  id,
  label,
  options,
  value,
  onValueChange,
}: RoomSelectProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
