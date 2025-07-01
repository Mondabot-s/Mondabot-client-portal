// Centralized status theme configuration
export const statusColors = {
  Building: '#EC4899',    // Pink
  Testing: '#007AFF',     // Blue
  'For Review': '#FF6B35', // Orange-Red
  Live: '#34C759',        // Green
} as const;

export type ProjectStatus = keyof typeof statusColors;

// Generate Tailwind classes for status badges using custom colors
export const getStatusBadgeClasses = (status: string): string => {
  const color = statusColors[status as ProjectStatus];
  
  if (!color) {
    return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200';
  }

  // Use Tailwind custom color names
  switch (status) {
    case 'Building':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-status-building/10 text-status-building border border-status-building/20';
    case 'Testing':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-status-testing/10 text-status-testing border border-status-testing/20';
    case 'For Review':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-status-review/10 text-status-review border border-status-review/20';
    case 'Live':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-status-live/10 text-status-live border border-status-live/20';
    default:
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200';
  }
};

// For components that need separate bg, text, and border classes
export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Building':
      return {
        bg: 'bg-status-building/10',
        text: 'text-status-building',
        border: 'border-status-building/20'
      };
    case 'Testing':
      return {
        bg: 'bg-status-testing/10',
        text: 'text-status-testing',
        border: 'border-status-testing/20'
      };
    case 'For Review':
      return {
        bg: 'bg-status-review/10',
        text: 'text-status-review',
        border: 'border-status-review/20'
      };
    case 'Live':
      return {
        bg: 'bg-status-live/10',
        text: 'text-status-live',
        border: 'border-status-live/20'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      };
  }
}; 