import Sunny from "@/assets/icons/sunny.svg";
import Clear from "@/assets/icons/clear.svg";
import Cloudy from "@/assets/icons/cloudy.svg";
import CloudySun from "@/assets/icons/cloudy-sun.svg";
import Rain from "@/assets/icons/rain.svg";
import RainSun from "@/assets/icons/rain-sun.svg";
import Snow from "@/assets/icons/snow.svg";
import SnowSun from "@/assets/icons/snow-sun.svg";
import Thunder from "@/assets/icons/thunderstorm.svg";
import ThunderSun from "@/assets/icons/thunderstorm-sun.svg";
import Fog from "@/assets/icons/fog.svg";

export default function IconoDelClima({
  condition,
  isDay,
  size = 100,
}: {
  condition: string;
  isDay: boolean;
  size?: number;
}) {
  const pickIcon = () => {
    if (condition.includes("Sunny") || condition.includes("Clear"))
      return isDay ? Sunny : Clear;

    if (condition.includes("Cloud"))
      return isDay ? CloudySun : Cloudy;

    if (condition.includes("Rain") || condition.includes("Drizzle"))
      return isDay ? RainSun : Rain;

    if (condition.includes("Snow"))
      return isDay ? SnowSun : Snow;

    if (condition.includes("Thunder"))
      return isDay ? ThunderSun : Thunder;

    if (
      condition.includes("Mist") ||
      condition.includes("Fog") ||
      condition.includes("Haze")
    )
      return Fog;

    return Sunny;
  };

  const Icon = pickIcon();

  return <Icon width={size} height={size} />;
}
