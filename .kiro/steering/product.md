# Mondabot Dashboard

## Product Overview
Mondabot Dashboard is a professional full-stack application that provides real-time project management capabilities with Airtable integration. It consists of a React/Next.js frontend and an Express.js backend that synchronizes data with Airtable bases.

## Key Features
- **Real-time Project Management**: Live updates via WebSocket connections
- **Airtable Integration**: Seamless synchronization with Airtable databases
- **Responsive Dashboard**: Modern UI built with Next.js and Tailwind CSS
- **Authentication**: User authentication via Clerk
- **Dual-Server Architecture**: Separation of frontend and backend concerns

## Brand Identity
### Color Palette
- **Brand Primary**: `#170F3A` (Tailwind: `primary` / `brand-primary`)
- **Brand Secondary**: `#2D1B69` (Tailwind: `brand-secondary`)
- **Background**: `#FFF9F9` (Tailwind: `background`)
- **Content Area**: `#FFFFFF` (Tailwind: `content-bg`)
- **Primary Text**: `#1F2937` (Tailwind: `text-primary`)
- **Secondary Text**: `#6B7280` (Tailwind: `text-secondary`)

### Status Colors
- **Building**: `#EC4899` (Tailwind: `status-building`)
- **Testing**: `#007AFF` (Tailwind: `status-testing`)
- **Review**: `#FF6B35` (Tailwind: `status-review`)
- **Live**: `#34C759` (Tailwind: `status-live`)

### Typography
- **Font Family**: `Poppins`, `sans-serif`

## Important Guidelines
- Always preserve the dual-server architecture - never convert to static export or merge the servers
- Maintain separation between Next.js frontend and Express backend
- Follow the established color palette and typography for UI consistency
- Ensure real-time functionality works correctly with Socket.IO
- Properly handle authentication with Clerk