import React from "react";
import {Text, View} from "react-native";
// import { hello } from '../modules/expo-encryption';
import { hello } from '../modules/expo-encryption';

export default function Index() {

    console.log(hello());

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>hello()</Text>
        </View>
    );
}
