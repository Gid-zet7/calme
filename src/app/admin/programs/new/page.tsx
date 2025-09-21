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

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'UPCOMING',
    startDate: '',
    endDate: '',
    maxParticipants: '',
    location: '',
    duration: '',
    price: '',
    psychologistId: '',
    category: '',
    requirements: '',
    objectives: ''
  });

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
      // TODO: Replace with actual tRPC call
      console.log('Creating program:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/admin/programs');
    } catch (error) {
      console.error('Error creating program:', error);
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

  const categoryOptions = [
    { value: 'ANXIETY', label: 'Anxiety Management' },
    { value: 'DEPRESSION', label: 'Depression Support' },
    { value: 'MINDFULNESS', label: 'Mindfulness' },
    { value: 'PARENTING', label: 'Parenting Support' },
    { value: 'TRAUMA', label: 'Trauma Recovery' },
    { value: 'STRESS', label: 'Stress Management' },
    { value: 'RELATIONSHIPS', label: 'Relationship Therapy' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Mock psychologists data
  const psychologists = [
    { id: '1', name: 'Dr. Sarah Johnson', specialization: 'Adolescent Psychology' },
    { id: '2', name: 'Dr. Michael Chen', specialization: 'Anxiety Disorders' },
    { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Family Therapy' },
    { id: '4', name: 'Dr. David Wilson', specialization: 'Trauma Recovery' }
  ];

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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 4 weeks, 8 sessions"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Max Participants *</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', e.target.value)}
                    placeholder="20"
                    min="1"
                    required
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

              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="150"
                  min="0"
                  step="0.01"
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
              <Label htmlFor="psychologistId">Lead Psychologist *</Label>
              <Select value={formData.psychologistId} onValueChange={(value) => handleInputChange('psychologistId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select psychologist" />
                </SelectTrigger>
                <SelectContent>
                  {psychologists.map((psychologist) => (
                    <SelectItem key={psychologist.id} value={psychologist.id}>
                      {psychologist.name} - {psychologist.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="objectives">Learning Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="What will participants learn or achieve?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                placeholder="Any prerequisites or requirements for participants"
                rows={3}
              />
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