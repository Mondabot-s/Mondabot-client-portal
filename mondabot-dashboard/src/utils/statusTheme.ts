// Centralized status theme configuration
export const statusColors = {
  Building: '#EC4899',    // Pink
  Testing: '#007AFF',     // Blue
  'For Review': '#FF6B35', // Orange-Red
  Live: '#34C759',        // Green
} as const;

export type ProjectStatus = keyof typeof statusColors;

// Generate Tailwind classes for status badges using CSS classes
export const getStatusBadgeClasses = (status: string): string => {
  if (!status) {
    return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-gray-100 text-gray-800 border-gray-200';
  }

  // Match status in a case-insensitive way and map to CSS classes
  const statusEntry = Object.entries(statusColors).find(
    ([key]) => key.toLowerCase() === status.toLowerCase()
  );

  if (!statusEntry) {
    return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-gray-100 text-gray-800 border-gray-200';
  }

  const [statusKey] = statusEntry;
  
  // Map to CSS class names
  switch (statusKey) {
    case 'Building':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-status-building text-white border-status-building';
    case 'Testing':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-status-testing text-white border-status-testing';
    case 'For Review':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-status-review text-white border-status-review';
    case 'Live':
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-status-live text-white border-status-live';
    default:
      return 'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Legacy function for inline styles (keeping for backward compatibility)
export const getStatusBadgeStyle = () => {
  return {}; // No longer needed, using CSS classes instead
};

// For components that need separate bg, text, and border classes
export const getStatusStyles = (status: string) => {
  if (!status) {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      style: {},
    };
  }

  const statusEntry = Object.entries(statusColors).find(
    ([key]) => key.toLowerCase() === status.toLowerCase()
  );

  if (!statusEntry) {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      style: {},
    };
  }

  const [statusKey] = statusEntry;

  switch (statusKey) {
    case 'Building':
      return {
        bg: 'bg-status-building',
        text: 'text-white',
        border: 'border-status-building',
        style: {},
      };
    case 'Testing':
      return {
        bg: 'bg-status-testing',
        text: 'text-white',
        border: 'border-status-testing',
        style: {},
      };
    case 'For Review':
      return {
        bg: 'bg-status-review',
        text: 'text-white',
        border: 'border-status-review',
        style: {},
      };
    case 'Live':
      return {
        bg: 'bg-status-live',
        text: 'text-white',
        border: 'border-status-live',
        style: {},
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        style: {},
      };
  }
}; 