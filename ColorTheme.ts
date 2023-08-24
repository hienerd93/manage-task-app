import * as React from 'react';
import {Appearance} from 'react-native';
import type {ColorValue} from 'react-native/Libraries/StyleSheet/StyleSheet';

export type RNTheme = {
  TextColor: ColorValue;
  PlaceholderTextColor: ColorValue;
  BackgroundColor: ColorValue;
  BorderColor: ColorValue;
};

export const RNLightTheme: RNTheme = {
  TextColor: 'black',
  PlaceholderTextColor: 'black',
  BackgroundColor: 'white',
  BorderColor: 'black',
};

export const RNDarkTheme: RNTheme = {
  TextColor: 'white',
  PlaceholderTextColor: 'white',
  BackgroundColor: 'black',
  BorderColor: 'white',
};

export const themes = {light: RNLightTheme, dark: RNDarkTheme};
export const RNThemeContext: React.Context<RNTheme> = React.createContext(
  Appearance.getColorScheme() === 'dark' ? themes.dark : themes.light,
);
