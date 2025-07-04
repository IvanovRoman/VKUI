'use client';
/* eslint-disable jsdoc/require-jsdoc */

import * as React from 'react';
import { callMultiple } from '../../lib/callMultiple';
import { stopPropagation } from '../../lib/utils';
import { RootComponent, type RootComponentProps } from '../RootComponent/RootComponent';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './InputLike.module.css';

export interface InputLikeProps extends RootComponentProps<HTMLSpanElement> {
  length: number;
  index: number;
  value?: string;
  label?: string;
  onElementSelect?: (index: number) => void;
}

const MASK_SYMBOL = String.fromCharCode(0x2007);

function getMaskElements(length: number) {
  const result = [];
  for (let index = 0; index < length; index += 1) {
    result.push(
      <span key={index} className={styles.mask}>
        {MASK_SYMBOL}
      </span>,
    );
  }
  return result;
}

export const InputLike = ({
  value,
  length,
  index,
  onElementSelect,
  onFocus,
  label,
  readOnly,
  onKeyDown,
  ...restProps
}: InputLikeProps) => {
  const handleElementSelect = React.useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      stopPropagation(event);
      onElementSelect?.(index);
    },
    [index, onElementSelect],
  );

  return (
    <RootComponent
      Component="span"
      baseClassName={value?.length === length ? styles.host : undefined}
      tabIndex={readOnly ? -1 : 0}
      onFocus={callMultiple(onFocus, handleElementSelect)}
      onKeyDown={readOnly ? undefined : onKeyDown}
      {...restProps}
    >
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
      {value?.slice(0, length - 1)}
      {value?.slice(length - 1) && (
        <span key={index} className={styles.lastCharacter}>
          {value.slice(length - 1)}
        </span>
      )}
      {getMaskElements(length - (value?.length ?? 0))}
    </RootComponent>
  );
};
