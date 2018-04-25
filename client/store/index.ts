import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import * as reducers from 'reducers'
import * as epics from 'epics'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const epicMiddleware = createEpicMiddleware(combineEpics(...<any> Object.values(epics)))
const reducer = combineReducers({ ...reducers })
const middlewares = composeEnhancers(applyMiddleware(epicMiddleware))

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['favourites']
}

export const store = createStore(
  persistReducer(persistConfig, reducer) as any,
  middlewares
)

export const persistor = persistStore(store)
