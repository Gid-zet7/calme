'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for now - will be replaced with tRPC calls
  useEffect(() => {
    const mockAppointments = [
      {
        id: '1',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah.johnson@email.com',
        clientPhone: '+1 (555) 123-4567',
        date: '2024-01-25',
        time: '09:00 AM',
        duration: 50,
        type: 'Individual Therapy',
        status: 'scheduled',
        notes: 'First session - anxiety management',
        location: 'Office Room 1',
        createdAt: '2024-01-20'
      },
      {
        id: '2',
        clientName: 'Michael Chen',
        clientEmail: 'michael.chen@email.com',
        clientPhone: '+1 (555) 234-5678',
        date: '2024-01-25',
        time: '10:30 AM',
        duration: 50,
        type: 'Individual Therapy',
        status: 'completed',
        notes: 'Progress review - CBT techniques working well',
        location: 'Office Room 1',
        createdAt: '2024-01-18'
      },
      {
        id: '3',
        clientName: 'Emily Rodriguez',
        clientEmail: 'emily.rodriguez@email.com',
        clientPhone: '+1 (555) 345-6789',
        date: '2024-01-25',
        time: '02:00 PM',
        duration: 50,
        type: 'Family Therapy',
        status: 'scheduled',
        notes: 'Family session - communication issues',
        location: 'Conference Room A',
        createdAt: '2024-01-22'
      },
      {
        id: '4',
        clientName: 'David Wilson',
        clientEmail: 'david.wilson@email.com',
        clientPhone: '+1 (555) 456-7890',
        date: '2024-01-25',
        time: '03:30 PM',
        duration: 50,
        type: 'Individual Therapy',
        status: 'scheduled',
        notes: 'Trauma recovery session',
        location: 'Office Room 2',
        createdAt: '2024-01-19'
      },
      {
        id: '5',
        clientName: 'Lisa Thompson',
        clientEmail: 'lisa.thompson@email.com',
        clientPhone: '+1 (555) 567-8901',
        date: '2024-01-26',
        time: '10:00 AM',
        duration: 50,
        type: 'Individual Therapy',
        status: 'scheduled',
        notes: 'Depression support session',
        location: 'Office Room 1',
        createdAt: '2024-01-21'
      },
      {
        id: '6',
        clientName: 'James Brown',
        clientEmail: 'james.brown@email.com',
        clientPhone: '+1 (555) 678-9012',
        date: '2024-01-26',
        time: '11:30 AM',
        duration: 50,
        type: 'Group Therapy',
        status: 'cancelled',
        notes: 'Client cancelled due to illness',
        location: 'Group Room',
        createdAt: '2024-01-20'
      }
    ];
    
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">Manage your client appointments</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your client appointments and schedule</p>
        </div>
        <Link href="/psychologist/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by client name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.clientName}
                      </h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(appointment.date)} at {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {appointment.duration} minutes • {appointment.type}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          {appointment.location}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4" />
                          {appointment.clientEmail}
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          {appointment.clientPhone}
                        </div>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  {appointment.status === 'scheduled' && (
                    <Button size="sm" className="w-full">
                      Start Session
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No appointments found' : 'No appointments yet'}
            </h3>
            <p className="text-gray-500 text-center mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by scheduling your first appointment with a client.'
              }
            </p>
            <Link href="/psychologist/appointments/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}