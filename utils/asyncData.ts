import AsyncStorage from '@react-native-async-storage/async-storage';

type TStorageKeys = 'HISCORE' | 'UUID' | 'MUTED';

export const storeData = async (type: TStorageKeys, val: unknown) => {
  try {
    await AsyncStorage.setItem(`@SPACE:${type}`, String(val));
  } catch (error) {
    console.log(' ::: AsyncStorage Error - StoreData failed for ', type, val);
  }
};

export const retrieveData = async (type: TStorageKeys) => {
  try {
    const value = await AsyncStorage.getItem(`@SPACE:${type}`);
    console.log(`::: AsyncStorage retrieved for ${type} with value: ${value}`);
    return value;
  } catch (error) {
    console.log(' ::: AsyncStorage Error - Retriev/eData failed for ', type);
  }
};

export const removeData = async (type: TStorageKeys) => {
  try {
    const value = await AsyncStorage.removeItem(`@SPACE:${type}`);
    console.log(`::: AsyncStorage removed for ${type} with value: ${value}`);
    return value;
  } catch (error) {
    console.log(' ::: AsyncStorage Error - Remove data failed for ', type);
  }
};
