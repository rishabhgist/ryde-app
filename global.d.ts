import { Href } from "expo-router";

declare global {
  namespace ExpoRouter {
    type CustomHref = Href<string | object>;
  }
}
