'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Settings } from 'lucide-react';
import { 
  Calendar,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function PsychologistDashboard() {
  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '4',
      description: '2 completed, 2 upcoming',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'This Week',
      value: '18',
      description: 'Total appointments',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Clients',
      value: '24',
      description: 'Currently in treatment',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      description: 'vs last month',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  const todayAppointments = [
    {
      id: '1',
      clientName: 'Sarah Johnson',
      time: '09:00 AM',
      duration: '50 min',
      type: 'Individual Therapy',
      status: 'completed',
      notes: 'Discussed anxiety management techniques'
    },
    {
      id: '2',
      clientName: 'Michael Chen',
      time: '10:30 AM',
      duration: '50 min',
      type: 'Individual Therapy',
      status: 'completed',
      notes: 'Progress review and goal setting'
    },
    {
      id: '3',
      clientName: 'Emily Rodriguez',
      time: '02:00 PM',
      duration: '50 min',
      type: 'Family Therapy',
      status: 'upcoming',
      notes: 'First session with family'
    },
    {
      id: '4',
      clientName: 'David Wilson',
      time: '03:30 PM',
      duration: '50 min',
      type: 'Individual Therapy',
      status: 'upcoming',
      notes: 'Trauma recovery session'
    }
  ];

  const upcomingAppointments = [
    {
      id: '5',
      clientName: 'Lisa Thompson',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Individual Therapy'
    },
    {
      id: '6',
      clientName: 'James Brown',
      date: 'Tomorrow',
      time: '11:30 AM',
      type: 'Group Therapy'
    },
    {
      id: '7',
      clientName: 'Maria Garcia',
      date: 'Wednesday',
      time: '09:00 AM',
      type: 'Individual Therapy'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your schedule and client overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Today's Appointments
          </CardTitle>
          <CardDescription>
            Your schedule for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(appointment.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{appointment.clientName}</h4>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-xs text-gray-500">{appointment.time} • {appointment.duration}</p>
                    {appointment.notes && (
                      <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {appointment.status === 'upcoming' && (
                    <Button size="sm">
                      Start Session
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your next few appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{appointment.clientName}</h4>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/psychologist/appointments">
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </Link>
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
              <Link href="/psychologist/appointments/new">
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule New Appointment
                </Button>
              </Link>
              <Link href="/psychologist/clients">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  View All Clients
                </Button>
              </Link>
              <Link href="/psychologist/notes">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Session Notes
                </Button>
              </Link>
              <Link href="/psychologist/settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Availability
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}