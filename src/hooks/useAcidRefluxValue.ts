import { Store } from "../Store";
import { useEffect, useState } from "react";
/**
 *
 * @param store Store to subscribe to
 * @param valueName Name of the state value to subscribe to
 * @returns Selected value
 */
export function useAcidRefluxValue<StoreStateType, indextype>(
    store: Store<StoreStateType>,
    valueName: keyof StoreStateType & indextype
): StoreStateType[typeof valueName] {

    const [v, setV] = useState<StoreStateType[typeof valueName]>(store.state[valueName]);
    useEffect(() => {
        const onValueUpdate = (newValue: typeof v) => {
            setV(newValue);
        };

        //
        store.subscribeToChanges(onValueUpdate, valueName as string);
        return () => {
            //
            store.unSubscribeToChanges(onValueUpdate, valueName as string);
        };
    }, [setV, valueName, store]);
    return v;
}
