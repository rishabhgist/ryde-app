import { router } from "expo-router";

export const Router = {
  replace(url: string) {
    router.replace(url as ExpoRouter.CustomHref);
  },
  push(url: string) {
    router.push(url as ExpoRouter.CustomHref);
  },
  back() {
    router.back();
  },
};
