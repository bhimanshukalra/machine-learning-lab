import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type LocationsResponse = {
  locations: string[]
}

type EstimateResponse = {
  estimated_price: number
}

export const roomOptions = [1, 2, 3, 4, 5]

export function usePriceEstimator() {
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

  return {
    area,
    bath,
    bhk,
    estimateError,
    estimatePrice,
    estimatedPrice,
    isEstimating,
    isLoadingLocations,
    locationError,
    locations,
    selectedLocation,
    setArea,
    setBath,
    setBhk,
    setSelectedLocation,
  }
}
