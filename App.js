import React, {useEffect, useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';


const API_KEY = 'af33b034218f1ab52064bef50d25ee7d';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(false)
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city)
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr`)
    const json = await res.json()
    console.log(json.daily)
    setDays(json.daily)

  }

  useEffect(() => {
    console.log('aaaa', process.env.REACT_APP_APP_KEY)
    getWeather()
  }, [])

  return (

    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{marginTop: 10}} />
          </View>
        ): (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{ width:"100%", flexDirection: 'row', alignItems: "flex-end", justifyContent: "space-between"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={58} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))

        )}


      </ScrollView>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },

  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  cityName: {
    fontSize:64,
    fontWeight: "500",
    color: "#fff"
  },

  weather: {
    // flex: 3,
  },

  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },

  temp: {
    marginTop: 50,
    fontSize: 100,
    color: "#fff",
  },

  description: {
    marginTop: -10,
    fontSize: 30,
    color: "#fff",
    fontWeight: "500",
  },

  tinyText: {
    marginTop: 10,
    fontSize: 25,
    color: "#fff",
    fontWeight: "500",
  },
});
