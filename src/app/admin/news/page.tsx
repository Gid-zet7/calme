"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/trpc/react';

export default function NewsPage() {
  const { data: news } = api.admin.getNews.useQuery({});
  const utils = api.useUtils();
  const deleteMutation = api.admin.deleteNews.useMutation({
    onSuccess: () => utils.admin.getNews.invalidate({})
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EVENTS':
        return 'bg-blue-100 text-blue-800';
      case 'RESEARCH':
        return 'bg-green-100 text-green-800';
      case 'TIPS':
        return 'bg-yellow-100 text-yellow-800';
      case 'WORKSHOPS':
        return 'bg-purple-100 text-purple-800';
      case 'NEWS':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!news) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
            <p className="text-gray-600">Manage your news articles and blog posts</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="h-24 w-24 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-600">Manage your news articles and blog posts</p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Write Article
          </Button>
        </Link>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {(news ?? []).map((article: any) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                {/* Article Image */}
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {article.title}
                        </h3>
                        {/* featured flag not in schema; omit badge */}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>

                      {/* Article Meta */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(article.publishedAt as any)}
                        </div>
                        <div className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" />
                          {/* viewCount not in schema; omit */}
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center space-x-2 mt-2">
                        {/* category not in schema; omit */}
                        <Badge variant={article.isPublished ? "default" : "secondary"}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        {(article.tags || []).slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/news/${article.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/news/${article.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button onClick={() => deleteMutation.mutate({ id: article.id })} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {news.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Start sharing knowledge and updates with your community.
            </p>
            <Link href="/admin/news/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Write Article
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}