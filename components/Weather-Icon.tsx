import React from 'react';
import { View } from 'react-native';

import Clear from '../assets/icons/clear.svg';
import Sunny from '../assets/icons/sunny.svg';
import Cloudy from '../assets/icons/cloudy.svg';
import CloudySun from '../assets/icons/cloudy-sun.svg';
import Rain from '../assets/icons/rain.svg';
import RainSun from '../assets/icons/rain-sun.svg';
import Snow from '../assets/icons/snow.svg';
import SnowSun from '../assets/icons/snow-sun.svg';
import Thunderstorm from '../assets/icons/thunderstorm.svg';
import ThunderstormSun from '../assets/icons/thunderstorm-sun.svg';
import Fog from '../assets/icons/fog.svg';

type Props = {
  condition: string;
  isDay: boolean;
  size?: number;
};

export default function WeatherIcon({ condition, isDay, size = 80 }: Props) {
  const getIcon = () => {
    switch (condition) {
      case 'Clear':
        return isDay ? <Sunny width={size} height={size} /> : <Clear width={size} height={size} />;

      case 'Clouds':
        return isDay ? <CloudySun width={size} height={size} /> : <Cloudy width={size} height={size} />;

      case 'Rain':
      case 'Drizzle':
        return isDay ? <RainSun width={size} height={size} /> : <Rain width={size} height={size} />;

      case 'Snow':
        return isDay ? <SnowSun width={size} height={size} /> : <Snow width={size} height={size} />;

      case 'Thunderstorm':
        return isDay
          ? <ThunderstormSun width={size} height={size} />
          : <Thunderstorm width={size} height={size} />;

      case 'Mist':
      case 'Fog':
      case 'Haze':
        return <Fog width={size} height={size} />;

      default:
        return <Sunny width={size} height={size} />;
    }
  };

  return <View>{getIcon()}</View>;
}