"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";

export default function AdminNewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const router = useRouter();
  const utils = api.useUtils();

  const { data, isLoading } = api.admin.getNews.useQuery({});
  const article = useMemo(() => (data ?? []).find((n: any) => n.id === id), [data, id]);

  const updateMutation = api.admin.updateNews.useMutation({
    onSuccess: async () => {
      await utils.admin.getNews.invalidate({});
    }
  });
  const deleteMutation = api.admin.deleteNews.useMutation({
    onSuccess: async () => {
      await utils.admin.getNews.invalidate({});
      router.push("/admin/news");
    }
  });

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (article) {
      setTitle(article.title ?? "");
      setSummary((article as any).summary ?? "");
      setContent(article.content ?? "");
      setImageUrl(article.imageUrl ?? "");
      setTags((article.tags ?? []).join(", "));
      setIsPublished(!!article.isPublished);
    }
  }, [article]);

  if (isLoading) {
    return <div className="py-10 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Article not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push("/admin/news")}>Back to list</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);

    const payload: any = { id };
    if (title.trim()) payload.title = title;
    if (content.trim()) payload.content = content;
    if (summary.trim()) payload.excerpt = summary; // API expects 'excerpt', DB field is 'summary'
    if (imageUrl.trim()) payload.imageUrl = imageUrl;
    if (parsedTags.length > 0) payload.tags = parsedTags;
    payload.isPublished = isPublished;

    updateMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Article</h1>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => deleteMutation.mutate({ id })}>Delete</Button>
          <Button variant="outline" onClick={() => router.push("/admin/news")}>Back</Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Summary</label>
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Content</label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[220px]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Image URL</label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <input id="publish" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <label htmlFor="publish" className="text-sm">Published</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


