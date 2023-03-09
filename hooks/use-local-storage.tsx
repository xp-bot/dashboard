import { reduce } from 'lodash';
import { useEffect, useState } from 'react';

type TokenMap<T extends string> = { [K in T]?: string };
type TokenSetter<T extends string> = (
  key: T,
  value: string | undefined
) => void;

export const useLocalStorage = <T extends string>(
  tokens?: T[]
): [TokenMap<T>, TokenSetter<T>] => {
  const [storedTokens, setStoredTokens] = useState<TokenMap<T>>({});

  useEffect(() => {
    setStoredTokens(
      reduce(
        tokens,
        (result, token) => ({
          ...result,
          [token]: localStorage.getItem(token),
        }),
        {}
      )
    );
  }, []);

  const setToken: TokenSetter<T> = (key, value) => {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
    setStoredTokens({ ...storedTokens, [key]: value });
  };

  return [storedTokens, setToken];
};
