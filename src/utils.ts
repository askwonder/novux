import { set, get } from 'lodash';

/**
 * resetState
 * @param	{Object}	initialState object with the reducer's initial state
 * @param	{Object} 	state object with the reducer's initial state
 * @param	{Array} 	keys array of strings representing keys or paths to keys to reset
 * @return {Object} 	an object with the completely or partially resetted state
 */
export const resetState = <T extends object>(initialState: T, state: T, nextState: string[]): T => {
  const newState = { ...state };

  nextState.forEach((key) => {
    set(newState, key, get(initialState, key));
  });

  return newState;
};
