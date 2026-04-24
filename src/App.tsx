/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCenter, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

import FamilyMemberCard from './components/FamilyMemberCard';
import TreeSlot from './components/TreeSlot';
import { FAMILY_MEMBERS, TREE_POSITIONS } from './constants';
import { FamilyMember } from './types';

export default function App() {
  const [placements, setPlacements] = useState<Record<string, string>>({}); // positionId -> memberId
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [incorrectPositions, setIncorrectPositions] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [showNames, setShowNames] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const availableMembers = useMemo(() => {
    const placedMemberIds = Object.values(placements);
    return FAMILY_MEMBERS.filter(m => !placedMemberIds.includes(m.id));
  }, [placements]);

  const activeMember = useMemo(() => 
    FAMILY_MEMBERS.find(m => m.id === activeId), 
  [activeId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Reset validation state when user starts moving things
    setIsFinished(false);
    setIncorrectPositions([]);
    setShowMessage(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const memberId = active.id as string;
    
    setActiveId(null);

    if (over) {
      const positionId = over.id as string;
      
      // If dropping into a position slot
      if (positionId.startsWith('pos_')) {
        setPlacements(prev => {
          const next = { ...prev };
          // Remove member from any other position first
          Object.keys(next).forEach(key => {
            if (next[key] === memberId) delete next[key];
          });
          // Set to new position
          next[positionId] = memberId;
          return next;
        });
      }
    } else {
      // If dropped outside, return to sidebar
      setPlacements(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          if (next[key] === memberId) delete next[key];
        });
        return next;
      });
    }
  };

  const handleFinish = () => {
    const errors: string[] = [];
    let correctCount = 0;

    TREE_POSITIONS.forEach(pos => {
      const placedMemberId = placements[pos.id];
      if (placedMemberId !== pos.expectedMemberId) {
        errors.push(pos.id);
      } else {
        correctCount++;
      }
    });

    setIncorrectPositions(errors);
    setIsFinished(true);

    if (errors.length === 0) {
      setIsSuccess(true);
      setShowMessage("Excellent! You built the family tree correctly! ✅");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#22c55e', '#facc15', '#f43f5e']
      });
    } else {
      setIsSuccess(false);
      setShowMessage("Some positions are incorrect. Try again! ❌");
    }
  };

  const handleReset = () => {
    setPlacements({});
    setIsFinished(false);
    setIsSuccess(false);
    setIncorrectPositions([]);
    setShowMessage(null);
  };

  const handleHint = () => {
    // Show 3 random correct placements that aren't already correct
    const incorrectOrMissing = TREE_POSITIONS.filter(pos => placements[pos.id] !== pos.expectedMemberId);
    const toHint = incorrectOrMissing.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    setPlacements(prev => {
      const next = { ...prev };
      toHint.forEach(pos => {
        // Remove this member from where it currently is
        Object.keys(next).forEach(key => {
          if (next[key] === pos.expectedMemberId) delete next[key];
        });
        next[pos.id] = pos.expectedMemberId;
      });
      return next;
    });
  };

  // Group positions by level for rendering
  const levels = useMemo(() => {
    const groups: Record<number, typeof TREE_POSITIONS> = {};
    TREE_POSITIONS.forEach(pos => {
      if (!groups[pos.level]) groups[pos.level] = [];
      groups[pos.level].push(pos);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-black text-blue-600 mb-2 drop-shadow-sm"
          >
            Build the Family Tree
          </motion.h1>
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center justify-center gap-2 text-slate-500">
              <Info size={18} />
              <p className="text-lg">Drag and drop the members to their correct generations!</p>
            </div>
            
            <button 
              onClick={() => setShowNames(!showNames)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all text-sm font-medium text-slate-600"
            >
              {showNames ? "Hide Names" : "Show Names"}
            </button>
          </motion.div>
        </header>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar / Member Panel */}
            <aside className="w-full lg:w-72 shrink-0 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 sticky top-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
                <span>Family Members</span>
                <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">
                  {availableMembers.length} left
                </span>
              </h2>
              
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-3 min-h-[400px]">
                <AnimatePresence>
                  {availableMembers.map(member => (
                    <FamilyMemberCard key={member.id} member={member} showLabel={showNames} />
                  ))}
                </AnimatePresence>
                {availableMembers.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                    <p className="text-sm text-center">All members placed!</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={handleFinish}
                  disabled={availableMembers.length > 0 && !isFinished}
                  className={`
                    w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all
                    flex items-center justify-center gap-2
                    ${availableMembers.length > 0 && !isFinished 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 active:scale-95 shadow-green-100'}
                  `}
                >
                  <CheckCircle2 size={24} />
                  Finish Game
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleHint}
                    className="flex-1 py-3 bg-amber-100 text-amber-700 rounded-xl font-semibold hover:bg-amber-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Lightbulb size={20} />
                    Hint
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCcw size={20} />
                    Reset
                  </button>
                </div>
              </div>
            </aside>

            {/* Tree Area */}
            <main className={`
              flex-1 relative bg-white p-8 rounded-[40px] shadow-2xl border border-white overflow-x-auto min-h-[800px]
              transition-all duration-1000
              ${isSuccess ? 'ring-[16px] ring-blue-100/50 bg-gradient-to-br from-blue-50 to-white' : ''}
            `}>
              {/* Success Sparkles Background */}
              {isSuccess && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[40px]">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1.5, 0],
                        x: Math.random() * 800,
                        y: Math.random() * 800
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                      className="absolute size-4 text-blue-400"
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Lines will be conceptually drawn here. In a production app, 
                    we would use absolute pixel positions of each slot. 
                    For this prototype, we'll use a CSS grid approach for levels. */}
              </svg>

              <div className="flex flex-col gap-16 items-center min-w-[800px]">
                {levels.map(([level, positions]) => (
                  <div key={level} className="flex gap-8 items-center justify-center relative">
                    {positions.map(pos => {
                      const memberId = placements[pos.id];
                      const member = FAMILY_MEMBERS.find(m => m.id === memberId);
                      const isIncorrect = incorrectPositions.includes(pos.id);

                      return (
                        <div key={pos.id} className="relative">
                          <TreeSlot position={pos} isIncorrect={isIncorrect}>
                            {member && (
                              <FamilyMemberCard 
                                member={member} 
                                isPlaced={true} 
                                isIncorrect={isIncorrect}
                                showLabel={showNames}
                              />
                            )}
                          </TreeSlot>
                          
                          {/* Visual connection to parents (conceptual) */}
                          {pos.parentIds && (
                             <div className={`
                               absolute -top-16 left-1/2 -translate-x-1/2 w-0.5 h-16 
                               transition-all duration-700
                               ${isSuccess ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'bg-slate-200'}
                             `} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Status Message Overlay */}
              <AnimatePresence>
                {showMessage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`
                      fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl z-50
                      flex items-center gap-3 font-bold text-lg border-2
                      ${isSuccess 
                        ? 'bg-blue-600 text-white border-blue-400' 
                        : 'bg-red-50 text-red-700 border-red-200'}
                    `}
                  >
                    {isSuccess ? <CheckCircle2 className="text-white" /> : <AlertCircle className="text-red-500" />}
                    {showMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center"
                >
                  <p className="text-3xl font-black text-blue-600 mb-2 tracking-tight">This is a real family tree!</p>
                  <p className="text-slate-500 font-medium">You've successfully connected all the generations.</p>
                </motion.div>
              )}
            </main>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId ? (
              <div className="opacity-80 scale-110 pointer-events-none">
                <FamilyMemberCard 
                  member={activeMember!} 
                  showLabel={showNames}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      <footer className="mt-12 mb-8 text-center text-slate-400 text-sm">
        <p>&copy; 2024 Educational Family Tree App &bull; Built with ❤️ for students</p>
      </footer>
    </div>
  );
}
