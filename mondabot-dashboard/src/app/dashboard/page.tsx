"use client";

import Card from '../../ui/Card';
import Icon from '../../ui/Icon';
import ProgressBar from '../../ui/ProgressBar';
import Image from 'next/image';
import {
  CheckCircle2,
  Mic,
  RefreshCw,
  Database,
  Calendar,
  Target,
  Mail,
  FileText,
  Clock,
  ListChecks,
  ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useUser } from '@clerk/nextjs';

// Overview Section
const OverviewSection = () => {
  const { user } = useUser();
  
  // Get the user's first name, or default to 'Matthew'
  const firstName = (user?.firstName) || 'Matthew';
  
  return (
    <section id="overview" className="mb-16">
      {/* Welcome Message at Top */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {firstName}!</h1>
        <p className="text-gray-600">Here&apos;s a quick overview of your active projects. Let&apos;s make some progress today.</p>
      </div>

      {/* Header with Search and Actions */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Project Command Center</h2>
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 rounded-lg border w-full sm:w-64 focus:ring-2 focus:ring-[#d90077] focus:border-[#d90077] outline-none transition border-gray-300"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold transition bg-[#d90077] hover:bg-[#b80062]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Active Automations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Active Automations</p>
              <p className="text-xs text-green-600 mt-1">↗ +33.3% from last month</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Tasks Completed</p>
              <p className="text-xs text-green-600 mt-1">↗ +12% this week</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Time Saved */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">48h</p>
              <p className="text-sm text-gray-600">Time Saved</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Active Integrations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Active Integrations</p>
              <p className="text-xs text-gray-500 mt-1">All systems operational</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                <path d="M9 3L5 7m4 10l4 4"/>
                <path d="M5 17l4-4"/>
                <path d="M9 21l4-4"/>
                <path d="M15 3l4 4"/>
                <path d="M19 7l-4 4"/>
                <path d="M15 21l-4-4"/>
                <path d="M19 17l-4-4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Your Automation Journey
            </h2>
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://player.vimeo.com/video/1068762817?h=1234567890abcdef&title=0&byline=0&portrait=0"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            <p className="text-sm text-text-secondary mt-2">
              Watch how we&apos;re transforming your business processes with AI-powered automation
            </p>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Your Dedicated Project Lead */}
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Your Dedicated Project Lead
            </h2>
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image 
                  src="/Sergio_Bernal.jpg" 
                  alt="Sergio Bernal" 
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
                {/* Green Online Indicator */}
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">
                  Sergio Bernal
                </h3>
                <p className="text-sm text-text-secondary">
                  CEO & Lead Strategist
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Icon icon={Mail} className="w-5 h-5 mr-3" />
                <a 
                  href="mailto:sergio@mondabot.com"
                  className="text-text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  sergio@mondabot.com
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Icon icon={Clock} className="w-5 h-5 mr-3" />
                <span className="text-text-secondary">Available Mon-Fri, 9am-6pm CET</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90 bg-[#d90077]">
              Schedule a Call
            </button>
          </Card>

          {/* Pending Your Review */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="py-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-500 mr-4">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <path d="M12 9v4"/>
                  <path d="M12 17h.01"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-yellow-800">Pending Your Review</h3>
                <p className="text-sm text-yellow-700 mt-1">Feedback is required on the WhatsApp Bot conversation flows before we can proceed to launch.</p>
                <button className="mt-2 px-3 py-1 text-sm font-semibold bg-yellow-400 text-yellow-900 rounded-md hover:bg-yellow-500">
                  Provide Feedback
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Milestone */}
          <Card>
            <h3 className="font-bold text-lg mb-4 text-text-primary">Upcoming Milestone</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text-primary">Launch WhatsApp Support Bot</p>
                <p className="text-sm text-text-secondary">Due in 3 days</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Backend ✓</span>
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Port ✓ 3000</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-text-secondary">Automated customer support with AI-powered responses.</p>
          </Card>
        </div>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-text-primary mb-6">
          Project Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-base font-medium text-text-secondary mb-4">
              Objectives
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Icon
                  icon={CheckCircle2}
                  className="w-5 h-5 mr-3 text-green-500"
                />
                <span className="text-sm text-text-primary">
                  Reduce customer response time by 80%
                </span>
              </li>
              <li className="flex items-center">
                <Icon
                  icon={CheckCircle2}
                  className="w-5 h-5 mr-3 text-green-500"
                />
                <span className="text-sm text-text-primary">
                  Automate lead qualification processes
                </span>
              </li>
              <li className="flex items-center">
                <Icon
                  icon={CheckCircle2}
                  className="w-5 h-5 mr-3 text-green-500"
                />
                <span className="text-sm text-text-primary">
                  Integrate data with existing CRM
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium text-text-secondary mb-4">
              Automation Type
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Icon icon={Mic} className="w-5 h-5 mr-3" />
                <span className="text-sm text-text-primary">
                  AI Voice Response
                </span>
              </li>
              <li className="flex items-center">
                <Icon icon={RefreshCw} className="w-5 h-5 mr-3" />
                <span className="text-sm text-text-primary">
                  Qualification Workflow
                </span>
              </li>
              <li className="flex items-center">
                <Icon icon={Database} className="w-5 h-5 mr-3" />
                <span className="text-sm text-text-primary">
                  Bidirectional CRM Integration
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium text-text-secondary mb-4">
              Key Dates
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Icon icon={Calendar} className="w-5 h-5 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-text-primary font-medium">
                    Project Start
                  </p>
                  <p className="text-sm text-text-secondary">June 15, 2023</p>
                </div>
              </li>
              <li className="flex items-start">
                <Icon icon={Target} className="w-5 h-5 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-text-primary font-medium">
                    Estimated Launch
                  </p>
                  <p className="text-sm text-text-secondary">July 30, 2023</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
};

// Discovery Section
const DiscoverySection = () => {
  const discoveryResponses = [
    { label: 'Industry', value: 'Financial Services' },
    { label: 'Company Size', value: '51-200 employees' },
    { label: 'Current CRM', value: 'HubSpot' },
    { label: 'Monthly Lead Volume', value: '500-1000' },
    { label: 'Main Challenge', value: 'Slow response time to new leads' },
  ];

  return (
    <section id="discovery" className="mb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Step 1: Discovery
        </h2>
        <p className="text-text-secondary mt-1">
          Let&apos;s gather all the necessary information to kick-start your
          project.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Discovery Responses
          </h3>
          <div className="space-y-4">
            {discoveryResponses.map((response, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-text-secondary">
                  {response.label}
                </span>
                <span className="text-sm text-text-primary font-semibold">
                  {response.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Discovery Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon icon={FileText} className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-sm font-medium">Questionnaire Completed</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Complete
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon icon={Calendar} className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-sm font-medium">Initial Meeting</span>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Complete
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon icon={Clock} className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-sm font-medium">Technical Review</span>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                In Progress
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon icon={ListChecks} className="w-5 h-5 mr-3 text-gray-400" />
                <span className="text-sm font-medium">Requirements Finalized</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

// Strategy Section
const StrategySection = () => {
  const workflowSteps = [
    'Lead Capture',
    'AI Qualification',
    'CRM Update',
    'Follow-up',
  ];

  const automationTypes = [
    {
      title: 'Voice Response System',
      description: 'AI-powered voice responses for incoming calls with natural language processing.',
      status: 'approved',
      icon: Mic,
    },
    {
      title: 'Lead Qualification Workflow',
      description: 'Automated lead scoring and qualification based on conversation analysis.',
      status: 'approved',
      icon: Target,
    },
    {
      title: 'CRM Integration',
      description: 'Bidirectional sync with HubSpot for real-time data updates.',
      status: 'pending',
      icon: Database,
    },
  ];

  return (
    <section id="strategy" className="mb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Step 2: Strategy
        </h2>
        <p className="text-text-secondary mt-1">
          Here we define the core automation logic and get your approval on the
          proposed workflows.
        </p>
      </header>

      <Card className="mb-8">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Workflow Diagram
        </h3>
        <div className="flex items-center justify-center flex-wrap gap-4 text-sm">
          {workflowSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <span className="font-bold text-primary mr-2">
                  {index + 1}
                </span>
                <span className="text-text-primary">{step}</span>
              </div>
              {index < workflowSteps.length - 1 && (
                <Icon
                  icon={ArrowRight}
                  className="w-5 h-5 mx-2 text-gray-300"
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        {automationTypes.map((type) => (
          <Card key={type.title}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  <Icon icon={type.icon} className="w-6 h-6 mr-3" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    {type.title}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary">
                  {type.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  type.status === 'approved' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {type.status === 'approved' ? 'Approved' : 'Pending'}
              </span>
            </div>
            <div className="flex space-x-4 mt-4 pt-4 border-t border-gray-100">
              <button className="text-sm font-medium text-primary hover:underline">
                View Details
              </button>
              <button className="text-sm font-medium text-primary hover:underline">
                Edit
              </button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

// Setup Section
const SetupSection = () => {
  const { 
    tasks: setupTasks, 
    loading, 
    error, 
    updateTaskStatus, 
    socketConnected, 
    socketError 
  } = useTasks();

  const apiConfigs = [
    {
      name: 'Twilio',
      status: 'connected',
      icon: '📞',
      description: 'API de telefonía y SMS'
    },
    {
      name: 'HubSpot',
      status: 'connecting',
      icon: '📊',
      description: 'CRM y marketing automation'
    },
    {
      name: 'OpenAI',
      status: 'pending',
      icon: '🤖',
      description: 'IA y procesamiento de lenguaje'
    }
  ];

  const completedTasks = setupTasks.filter(task => task.status === 'completed').length;
  const progressPercentage = setupTasks.length > 0 ? (completedTasks / setupTasks.length) * 100 : 0;

  const handleTaskStatusChange = (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <section id="setup" className="mb-16">
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">
              Step 3: Setup
            </h2>
            <p className="text-text-secondary mt-1">
              Technical configuration and integration setup for your automation system.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
              socketConnected 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                socketConnected ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              {socketConnected ? 'Real-time Connected' : 'Real-time Disconnected'}
            </div>
          </div>
        </div>
        {socketError && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
            ⚠️ Real-time connection: {socketError}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Setup Progress</h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">⚠️ {error}</p>
              <p className="text-xs text-red-600 mt-1">Using fallback data for display</p>
            </div>
          )}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {loading ? 'Loading...' : `${Math.round(progressPercentage)}%`}
              </span>
            </div>
            <ProgressBar value={loading ? 0 : progressPercentage} />
          </div>
          <div className="space-y-3">
            {setupTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3">
                <button
                  onClick={() => {
                    if (!task.id || !task.status) return;
                    const statuses: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];
                    const currentIndex = statuses.indexOf(task.status);
                    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                    handleTaskStatusChange(task.id, nextStatus);
                  }}
                  className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 transition-colors ${
                    task.status === 'completed' 
                      ? 'bg-primary border-primary' 
                      : task.status === 'in-progress'
                      ? 'border-primary bg-blue-100'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {task.status === 'completed' && (
                    <span className="text-white text-xs flex items-center justify-center">✓</span>
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Completado' : 
                     task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">API Configurations</h3>
          <div className="space-y-4">
            {apiConfigs.map((api) => (
              <div key={api.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{api.icon}</span>
                    <div>
                      <h4 className="font-medium">{api.name}</h4>
                      <p className="text-sm text-gray-600">{api.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    api.status === 'connected' 
                      ? 'bg-green-100 text-green-700' 
                      : api.status === 'connecting'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {api.status === 'connected' ? 'Connected' : 
                     api.status === 'connecting' ? 'Connecting' : 'Pending'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm font-medium text-primary hover:underline">
                    Configure
                  </button>
                  <button className="text-sm font-medium text-primary hover:underline">
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

// Testing Section
const TestingSection = () => {
  const [testScenarios, setTestScenarios] = useState([
    {
      name: 'Voice Response Test',
      status: 'passed',
      description: 'Testing AI voice responses and natural language processing',
      icon: Mic,
    },
    {
      name: 'CRM Integration Test',
      status: 'in-progress',
      description: 'Testing bidirectional data sync with HubSpot',
      icon: Database,
    },
    {
      name: 'Workflow Test',
      status: 'pending',
      description: 'Testing complete lead qualification workflow',
      icon: RefreshCw,
    },
  ]);

  const handleRunTest = (testName: string) => {
    setTestScenarios(scenarios =>
      scenarios.map(test =>
        test.name === testName 
          ? { ...test, status: test.status === 'pending' ? 'in-progress' : test.status }
          : test
      )
    );
  };

  return (
    <section id="testing" className="mb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Step 4: Testing
        </h2>
        <p className="text-text-secondary mt-1">
          Comprehensive testing of all automation components and workflows.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Test Scenarios</h3>
          <div className="space-y-4">
            {testScenarios.map((test) => (
              <div key={test.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Icon icon={test.icon} className="w-6 h-6 mr-3" />
                    <div>
                      <h4 className="font-medium">{test.name}</h4>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    test.status === 'passed' 
                      ? 'bg-green-100 text-green-700' 
                      : test.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {test.status === 'passed' ? 'Passed' : 
                     test.status === 'in-progress' ? 'In Progress' : 'Pending'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleRunTest(test.name)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Run Test
                  </button>
                  <button className="text-sm font-medium text-primary hover:underline">
                    View Results
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">Test Results</h3>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon icon={CheckCircle2} className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium text-green-800">Voice Response Test</span>
              </div>
              <p className="text-sm text-green-700">All voice interactions working correctly</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon icon={Clock} className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium text-blue-800">CRM Integration Test</span>
              </div>
              <p className="text-sm text-blue-700">Testing in progress...</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

// Launch Section
const LaunchSection = () => {
  const [launchTasks, setLaunchTasks] = useState([
    { id: 1, title: 'Final System Review', status: 'completed', description: 'Complete system validation and performance check' },
    { id: 2, title: 'User Training', status: 'in-progress', description: 'Training sessions for team members' },
    { id: 3, title: 'Go-Live Preparation', status: 'pending', description: 'Final preparations for system launch' },
    { id: 4, title: 'Launch Monitoring', status: 'pending', description: '24/7 monitoring during initial launch period' },
  ]);

  const completedTasks = launchTasks.filter(task => task.status === 'completed').length;
  const progressPercentage = (completedTasks / launchTasks.length) * 100;

  const handleLaunchTaskStatusChange = (taskId: number, newStatus: string) => {
    setLaunchTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <section id="launch" className="mb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Step 5: Launch
        </h2>
        <p className="text-text-secondary mt-1">
          Final preparations and system launch with monitoring.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Launch Checklist</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Launch Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <ProgressBar value={progressPercentage} />
          </div>
          <div className="space-y-3">
            {launchTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3">
                <button
                  onClick={() => {
                    const statuses = ['pending', 'in-progress', 'completed'];
                    const currentIndex = statuses.indexOf(task.status);
                    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                    handleLaunchTaskStatusChange(task.id, nextStatus);
                  }}
                  className={`w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 transition-colors ${
                    task.status === 'completed' 
                      ? 'bg-primary border-primary' 
                      : task.status === 'in-progress'
                      ? 'border-primary bg-blue-100'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {task.status === 'completed' && (
                    <span className="text-white text-xs flex items-center justify-center">✓</span>
                  )}
                </button>
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                    task.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'completed' ? 'Completado' : 
                     task.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">Launch Metrics</h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">July 30</div>
              <div className="text-sm text-gray-600">Target Launch Date</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">24/7</div>
                <div className="text-xs text-blue-600">Monitoring</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">99.9%</div>
                <div className="text-xs text-green-600">Uptime Target</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

// Reporting Section
const ReportingSection = () => {
  const [reports] = useState([
    { name: 'Daily Performance Report', type: 'Automated', frequency: 'Daily' },
    { name: 'Weekly Analytics Summary', type: 'Automated', frequency: 'Weekly' },
    { name: 'Monthly ROI Analysis', type: 'Manual', frequency: 'Monthly' },
  ]);

  const [metrics] = useState({
    responseTime: '2.1s',
    conversionRate: '23%',
    uptime: '99.8%',
    dailyLeads: '45',
  });

  return (
    <section id="reporting" className="mb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Step 6: Reporting
        </h2>
        <p className="text-text-secondary mt-1">
          Analytics, insights, and performance monitoring for your automation system.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Response Time</span>
              <span className="text-lg font-bold text-primary">{metrics.responseTime}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Lead Conversion Rate</span>
              <span className="text-lg font-bold text-primary">{metrics.conversionRate}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">System Uptime</span>
              <span className="text-lg font-bold text-primary">{metrics.uptime}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">Automated Reports</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-gray-600">{report.type} • {report.frequency}</p>
                </div>
                <button className="text-sm font-medium text-primary hover:underline">
                  View
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Análisis de Tendencias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h4 className="font-medium mb-2">Leads por Día</h4>
            <div className="text-2xl font-bold text-primary mb-2">{metrics.dailyLeads}</div>
            <p className="text-sm text-gray-600">Promedio de los últimos 7 días</p>
            <div className="mt-4 h-32 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">📊 Gráfico de Leads</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h4 className="font-medium mb-2">Tiempo de Respuesta</h4>
            <div className="text-2xl font-bold text-primary mb-2">{metrics.responseTime}</div>
            <p className="text-sm text-gray-600">Promedio de respuesta</p>
            <div className="mt-4 h-32 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500">📈 Gráfico de Tiempo</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

// Library Section
const LibrarySection = () => {
  const [documentation] = useState([
    { title: 'User Manual', type: 'PDF', pages: '45 pages', icon: '📖' },
    { title: 'API Documentation', type: 'HTML', pages: 'Interactive', icon: '🔧' },
    { title: 'Best Practices Guide', type: 'PDF', pages: '32 pages', icon: '📋' },
  ]);

  const [templates] = useState([
    { title: 'Email Templates', type: 'Collection', count: '12 templates', icon: '📧' },
    { title: 'Voice Scripts', type: 'Collection', count: '8 scripts', icon: '🎤' },
    { title: 'Workflow Templates', type: 'Collection', count: '5 workflows', icon: '🔄' },
  ]);

  return (
    <section id="library" className="mb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Library
        </h2>
        <p className="text-text-secondary mt-1">
          Resources, documentation, and templates for your automation system.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Documentación</h3>
          <div className="space-y-3">
            {documentation.map((doc) => (
              <div key={doc.title} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-500">{doc.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-xs text-gray-500">{doc.type} · {doc.pages}</p>
                  </div>
                  <button className="text-primary text-sm">Ver</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold mb-4">Templates</h3>
          <div className="space-y-3">
            {templates.map((template) => (
              <div key={template.title} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-500">{template.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{template.title}</h4>
                    <p className="text-xs text-gray-500">{template.type} · {template.count}</p>
                  </div>
                  <button className="text-primary text-sm">Ver</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Comunidad</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👥</span>
            <div>
              <h4 className="font-medium">Foro de Usuarios</h4>
              <p className="text-sm text-gray-600">Conecta con otros usuarios</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📺</span>
            <div>
              <h4 className="font-medium">Canal de YouTube</h4>
              <p className="text-sm text-gray-600">Tutoriales en video</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📚</span>
            <div>
              <h4 className="font-medium">Base de Conocimientos</h4>
              <p className="text-sm text-gray-600">Artículos y guías</p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default function NewDashboard() {
  return (
    <div className="space-y-0">
      <OverviewSection />
      <DiscoverySection />
      <StrategySection />
      <SetupSection />
      <TestingSection />
      <LaunchSection />
      <ReportingSection />
      <LibrarySection />
    </div>
  );
} 