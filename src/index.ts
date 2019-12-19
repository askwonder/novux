import { resetState } from './utils';

interface BaseState {
  _lastAction?: string;
}

interface ResetKeyList {
  reset: string[];
}

interface UpdateAction<T> {
  type: typeof UPDATE;
  reducer: string;
  tag: string;
  state: Partial<T>;
}

interface ResetAction<T> {
  type: typeof RESET;
  reducer: string;
  tag: string;
  state: ResetKeyList;
}

export const UPDATE = 'UPDATE';
export const RESET = 'RESET';

/**
* update
* @param	{String}	reducer	the name of the reducer to update
* @param	{String}	tag	a short description of the update
* @param	{Object}	state the keys to update
* @return {Object} 	an action creator object
*/
export const update = <T>(reducer: string, tag: string, state: Partial<T>): UpdateAction<T> => ({
	type: UPDATE,
	reducer,
	tag,
	state,
});

/**
* reset
* @param	{String}	reducer	the name of the reducer to reset
* @param	{String}	tag	a short description of the reset
* @param	{Object}	state the keys to reset
* @return {Object} 	an action creator object
*/
export const reset = <T>(reducer: string, tag: string, state: ResetKeyList): ResetAction<T> => ({
	type: RESET,
	reducer,
	tag,
	state,
});

export type Action<T> = UpdateAction<T> | ResetAction<T>; 

export type Reducer<T> = (state: T | undefined, action: Action<T>) => T & { _lastAction?: string };

/**
* createReducer
* @param	{String}	name	the reducer's name
* @param	{Object}	initialState	the reducer's initial state
* @return {Function} a createReducer function which handles update & reset actions
*/
export const createReducer = <T extends object>(name: string, initialState: T): Reducer<T> => (state: T = initialState, action: Action<T>) => {
	if (typeof name !== 'string') {
		throw new Error('Expected reducer name to be a string');
	}
	if (typeof initialState !== 'object') {
		throw new Error('Expected initialState to be an object');
	}
	if (typeof state !== 'object') {
		throw new Error('Expected state to be an object');
	}
	if (typeof action !== 'object') {
		throw new Error('Expected action to be an object');
	}
	if (action.type === RESET && !Array.isArray(action.state.reset)) {
		throw new Error('expected reset options to be an array');
	}

	switch (action.type) {
	case UPDATE:
		if (action.reducer === name) {
			const nextState = action.state;
			return {
				...state,
				...nextState,
				_lastAction: action.tag,
			};
		}
		return state;

	case RESET:
		if (action.reducer === name) {
			const nextState = action.state.reset;
			if (nextState.length === 0) { return initialState; }
			const resettedState = resetState(initialState, state, nextState);
			return {
				...resettedState,
				_lastAction: action.tag,
			};
		}
		return state;

	default:
		return state;
	}
};

const novaRedux = {
	createReducer,
	update,
	reset,
}

export default novaRedux;
