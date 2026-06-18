import { PERSIST_STORE_NAME } from 'constants/app.constant'
import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { IS_DEV } from 'utils/env'

const middlewares = []

const persistConfig = {
    key: PERSIST_STORE_NAME,
    keyPrefix: '',
    storage,
    whitelist: ['auth', 'locale'],
}

const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer()),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }).concat(middlewares),
    devTools: IS_DEV,
})

store.asyncReducers = {}

export const persistor = persistStore(store)

export const injectReducer = (key, reducer) => {
    if (store.asyncReducers[key]) {
        return false
    }
    store.asyncReducers[key] = reducer
    store.replaceReducer(
        persistReducer(persistConfig, rootReducer(store.asyncReducers))
    )
    persistor.persist()
    return store
}

export const removeReducer = (key) => {
    if (!store.asyncReducers[key]) { return false }
    delete store.asyncReducers[key]
    store.replaceReducer(persistReducer(persistConfig, rootReducer(store.asyncReducers)))
    persistor.persist()
    return store
}

export default store
