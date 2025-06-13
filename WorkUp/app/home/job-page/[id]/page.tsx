// app/job-details/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import  createClerkSupabaseClient  from "@/app/supabase/supabasecClient";

export default function JobDetailsPage() { 
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const supabase = createClerkSupabaseClient();

  useEffect(() => {
    async function fetchJob() {
      
      const { data, error } = await supabase
        .from("postjob")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setJob(data);
      setLoading(false);
    }

    if (id) fetchJob();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-600">
        {job.company} • {job.location}
      </p>
      <div
        className="prose dark:prose-invert mt-6"
        dangerouslySetInnerHTML={{ __html: job.jobdesc }}
      />
    </div>
  );
}
