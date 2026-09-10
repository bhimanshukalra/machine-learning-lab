import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'

type Classification = {
  class: string
  class_probability: Record<string, number>
}

function App() {
  const [imageData, setImageData] = useState('')
  const [imageName, setImageName] = useState('')
  const [results, setResults] = useState<Classification[]>([])
  const [error, setError] = useState('')
  const [isClassifying, setIsClassifying] = useState(false)

  const topResult = results[0]
  const probabilities = useMemo(() => {
    if (!topResult) {
      return []
    }

    return Object.entries(topResult.class_probability).sort(
      ([, firstProbability], [, secondProbability]) =>
        secondProbability - firstProbability,
    )
  }, [topResult])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    setResults([])
    setError('')

    if (!file) {
      setImageData('')
      setImageName('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageData(String(reader.result))
      setImageName(file.name)
    }
    reader.onerror = () => {
      setImageData('')
      setImageName('')
      setError('Unable to read the selected image.')
    }
    reader.readAsDataURL(file)
  }

  const classifyImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setResults([])

    if (!imageData) {
      setError('Choose an image before classifying.')
      return
    }

    const formData = new FormData()
    formData.append('image_data', imageData)

    try {
      setIsClassifying(true)
      const response = await fetch('/api/classify_image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Unable to classify the image.')
      }

      const data = (await response.json()) as Classification[]

      if (data.length === 0) {
        setError('No clear face with two eyes was found in this image.')
        return
      }

      setResults(data)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to classify the image.',
      )
    } finally {
      setIsClassifying(false)
    }
  }

  return (
    <main className="app">
      <section className="classifier">
        <div className="heading">
          <p className="eyebrow">Sports person classifier</p>
          <h1>Upload an Image</h1>
        </div>

        <form className="upload-form" onSubmit={classifyImage}>
          <label className="upload-control" htmlFor="image">
            <span>{imageName || 'Choose image'}</span>
            <input
              id="image"
              accept="image/*"
              type="file"
              onChange={handleImageChange}
            />
          </label>

          {imageData && (
            <img className="preview" src={imageData} alt="Selected upload" />
          )}

          <button type="submit" disabled={!imageData || isClassifying}>
            {isClassifying ? 'Classifying...' : 'Classify Image'}
          </button>
        </form>

        {error && <p className="message error">{error}</p>}

        {topResult && (
          <section className="result">
            <p className="prediction">Prediction: {topResult.class}</p>

            <div className="probabilities">
              {probabilities.map(([className, probability]) => (
                <div className="probability" key={className}>
                  <div className="probability-label">
                    <span>{className}</span>
                    <strong>{probability}%</strong>
                  </div>
                  <div className="probability-track">
                    <div
                      className="probability-fill"
                      style={{ width: `${probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
