// Simple storage wrapper that uses MMKV when available,
// and falls back to in-memory storage (works in Expo Go).

type StorageLike = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

let storage: StorageLike;

try {
  // Dynamically require to avoid bundling errors in Expo Go
  // when native module isn't available.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { MMKV } = require('react-native-mmkv');
  storage = new MMKV();
} catch (_e) {
  const mem = new Map<string, string>();
  storage = {
    getString: (key: string) => mem.get(key),
    set: (key: string, value: string) => {
      mem.set(key, value);
    },
  };
}

export default storage;

