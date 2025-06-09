// UI-specific types for the Gamified Recycling System DApp

import { QuestType } from './contracts';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface GarbageCanFilter {
  location?: string;
  isActive?: boolean;
  minFillLevel?: number;
  maxFillLevel?: number;
}

export interface StakeFilter {
  garbageCanId?: number;
  minAmount?: bigint;
  maxAmount?: bigint;
}

export interface QuestFilter {
  type?: QuestType;
  isActive?: boolean;
  isCompleted?: boolean;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: boolean;
  hover?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showValue?: boolean;
  label?: string;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface DAppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ConnectWalletProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface WalletButtonProps {
  address?: string;
  balance?: bigint;
  onDisconnect?: () => void;
}
