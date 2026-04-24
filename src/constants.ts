/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FamilyMember, TreePosition } from './types';

export const FAMILY_MEMBERS: FamilyMember[] = [
  { 
    id: 'ggf', 
    name: 'Yusuf Jallol', 
    role: 'Great Grandfather', 
    level: 0, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=300&h=300&fit=crop', 
    color: 'bg-slate-700' 
  },
  { 
    id: 'ggm', 
    name: 'Oysha Jallol', 
    role: 'Great Grandmother', 
    level: 0, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8c17bbce4?q=80&w=300&h=300&fit=crop', 
    color: 'bg-slate-600' 
  },
  { 
    id: 'gf', 
    name: 'Anvar Bobo', 
    role: 'Grandfather', 
    level: 1, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&h=300&fit=crop', 
    color: 'bg-blue-700' 
  },
  { 
    id: 'gm', 
    name: 'Zuhra Buvim', 
    role: 'Grandmother', 
    level: 1, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=300&h=300&fit=crop', 
    color: 'bg-blue-600' 
  },
  { 
    id: 'f', 
    name: 'Bekzad Dada', 
    role: 'Father', 
    level: 2, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&fit=crop', 
    color: 'bg-emerald-700' 
  },
  { 
    id: 'm', 
    name: 'Lola Ada', 
    role: 'Mother', 
    level: 2, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&fit=crop', 
    color: 'bg-emerald-600' 
  },
  { 
    id: 'u', 
    name: 'Sarvar Amaki', 
    role: 'Uncle', 
    level: 2, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&fit=crop', 
    color: 'bg-orange-700' 
  },
  { 
    id: 'a', 
    name: 'Guli Amma', 
    role: 'Aunt', 
    level: 2, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=300&fit=crop', 
    color: 'bg-orange-600' 
  },
  { 
    id: 'ob', 
    name: 'Ali Akbar', 
    role: 'Older Brother', 
    level: 3, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=300&h=300&fit=crop', 
    color: 'bg-indigo-700' 
  },
  { 
    id: 'os', 
    name: 'Zaynab', 
    role: 'Older Sister', 
    level: 3, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1499952126235-59a24559f7b0?q=80&w=300&h=300&fit=crop', 
    color: 'bg-indigo-600' 
  },
  { 
    id: 'yb', 
    name: 'Temur', 
    role: 'Younger Brother', 
    level: 3, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=300&h=300&fit=crop', 
    color: 'bg-cyan-700' 
  },
  { 
    id: 'ys', 
    name: 'Madina', 
    role: 'Younger Sister', 
    level: 3, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=300&h=300&fit=crop', 
    color: 'bg-cyan-600' 
  },
  { 
    id: 'cm', 
    name: 'Jasur', 
    role: 'Cousin (Male)', 
    level: 3, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&fit=crop', 
    color: 'bg-rose-700' 
  },
  { 
    id: 'cf', 
    name: 'Kamila', 
    role: 'Cousin (Female)', 
    level: 3, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&h=300&fit=crop', 
    color: 'bg-rose-600' 
  },
  { 
    id: 'b', 
    name: 'Alisherbek', 
    role: 'Baby', 
    level: 4, 
    icon: '', 
    avatar: 'https://images.unsplash.com/photo-1519689689378-439ea0b812a7?q=80&w=300&h=300&fit=crop', 
    color: 'bg-purple-500' 
  },
];

export const TREE_POSITIONS: TreePosition[] = [
  // Generation 0
  { id: 'pos_ggf', expectedMemberId: 'ggf', level: 0, label: 'Great Grandfather' },
  { id: 'pos_ggm', expectedMemberId: 'ggm', level: 0, label: 'Great Grandmother' },
  
  // Generation 1
  { id: 'pos_gf', expectedMemberId: 'gf', level: 1, label: 'Grandfather', parentIds: ['pos_ggf', 'pos_ggm'] },
  { id: 'pos_gm', expectedMemberId: 'gm', level: 1, label: 'Grandmother' },
  
  // Generation 2
  { id: 'pos_f', expectedMemberId: 'f', level: 2, label: 'Father', parentIds: ['pos_gf', 'pos_gm'] },
  { id: 'pos_m', expectedMemberId: 'm', level: 2, label: 'Mother' },
  { id: 'pos_u', expectedMemberId: 'u', level: 2, label: 'Uncle', parentIds: ['pos_gf', 'pos_gm'] },
  { id: 'pos_a', expectedMemberId: 'a', level: 2, label: 'Aunt' },
  
  // Generation 3
  { id: 'pos_ob', expectedMemberId: 'ob', level: 3, label: 'Older Brother', parentIds: ['pos_f', 'pos_m'] },
  { id: 'pos_os', expectedMemberId: 'os', level: 3, label: 'Older Sister', parentIds: ['pos_f', 'pos_m'] },
  { id: 'pos_yb', expectedMemberId: 'yb', level: 3, label: 'Younger Brother', parentIds: ['pos_f', 'pos_m'] },
  { id: 'pos_ys', expectedMemberId: 'ys', level: 3, label: 'Younger Sister', parentIds: ['pos_f', 'pos_m'] },
  { id: 'pos_cm', expectedMemberId: 'cm', level: 3, label: 'Cousin (M)', parentIds: ['pos_u', 'pos_a'] },
  { id: 'pos_cf', expectedMemberId: 'cf', level: 3, label: 'Cousin (F)', parentIds: ['pos_u', 'pos_a'] },
  
  // Generation 4
  { id: 'pos_b', expectedMemberId: 'b', level: 4, label: 'Baby / Grandchild', parentIds: ['pos_ob', 'pos_os'] },
];
