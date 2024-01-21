import { useState } from "react"

function convertToCelsius(temp) {
    const result = temp - 273.15
    return Math.floor(result) + 1 + "°C"
}

function capitalizeText(text) {
    return text[0].toUpperCase() + text.substring(1)
}

export default function WeatherBox() {
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState()
    const [error, setError] = useState()
    const [city, setCity] = useState()

    const apiKey = import.meta.env.VITE_API_KEY

    async function getData(e) {
        e.preventDefault()
        setData(false)
        setLoading(true)
        setError(false)

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
            )
            const result = await response.json()
            setData({
                temperature: convertToCelsius(result.main.temp),
                maxTemperature: convertToCelsius(result.main.temp_max),
                minTemperature: convertToCelsius(result.main.temp_min),
                city: result.name,
                weather: result.weather[0].main,
                weatherDesc: capitalizeText(result.weather[0].description),
                iconCode: result.weather[0].icon,
            })
        } catch (error) {
            console.log(error)
            setError(true)
        }
    }

    function SetLoadingText() {
        if (loading) {
            if (error) {
                return "Please enter a valid city name."
            }
            return (
                <img src="https://samherbert.net/svg-loaders/svg-loaders/oval.svg" />
            )
        } else {
            return "Write a city name."
        }
    }

    return (
        <div className="flex min-h-96 w-96 flex-col items-center justify-between rounded-xl bg-zinc-800 p-4 font-sans text-white shadow-xl">
            <form className="flex gap-4" onSubmit={(e) => getData(e)}>
                <input
                    type="text"
                    placeholder="City name"
                    className="rounded border-none bg-zinc-600 px-4 py-2 text-white outline-none"
                    onChange={(e) => setCity(e.target.value.toLowerCase())}
                />
                <button
                    className="rounded bg-emerald-400 px-4 text-white hover:bg-emerald-500"
                    type="submit"
                >
                    Send
                </button>
            </form>

            <div className="flex h-1/2 flex-col items-center justify-between text-2xl">
                {data ? (
                    <>
                        <h1 className="text-3xl font-bold">
                            {data.temperature}
                        </h1>
                        <img
                            src={`https://openweathermap.org/img/wn/${data.iconCode}@2x.png`}
                            alt="ícone de tempo"
                        />
                        <h1 className="text-center">
                            {data.weatherDesc} on {data.city}
                        </h1>
                    </>
                ) : (
                    <SetLoadingText />
                )}
            </div>
            <div className="text-center">
                {data && (
                    <>
                        <h2>Minimum of: {data.minTemperature}</h2>
                        <h2>Maximum of: {data.maxTemperature}</h2>
                    </>
                )}
            </div>
        </div>
    )
}
