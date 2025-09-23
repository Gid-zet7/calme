'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'UPCOMING' as 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'ONGOING',
    date: '',
    maxParticipants: '',
    location: '',
    content: '',
    imageUrl: '',
    videoUrl: '',
    leadPsychologistIds: [] as string[],
    attendeeUserIds: [] as string[],
  });

  // Fetch psychologists and users from the database
  const { data: psychologists, isLoading: isPsychologistsLoading, error: psychologistsError } = api.admin.getPsychologists.useQuery({});
  const { data: users } = api.admin.getUsers.useQuery({});
  const createProgram = api.programs.create.useMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare payload for programs.create (matches prisma schema)
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content || undefined,
        imageUrl: formData.imageUrl || undefined,
        date: new Date(formData.date),
        location: formData.location,
        isUpcoming: formData.status === 'UPCOMING',
        maxAttendees: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
        videoUrl: formData.videoUrl || undefined,
        leadPsychologistIds: formData.leadPsychologistIds,
        attendeeUserIds: formData.attendeeUserIds,
      };

      // Call the tRPC mutation to create the program
      await new Promise<void>((resolve, reject) => {
        createProgram.mutate(payload, {
          onSuccess: () => {
            resolve();
          },
          onError: (err) => {
            reject(err);
          }
        });
      });

      router.push('/admin/programs');
    } catch (error) {
      console.error('Error creating program:', error);
      // Optionally, show a user-facing error here
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  // Category removed from Program schema

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/programs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Program</h1>
          <p className="text-gray-600">Add a new mental health program to your platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Essential details about the program
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Mindfulness Workshop for Teens"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this program offers and who it's for..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Logistics */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Logistics</CardTitle>
              <CardDescription>
                When and where the program takes place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                      value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

               
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxParticipants">Max Attendees</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder="20"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Community Center, Online"
                  required
                />
              </div>

              
            </CardContent>
          </Card>
        </div>

        {/* Program Details */}
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
            <CardDescription>
              Additional information about the program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="leadPsychologists">Lead Psychologists</Label>
              <Select
                value={undefined}
                onValueChange={(value) => setFormData(p => ({ ...p, leadPsychologistIds: Array.from(new Set([...(p.leadPsychologistIds ?? []), value])) }))}
                disabled={isPsychologistsLoading || !!psychologistsError}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isPsychologistsLoading ? "Loading..." : "Add lead psychologist"} />
                </SelectTrigger>
                <SelectContent>
                  {isPsychologistsLoading && (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                  )}
                  {psychologistsError && (
                    <div className="px-4 py-2 text-sm text-red-500">Error loading psychologists</div>
                  )}
                  {psychologists &&
                    psychologists.length > 0 &&
                    psychologists.map((psychologist) => (
                      <SelectItem key={psychologist.id} value={psychologist.id}>
                        {psychologist.name}
                        {psychologist.specialization ? ` - ${psychologist.specialization}` : ''}
                      </SelectItem>
                    ))}
                  {psychologists && psychologists.length === 0 && !isPsychologistsLoading && (
                    <div className="px-4 py-2 text-sm text-gray-500">No psychologists found</div>
                  )}
                </SelectContent>
              </Select>
              {formData.leadPsychologistIds.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  Selected: {formData.leadPsychologistIds.length}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Long description or details"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="attendees">Attendees (Users)</Label>
              <Select
                value={undefined}
                onValueChange={(value) => setFormData(p => ({ ...p, attendeeUserIds: Array.from(new Set([...(p.attendeeUserIds ?? []), value])) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add attendee" />
                </SelectTrigger>
                <SelectContent>
                  {(users ?? []).map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {(u.firstName ?? '') + ' ' + (u.lastName ?? '')} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.attendeeUserIds.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  Selected: {formData.attendeeUserIds.length}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/programs">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Program
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}