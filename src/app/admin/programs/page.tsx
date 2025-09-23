"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Clock,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';

export default function ProgramsPage() {
  const { data: programs } = api.admin.getPrograms.useQuery({});
  const utils = api.useUtils();
  const deleteMutation = api.admin.deleteProgram.useMutation({
    onSuccess: () => utils.admin.getPrograms.invalidate({})
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!programs) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
            <p className="text-gray-600">Manage your mental health programs</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600">Manage your mental health programs</p>
        </div>
        <Link href="/admin/programs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Program
          </Button>
        </Link>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(programs ?? []).map((program: any) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {program.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(program.status)}>
                  {program.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Program Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {program.date ? formatDate(program.date) : 'No date set'}
                </div>
                {/* duration not in schema; omit */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {program.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="mr-2 h-4 w-4" />
                  {program.currentAttendees}/{program.maxAttendees ?? '∞'} attendees
                </div>
              </div>

              {/* Psychologist info not in schema; omit */}

              {/* Price */}
              <div className="flex justify-between items-center pt-2 border-t">
                {/* price not in schema; omit */}
                <div className="flex space-x-2">
                  <Link href={`/admin/programs/${program.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => deleteMutation.mutate({ id: program.id })} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(programs ?? []).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Get started by creating your first mental health program.
            </p>
            <Link href="/admin/programs/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}