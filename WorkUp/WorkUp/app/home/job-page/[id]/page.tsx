// app/job-details/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import  createClerkSupabaseClient  from "@/app/supabase/supabasecClient";
import { ApplyJobDialog } from "@/components/shared/ApplyJob";
import { useUser } from "@clerk/nextjs";
import PosterJobView from "@/components/shared/PosterJobView";
import SeekerJobView from "@/components/shared/SeekerJobView";
import { getJobWithCounts } from "@/lib/jobsapi";

export default function JobDetailsPage() { 
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const supabase = createClerkSupabaseClient();
  const { user } = useUser();
  const [isJobPoster, setIsJobPoster] = useState(true); 
  
  useEffect(() => {
    async function fetchJob() {
      try {
        const jobData = await getJobWithCounts(supabase,id as string);

        if (user && jobData.user_id !== user.id) {
          setIsJobPoster(false);
        }

        setJob(jobData);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    }

    if (id && user) fetchJob();
  }, [id, user]);

if (loading) return <p>Loading...</p>;
if (!job) return <p>Job not found</p>;

const isPoster = user?.id === job.user_id;

return (
  <div className="p-6">
    {isPoster ? (
      <PosterJobView job={job} setJob={setJob} />
    ) : (
      <SeekerJobView job={job} />
    )}
  </div>
);}