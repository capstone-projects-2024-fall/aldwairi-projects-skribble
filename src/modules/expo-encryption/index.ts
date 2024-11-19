import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to EncryptionModule.web.ts
// and on native platforms to EncryptionModule.ts
import EncryptionModule from './src/EncryptionModule';
import EncryptionModuleView from './src/EncryptionModuleView';
import { ChangeEventPayload, EncryptionModuleViewProps } from './src/EncryptionModule.types';

// Get the native constant value.
export const PI = EncryptionModule.PI;

export function hello(): string {
  return EncryptionModule.hello();
}

export async function setValueAsync(value: string) {
  return await EncryptionModule.setValueAsync(value);
}

const emitter = new EventEmitter(EncryptionModule ?? NativeModulesProxy.EncryptionModule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { EncryptionModuleView, EncryptionModuleViewProps, ChangeEventPayload };
