import { ViewStyle, TextStyle } from "react-native";

export const colors = {
  white: '#FFFFFF',
  black: '#000033',
  primaryBlue: '#0D74E7', // Just for details
  deepPurple: '#3333CC', // Primary brand colour
  lightBlueAccent: '#E5EBFB',
  textSecondary: '#666666',
};

export const sizes = {
  base: 8,
  small: 14,
  medium: 16,
  large: 22,
  title: 28,
};

export const buttons: {
  primary: ViewStyle;
  primaryText: TextStyle;
  secondary: ViewStyle;
  secondaryText: TextStyle;
} = {
  primary: {
    backgroundColor: colors.deepPurple,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },

  primaryText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: sizes.medium,
  },

  secondary: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  secondaryText: {
    color: colors.black,
    fontWeight: "600",
  },
};