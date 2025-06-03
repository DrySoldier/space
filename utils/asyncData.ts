import AsyncStorage from '@react-native-async-storage/async-storage';
import log from './logger';

export const storeData = async (type, val) => {
  try {
    await AsyncStorage.setItem(`@SPACE:${type}`, String(val));
  } catch (error) {
    log(' ::: AsyncStorage Error - StoreData failed for ', type, val);
  }
};

export const retrieveData = async type => {
  try {
    const value = await AsyncStorage.getItem(`@SPACE:${type}`);
    log(`::: AsyncStorage retrieved for ${type} with value: ${value}`);
    return value;
  } catch (error) {
    log(' ::: AsyncStorage Error - Retriev/eData failed for ', type);
  }
};

export const removeData = async type => {
  try {
    const value = await AsyncStorage.removeItem(`@SPACE:${type}`);
    log(`::: AsyncStorage removed for ${type} with value: ${value}`);
    return value;
  } catch (error) {
    log(' ::: AsyncStorage Error - Remove data failed for ', type);
  }
};
