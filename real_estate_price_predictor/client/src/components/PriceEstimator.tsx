import { AreaField } from './AreaField'
import { LocationField } from './LocationField'
import { RoomSelect } from './RoomSelect'
import { roomOptions, usePriceEstimator } from '../hooks/usePriceEstimator'

export function PriceEstimator() {
  const {
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
  } = usePriceEstimator()

  return (
    <section className="predictor">
      <div className="heading">
        <p className="eyebrow">Bengaluru home prices</p>
        <h1>Estimate a Property Price</h1>
      </div>

      <form className="form" onSubmit={estimatePrice}>
        <AreaField area={area} onAreaChange={setArea} />

        <LocationField
          error={locationError}
          isLoading={isLoadingLocations}
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        <div className="field-grid">
          <RoomSelect
            id="bhk"
            label="BHK"
            options={roomOptions}
            value={bhk}
            onValueChange={setBhk}
          />

          <RoomSelect
            id="bath"
            label="Bath"
            options={roomOptions}
            value={bath}
            onValueChange={setBath}
          />
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
  )
}
