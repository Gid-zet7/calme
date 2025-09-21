"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  BookOpen, 
  Newspaper, 
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

export default function AdminDashboard() {
  const { data: statsData } = api.admin.getStats.useQuery({});
  const stats = [
    {
      title: 'Total Programs',
      value: String(statsData?.programs ?? 0),
      description: 'All programs',
      icon: BookOpen,
      href: '/admin/programs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Resources',
      value: String(statsData?.resources ?? 0),
      description: 'Available resources',
      icon: BookOpen,
      href: '/admin/resources',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'News Articles',
      value: String(statsData?.news ?? 0),
      description: 'Published & drafts',
      icon: Newspaper,
      href: '/admin/news',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Psychologists',
      value: String(statsData?.psychologists ?? 0),
      description: 'Active profiles',
      icon: Users,
      href: '/admin/psychologists',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Appointments',
      value: String(statsData?.appointments ?? 0),
      description: 'Total appointments',
      icon: Calendar,
      href: '/admin/appointments',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  // TODO: Replace with real recent activity feed (e.g., audit log)
  const recentActivities: Array<{ id: number; action: string; description: string; time: string; type: string }> = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your mental health platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                {stat.href !== '#' && (
                  <Link href={stat.href}>
                    <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                      View details →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates and changes to your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/programs/new">
                <Button className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create New Program
                </Button>
              </Link>
              <Link href="/admin/resources/new">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Add New Resource
                </Button>
              </Link>
              <Link href="/admin/news/new">
                <Button variant="outline" className="w-full justify-start">
                  <Newspaper className="mr-2 h-4 w-4" />
                  Publish News Article
                </Button>
              </Link>
              <Link href="/admin/psychologists/new">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add Psychologist
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}