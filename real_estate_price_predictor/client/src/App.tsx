import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type LocationsResponse = {
  locations: string[]
}

type EstimateResponse = {
  estimated_price: number
}

const roomOptions = [1, 2, 3, 4, 5]

function App() {
  const [locations, setLocations] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [area, setArea] = useState('')
  const [bhk, setBhk] = useState('1')
  const [bath, setBath] = useState('1')
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)
  const [locationError, setLocationError] = useState('')
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [estimateError, setEstimateError] = useState('')
  const [isEstimating, setIsEstimating] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/get_location_name')

        if (!response.ok) {
          throw new Error('Unable to fetch locations')
        }

        const data = (await response.json()) as LocationsResponse
        setLocations(data.locations)
        setSelectedLocation(data.locations[0] ?? '')
      } catch (error) {
        setLocationError(
          error instanceof Error ? error.message : 'Unable to fetch locations',
        )
      } finally {
        setIsLoadingLocations(false)
      }
    }

    fetchLocations()
  }, [])

  const estimatePrice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setEstimatedPrice(null)
    setEstimateError('')

    if (!area || !selectedLocation) {
      setEstimateError('Please enter an area and select a location.')
      return
    }

    const formData = new FormData()
    formData.append('total_sqft', area)
    formData.append('location', selectedLocation)
    formData.append('bhk', bhk)
    formData.append('bath', bath)

    try {
      setIsEstimating(true)
      const response = await fetch('/api/predict_home_price', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Unable to estimate price')
      }

      const data = (await response.json()) as EstimateResponse
      setEstimatedPrice(data.estimated_price)
    } catch (error) {
      setEstimateError(
        error instanceof Error ? error.message : 'Unable to estimate price',
      )
    } finally {
      setIsEstimating(false)
    }
  }

  return (
    <main className="app">
      <section className="predictor">
        <div className="heading">
          <p className="eyebrow">Bengaluru home prices</p>
          <h1>Estimate a Property Price</h1>
        </div>

        <form className="form" onSubmit={estimatePrice}>
          <div className="field">
            <label htmlFor="area">Area</label>
            <input
              id="area"
              inputMode="decimal"
              min="1"
              placeholder="Enter total square feet"
              type="number"
              value={area}
              onChange={(event) => setArea(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>

            {isLoadingLocations && (
              <p className="status">Loading locations...</p>
            )}

            {!isLoadingLocations && locationError && (
              <p className="status error">{locationError}</p>
            )}

            {!isLoadingLocations && !locationError && (
              <select
                id="location"
                value={selectedLocation}
                onChange={(event) => setSelectedLocation(event.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="bhk">BHK</label>
              <select
                id="bhk"
                value={bhk}
                onChange={(event) => setBhk(event.target.value)}
              >
                {roomOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="bath">Bath</label>
              <select
                id="bath"
                value={bath}
                onChange={(event) => setBath(event.target.value)}
              >
                {roomOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoadingLocations || isEstimating || Boolean(locationError)}
          >
            {isEstimating ? 'Estimating...' : 'Estimate Price'}
          </button>

          {estimateError && <p className="result error">{estimateError}</p>}

          {estimatedPrice !== null && (
            <p className="result">Estimated price: {estimatedPrice} lakh</p>
          )}
        </form>
      </section>
    </main>
  )
}

export default App
