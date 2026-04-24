/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { FamilyMember } from '../types';

interface Props {
  member: FamilyMember;
  isPlaced?: boolean;
  isIncorrect?: boolean;
  showLabel?: boolean;
}

export default function FamilyMemberCard({ member, isPlaced, isIncorrect, showLabel = true }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: member.id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      layoutId={member.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 50 : 0 
      }}
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-2xl cursor-grab active:cursor-grabbing
        transition-all duration-200 group border
        ${isPlaced ? 'w-24 h-32 border-transparent' : 'w-28 h-36 bg-white shadow-sm hover:shadow-md border-slate-100'}
        ${isIncorrect ? 'border-red-500 bg-red-50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : ''}
        ${isDragging ? 'shadow-2xl ring-4 ring-blue-500/20 opacity-40' : ''}
      `}
    >
      <div className={`
        relative overflow-hidden rounded-2xl mb-2 border-2 border-white shadow-md
        transition-all duration-300 group-hover:scale-105 group-hover:-rotate-1
        ${isPlaced ? 'size-20' : 'size-24'}
        flex items-center justify-center bg-slate-100
      `}>
        <img 
          src={member.avatar} 
          alt={member.role}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
             <div className="w-1 h-8 bg-blue-500/20 rounded-full animate-pulse" />
          </div>
        )}
      </div>
      
      {showLabel && (
        <span className={`
          text-center font-bold tracking-tight text-slate-700 leading-tight
          ${isPlaced ? 'text-[10px]' : 'text-xs'}
        `}>
          {member.role}
        </span>
      )}
      
      {!isPlaced && (
         <span className={`text-[10px] text-slate-400 mt-1 font-medium italic transition-all
           ${showLabel ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}
         `}>
           {member.name}
         </span>
      )}
    </motion.div>
  );
}
