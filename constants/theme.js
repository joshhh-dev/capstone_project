import { Dimensions } from "react-native";
const { height, width } = Dimensions.get('window')

export const COLORS = {
    primary: '#7C9A92',
    white:  "#FFFFFF",
    background: "#F6F1E3",
    grey: "#BEC2C2",
    black: "#000000",
}

export const SIZE = {
    //global size
    base: 8,
    font: 14,
    radius: 30,
    padding: 8,
    padding2: 12,
    padding3: 20,

    //font sizes
    largeTitle: 50,
    h1: 30,
    h2: 22,
    h3: 20,
    h4: 18,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    //app dimentsions
    width,
    height,
}