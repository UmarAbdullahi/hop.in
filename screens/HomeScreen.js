import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useDispatch } from "react-redux";
import { setOrigin } from "../slices/navSlice";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import NavFavourites from "../components/NavFavourites";
import axios from "axios";

const HomeScreen = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      try {
        const loadData = async () => {
          {
            const response = await axios.get(
              `https://api.locationiq.com/v1/autocomplete.php?key=pk.c44e97d8fe6625ec0354e739a223945c&q=${query}&limit=5`
            );

            setSuggestions(response.data.slice(0, 3));
          }
        };

        query.length > 2 && loadData();
      } catch (error) {
        console.log(error);
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  const changeHandler = (text) => {
    setQuery(text);
  };

  const alertHandler = () => {
    alert("HEI");
  };

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`mx-5 mt-10`}>
        <Text style={tw`text-4xl py-6 font-bold text-black`}>HOP.IN</Text>
        <TextInput
          placeholder="From Where? (approximate location)"
          style={tw`p-3 my-2 text-base border border-gray-200 rounded-md text-black`}
          onChangeText={(input) => changeHandler(input)}
          value={query}
        />

        {suggestions && (
          <View style={tw``}>
            <FlatList
              data={suggestions}
              keyExtractor={(_, id) => id.toString()}
              renderItem={({ item }) => (
                <View style={tw`flex-row my-1 p-5 bg-gray-100`}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        setOrigin({
                          lat: parseInt(item.lat),
                          lng: parseInt(item.lon),
                        })
                      );
                      setSuggestions([]);
                    }}
                  >
                    <Text>{item.display_name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </View>

      <View style={tw`mx-5`}>
        <NavOptions />
        <Text style={tw` text-base mt-10 font-bold text-gray-400`}>
          Saved addresses
        </Text>
        <NavFavourites />
      </View>
      <View style={tw` mx-5 my-1`}>
        <TouchableOpacity
          style={tw`border border-yellow-500 py-2`}
          onPress={alertHandler}
        >
          <Text style={tw`text-center text-yellow-500 font-bold text-lg`}>
            Instructions for beta users
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;