type LocationFieldProps = {
  error: string
  isLoading: boolean
  locations: string[]
  selectedLocation: string
  onLocationChange: (location: string) => void
}

export function LocationField({
  error,
  isLoading,
  locations,
  selectedLocation,
  onLocationChange,
}: LocationFieldProps) {
  return (
    <div className="field">
      <label htmlFor="location">Location</label>

      {isLoading && <p className="status">Loading locations...</p>}

      {!isLoading && error && <p className="status error">{error}</p>}

      {!isLoading && !error && (
        <select
          id="location"
          value={selectedLocation}
          onChange={(event) => onLocationChange(event.target.value)}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
