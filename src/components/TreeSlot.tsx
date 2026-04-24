/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDroppable } from '@dnd-kit/core';
import { TreePosition } from '../types';

interface Props {
  position: TreePosition;
  children?: React.ReactNode;
  isIncorrect?: boolean;
}

export default function TreeSlot({ position, children, isIncorrect }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id: position.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative w-28 h-36 rounded-2xl border-2 border-dashed
        flex flex-col items-center justify-center transition-all duration-300
        ${isOver ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg' : 'border-slate-200 bg-slate-50/50'}
        ${isIncorrect ? 'border-red-400 bg-red-50 animate-pulse' : ''}
        ${children ? 'border-solid border-white bg-white shadow-md' : ''}
      `}
    >
      {!children && (
        <div className="flex flex-col items-center justify-center text-center px-1">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
            {position.label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
