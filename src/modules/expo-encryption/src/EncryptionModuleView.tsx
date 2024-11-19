import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { EncryptionModuleViewProps } from './EncryptionModule.types';

const NativeView: React.ComponentType<EncryptionModuleViewProps> =
  requireNativeViewManager('EncryptionModule');

export default function EncryptionModuleView(props: EncryptionModuleViewProps) {
  return <NativeView {...props} />;
}
