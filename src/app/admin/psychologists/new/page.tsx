"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewPsychologistPage() {
  const router = useRouter();
  const utils = api.useUtils();
  const createPsychologist = api.admin.createPsychologist.useMutation({
    onSuccess: async () => {
      await utils.admin.getPsychologists.invalidate();
      router.push("/admin/psychologists");
    },
  });

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [availability, setAvailability] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name || !specialization || !bio || !email) {
      setError("Please fill in all required fields.");
      return;
    }

    const avail = availability
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    createPsychologist.mutate({
      name,
      specialization,
      bio,
      email,
      phone: phone || undefined,
      imageUrl: imageUrl || undefined,
      availability: avail,
      isActive,
    });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold">Add Psychologist</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Doe" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Specialization *</label>
          <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Child Psychology, CBT" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bio *</label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short professional bio" className="min-h-[140px]" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 555 5555" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Image URL</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Availability (comma separated)</label>
          <Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Mon-Fri 9am-5pm, Sat 10am-2pm" />
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="active" className="text-sm">Active</label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {createPsychologist.error && (
          <p className="text-sm text-red-600">{createPsychologist.error.message}</p>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={createPsychologist.isLoading}>
            {createPsychologist.isLoading ? "Creating..." : "Create"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/psychologists")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}


