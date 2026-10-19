import { router, type Href } from 'expo-router';

export function go(href: string) {
  router.push(href as Href);
}

export function replaceTo(href: string) {
  router.replace(href as Href);
}
