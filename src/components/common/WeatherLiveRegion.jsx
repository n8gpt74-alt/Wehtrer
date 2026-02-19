/**
 * Weather Live Region Component
 * Объявляет обновления погоды для screen reader
 */
const WeatherLiveRegion = ({ data }) => {
  if (!data) return null;

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
    >
      {data && (
        <>
          Текущая температура {Math.round(data.temperature)} градусов.
          {data.condition?.label}.
          Ощущается как {Math.round(data.feelsLike)} градусов.
          Влажность {data.humidity} процентов.
          Ветер {Math.round(data.windSpeed)} метров в секунду.
          {data.windDirectionLabel && `, направление ${data.windDirectionLabel}`}.
          Давление {Math.round(data.pressure * 0.75)} миллиметров ртутного столба.
          Видимость {Math.round(data.visibility)} километров.
        </>
      )}
    </div>
  );
};

export default WeatherLiveRegion;
