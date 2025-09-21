"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';

export default function PsychologistsPage() {
  const { data: psychologists } = api.admin.getPsychologists.useQuery({});
  const utils = api.useUtils();
  const deleteMutation = api.admin.deletePsychologist.useMutation({
    onSuccess: () => utils.admin.getPsychologists.invalidate({})
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!psychologists) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Psychologists</h1>
            <p className="text-gray-600">Manage your team of mental health professionals</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Psychologists</h1>
          <p className="text-gray-600">Manage your team of mental health professionals</p>
        </div>
        <Link href="/admin/psychologists/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Psychologist
          </Button>
        </Link>
      </div>

      {/* Psychologists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(psychologists ?? []).map((psychologist: any) => (
          <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={psychologist.imageUrl ?? undefined} alt={psychologist.name} />
                  <AvatarFallback>{(psychologist.name || 'P').slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{psychologist.name}</CardTitle>
                  <CardDescription>{psychologist.specialization}</CardDescription>
                </div>
                <Badge variant={psychologist.isActive ? "default" : "secondary"}>
                  {psychologist.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {psychologist.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {psychologist.phone}
                </div>
                {/* location not in schema; omit */}
              </div>

              {/* Stats */}
              {/* rating/sessions not in schema; omit */}

              {/* Experience & Languages */}
              <div className="space-y-2 text-sm">
                {/* experience/languages not in schema; omit */}
              </div>

              {/* Bio Preview */}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {psychologist.bio}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t">
                {/* joinedAt not in schema; omit */}
                <div className="flex space-x-2">
                  <Link href={`/admin/psychologists/${psychologist.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => deleteMutation.mutate({ id: psychologist.id })} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(psychologists ?? []).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No psychologists yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start building your team by adding qualified mental health professionals.
            </p>
            <Link href="/admin/psychologists/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Psychologist
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}