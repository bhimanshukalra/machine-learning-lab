type AreaFieldProps = {
  area: string
  onAreaChange: (area: string) => void
}

export function AreaField({ area, onAreaChange }: AreaFieldProps) {
  return (
    <div className="field">
      <label htmlFor="area">Area</label>
      <input
        id="area"
        inputMode="decimal"
        min="1"
        placeholder="Enter total square feet"
        type="number"
        value={area}
        onChange={(event) => onAreaChange(event.target.value)}
      />
    </div>
  )
}
