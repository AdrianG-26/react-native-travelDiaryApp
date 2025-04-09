import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
export type AddEntryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "AddEntry"
>;
