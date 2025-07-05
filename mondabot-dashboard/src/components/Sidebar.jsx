"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';

// This Sidebar component is completely self-contained and styles itself with inline styles,
// so it does not rely on Tailwind or any external CSS frameworks.
export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user } = useUser();
  const { signOut } = useClerk();

  /** Base link style */
  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#9CA3AF', // Gray text for inactive link
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    fontSize: '14px',
  };

  /** Active link style */
  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#CD1174', // Pink background for active link
    color: 'white',
  };

  /** Improved active state logic */
  const isActive = (href) => {
    // Normalize paths by removing trailing slashes
    const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    const linkPath = href === '/' ? '/' : href.replace(/\/$/, '');
    
    // For exact matching
    return currentPath === linkPath;
  };

  /** Hover link style with improved active state detection */
  const getHoverStyle = (href) => {
    if (isActive(href)) return activeLinkStyle;
    if (hoveredItem === href) {
      return {
        ...linkStyle,
        backgroundColor: 'rgba(205, 17, 116, 0.1)',
        color: '#CD1174',
      };
    }
    return linkStyle;
  };

  // Sidebar navigation items with FontAwesome icons
  const navItems = [
    { href: '/', label: 'Overview', icon: 'fas fa-tachometer-alt' },
    { href: '/automations', label: 'Automations', icon: 'fas fa-robot' },
    { href: '/updates', label: 'Updates', icon: 'fas fa-clock' },
    { href: '/tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { href: '/referrals', label: 'Refer & Win', icon: 'fas fa-gift' },
    { href: '/test-page', label: 'Test Page', icon: 'fas fa-flask' },
  ];

  // Handle sign out
  const handleSignOut = () => {
    signOut();
  };

  // Get user initials
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user?.firstName) {
      return user.firstName.charAt(0);
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    return 'User';
  };

  return (
    <aside
      style={{
        width: '280px',
        minHeight: '100vh',
        backgroundColor: '#170E3B', // Dark purple background
        padding: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* Brand */}
        <div style={{ marginBottom: '40px' }}>
          <Image
            src="/Banner-dark.svg"
            alt="Mondabot"
            width={200}
            height={41}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={getHoverStyle(href)}
              onMouseEnter={() => setHoveredItem(href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <i className={icon} style={{ marginRight: '12px', fontSize: '16px', width: '20px', textAlign: 'center' }}></i>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#CD1174',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {getUserInitials()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
              {getUserDisplayName()}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
              {user?.emailAddresses?.[0]?.emailAddress}
            </div>
          </div>
        </div>
        
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#9CA3AF',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(205, 17, 116, 0.1)';
            e.target.style.color = '#CD1174';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = '#9CA3AF';
          }}
        >
          <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
          Sign Out
        </button>
      </div>
    </aside>
  );
} 