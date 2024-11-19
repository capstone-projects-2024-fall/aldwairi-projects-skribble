import * as React from 'react';

import { EncryptionModuleViewProps } from './EncryptionModule.types';

export default function EncryptionModuleView(props: EncryptionModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
