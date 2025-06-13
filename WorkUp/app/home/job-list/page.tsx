"use client";

import { useUser } from "@clerk/nextjs";
import { Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import React from "react";
import { useJobs } from "@/lib/jobsapi";
import  createClerkSupabaseClient from "@/app/supabase/supabasecClient";
import { useRouter } from "next/navigation";

const Joblist = () => {
  const { user } = useUser();
  const { jobs, loading } = useJobs();
  const supabase = createClerkSupabaseClient()
  const router = useRouter()

  const handleClick = (id: number) => {
    router.push(`/home/job-page/${id}`);
  };

  async function saveJob(userId: string, jobId: number){
  const { data, error } = await supabase.from("savedjobs").insert({
    user_id: userId,
    job_id: jobId,
  });

  if (error) throw error;
  return data;
}

  async function handleSave(jobId: number) {
    try {
      if (!user) return alert("You must be logged in to save jobs.");
      await saveJob(user.id, jobId);
      alert("Job saved successfully!");
    } catch (err) {
      console.error("Save job error:", err);
      alert("Failed to save job.");
    }
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-3 gap-5">
        <Card className="col-span-1 text-center h-120">Filters</Card>
        <Card className="col-span-2 p-4 space-y-4">
          {loading && <p>Loading jobs...</p>}
          {!loading && jobs.length === 0 && <p>No jobs found.</p>}

          {!loading &&
            jobs.map((job: any) => (
              <div key={job.id} className="border-b pb-3">
                <div className="flex justify-between items-center cursor-pointer">
                  <div onClick={()=>handleClick(job.id)}>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <button onClick={() => handleSave(job.id)}>
                    <Bookmark className="hover:text-blue-600" />
                  </button>
                </div>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
};

export default Joblist;
