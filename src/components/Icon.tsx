import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { COLORS } from '../constants';

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/**
 * Affiche une icône Lucide à partir de son nom.
 * Style aligné sur l'identité Evidence : trait fin, doré par défaut.
 */
export const Icon = ({
  name,
  size = 24,
  color = COLORS.gold,
  strokeWidth = 1.5,
}: IconProps) => {
  const LucideIcon = (LucideIcons as any)[name];

  if (!LucideIcon) {
    console.warn(`[Icon] Icône introuvable : ${name}`);
    return null;
  }

  return <LucideIcon size={size} color={color} strokeWidth={strokeWidth} />;
};