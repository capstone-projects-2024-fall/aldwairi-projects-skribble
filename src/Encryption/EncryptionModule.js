import { NativeModules } from 'react-native';

const { MyModule } = NativeModules;

export const myMethod = async (param) => {
  try {
    const result = await MyModule.myMethod(param);
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};