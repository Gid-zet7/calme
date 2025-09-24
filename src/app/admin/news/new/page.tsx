"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewNewsPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const createNews = api.news.create.useMutation({
    onSuccess: async () => {
      await utils.news.getAll.invalidate();
      router.push("/admin/news");
    },
  });

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!title || !summary || !content || !author) {
      setError("Please fill in all required fields.");
      return;
    }

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    createNews.mutate({
      title,
      summary,
      content,
      imageUrl: imageUrl || undefined,
      author,
      tags: parsedTags,
      isPublished,
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Create News</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Summary * (1-2 sentences)</label>
          <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Content *</label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the article..." className="min-h-[200px]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Author *</label>
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="mental health, awareness" />
        </div>
        <div className="flex items-center gap-2">
          <input id="publish" type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          <label htmlFor="publish" className="text-sm">Publish immediately</label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {createNews.error && (
          <p className="text-sm text-red-600">{createNews.error.message}</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={createNews.isLoading}>
            {createNews.isLoading ? "Creating..." : "Create"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/news")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}


