import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';

import createRootReducer from '../store/reducers/rootReducer';
import actionTypes from '../store/actions/actionTypes';

// Manually define isDevelopment based on your build setup
const isDevelopment = process.env.NODE_ENV === 'development';

const reduxStateSyncConfig = {
    whitelist: [
        actionTypes.APP_START_UP_COMPLETE,
    ]
};

//export const history = createBrowserHistory({ basename: process.env.REACT_APP_ROUTER_BASE_NAME });

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [''], // Specify reducer state slices to persist
    // stateReconciler: autoMergeLevel2, // You might need to define this
};

const rootReducer = createRootReducer(history);

const middleware = [
    routerMiddleware(history),
    createStateSyncMiddleware(reduxStateSyncConfig),
];

if (isDevelopment) {
    middleware.push(createLogger());
}

const composeEnhancers = (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxStore = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middleware)),
);

export const persistor = persistStore(reduxStore);

export default reduxStore;
