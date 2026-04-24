/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  level: number;
  icon: string;
  avatar: string;
  color: string;
}

export interface TreePosition {
  id: string;
  expectedMemberId: string;
  level: number;
  label: string;
  parentIds?: string[];
}
