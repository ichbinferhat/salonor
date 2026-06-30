import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * SSR-güvenli "tarayıcıda mıyız" bayrağı: sunucuda false, istemcide true döner —
 * `useState(false)+useEffect(()=>setMounted(true))` desenindeki setState-in-effect
 * (cascading render) olmadan, useSyncExternalStore ile. Portal / yalnızca-istemci
 * render'larında hydration uyumsuzluğunu önlemek için kullanılır.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // istemci snapshot
    () => false // sunucu snapshot
  );
}
