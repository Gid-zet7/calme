"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';
import TableUpload from '@/components/table-upload';
import type { FileWithPreview } from '@/hooks/use-file-upload';

export default function ResourcesPage() {
  const { data: resources, isLoading } = api.resources.getAdminList.useQuery({});
  const utils = api.useUtils();
  const deleteMutation = api.resources.delete.useMutation({
    onSuccess: () => {
      utils.resources.getAdminList.invalidate({});
    }
  });
  const presignMutation = api.resources.getPresignedUploadUrl.useMutation();
  const createMutation = api.resources.create.useMutation({
    onSuccess: () => utils.resources.getAdminList.invalidate({})
  });
  
  // Form state for new resource
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ANXIETY':
        return 'bg-blue-100 text-blue-800';
      case 'MINDFULNESS':
        return 'bg-green-100 text-green-800';
      case 'PARENTING':
        return 'bg-purple-100 text-purple-800';
      case 'TRAUMA':
        return 'bg-red-100 text-red-800';
      case 'DEPRESSION':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return '📄';
      case 'AUDIO':
        return '🎵';
      case 'VIDEO':
        return '🎥';
      case 'LINK':
        return '🔗';
      default:
        return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle file selection
  const handleFilesChange = (files: FileWithPreview[]) => {
    setSelectedFiles(files);
  };

  // Handle file upload to S3
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      for (const fileWithPreview of selectedFiles) {
        const file = fileWithPreview.file;
        
        if (file instanceof File) {
          console.log('Uploading file:', file.name, file.size, file.type);
          
          // Get presigned URL
          const presigned = await presignMutation.mutateAsync({
            fileName: file.name,
            fileType: file.type,
            contentLength: file.size
          });

          console.log('Got presigned URL:', presigned);

          // Upload to S3
          const response = await fetch(presigned.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file
          });

          console.log('S3 upload response:', response.status, response.statusText);

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          // Create resource in database
          const resource = await createMutation.mutateAsync({
            title: title || file.name,
            description: description || 'Uploaded resource',
            category: category || 'GENERAL',
            downloadUrl: presigned.publicUrl,
            fileSize: file.size,
            fileType: file.type?.toUpperCase() || 'FILE',
            isPublished: true,
          });

          console.log('Created resource:', resource);
        }
      }
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('GENERAL');
      setSelectedFiles([]);
      
      alert('Files uploaded successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
            <p className="text-gray-600">Manage your mental health resources</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600">Manage your mental health resources and materials</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Resource</CardTitle>
          <CardDescription>
            Upload files to AWS S3 and create resource entries in the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Resource Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Resource title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Resource description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., GENERAL, ANXIETY, MINDFULNESS"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          {/* File Upload Component */}
          <TableUpload
            maxFiles={5}
            maxSize={50 * 1024 * 1024} // 50MB
            accept=".pdf,.doc,.docx,.txt,.zip,.xlsx,.xls,.pptx,.ppt"
            multiple={true}
            simulateUpload={false}
            onFilesChange={handleFilesChange}
            className="w-full"
          />

          {/* Upload Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleFileUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="min-w-[120px]"
              variant="primary"
            >
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(resources ?? []).map((resource: any) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getTypeIcon(resource.fileType)}</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {resource.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getCategoryColor(resource.category)}>
                    {resource.category}
                  </Badge>
                  <Badge variant={resource.isPublished ? "default" : "secondary"}>
                    {resource.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resource Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Download className="mr-1 h-4 w-4" />
                  {resource.downloadCount} downloads
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(resource.updatedAt)}
                </div>
              </div>

              {/* Tags */}
              {/* optional tags removed; not in schema */}

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/resources/${resource.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button onClick={() => deleteMutation.mutate({ id: resource.id })} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(resources ?? []).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start building your resource library by adding helpful materials.
            </p>
            <Link href="/admin/resources/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}