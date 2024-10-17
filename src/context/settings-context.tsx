import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// import isEqual from 'lodash.isequal';
import { isEqual } from "lodash";

const STORAGE_KEY = "app.settings";

let storage: MemoryStorage | Storage;

class MemoryStorage {
  get length() {
    return this.store.size;
  }

  store = new Map();

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: unknown) {
    this.store.set(key, value);
  }

  key(index: number) {
    return Array.from(this.store.values())[index] || null;
  }
}

try {
  storage = globalThis.localStorage;
} catch (err) {
  console.error("[Settings Context] Local storage is not available", err);
  storage = new MemoryStorage();
}

const restoreSettings = () => {
  let value = null;

  try {
    const restored = storage.getItem(STORAGE_KEY);

    if (restored) {
      value = JSON.parse(restored);
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return value;
};

const deleteSettings = () => {
  storage.removeItem(STORAGE_KEY);
};

const storeSettings = (value: unknown) => {
  storage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const initialSettings = {
  direction: "ltr",
  paletteMode: "light",
  pinNav: true,
};

const initialState = {
  ...initialSettings,
  isInitialized: false,
};

export const SettingsContext = createContext({
  ...initialState,
  handleReset: (settings: unknown) => {
    console.log(settings);
  },
  handleUpdate: (settings: unknown) => {
    console.log(settings);
  },
  isCustom: false,
});

type SettingsProviderPropTypes = {
  children: ReactNode;
};

export const SettingsProvider = (props: SettingsProviderPropTypes) => {
  const { children } = props;
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const restored = restoreSettings();

    if (restored) {
      setState((prevState) => ({
        ...prevState,
        ...(restored as object),
        isInitialized: true,
      }));
    }
  }, []);

  const handleReset = useCallback(() => {
    deleteSettings();
    setState((prevState) => ({
      ...prevState,
      ...initialSettings,
    }));
  }, []);

  const handleUpdate = useCallback((settings: unknown) => {
    setState((prevState) => {
      storeSettings({
        direction: prevState.direction,
        paletteMode: prevState.paletteMode,
        pinNav: prevState.pinNav,
        ...(settings as object),
      });

      return {
        ...prevState,
        ...(settings as object),
      };
    });
  }, []);

  const isCustom = useMemo(() => {
    return !isEqual(initialSettings, {
      direction: state.direction,
      paletteMode: state.paletteMode,
      pinNav: state.pinNav,
    });
  }, [state]);

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        handleReset,
        handleUpdate,
        isCustom,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export const SettingsConsumer = SettingsContext.Consumer;
