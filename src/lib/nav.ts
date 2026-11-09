import { router, type Href } from 'expo-router';

export function go(href: string) {
  router.push(href as Href);
}

export function replaceTo(href: string) {
  router.replace(href as Href);
}

/** Back if there is a screen to go back to, otherwise Today. */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)/today' as Href);
}
