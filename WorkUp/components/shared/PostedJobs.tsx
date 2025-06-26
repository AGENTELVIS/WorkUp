"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/app/supabase/supabasecClient";
import { useRouter } from "next/navigation";
import { Ellipsis, EllipsisVertical, Pencil, Users, Users2, UserSquare2 } from "lucide-react";
import { Badge } from "../ui/badge";
import ManageJobDropdown from "./ManageJobDropdown";

const PostedJobs = () => {
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    fetchPostedJobs();
  }, [user]);

  const fetchPostedJobs = async () => {
    setLoading(true);

    const { data: jobs, error: jobsError } = await supabase
      .from("postjob")
      .select("id, title, company, location, jobdesc, created_at,status")
      .eq("user_id", user?.id);

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      setLoading(false);
      return;
    }

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const { count, error: countError } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("job_id", job.id);

        return {
          ...job,
          hasApplicants: count && count > 0,
          applicantCount: count || 0,
        };
      })
    );

    setJobs(jobsWithApplicants);
    setLoading(false);
  };

  if (loading) return <p>Loading saved jobs...</p>;

  return (
    <div>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((item) => (
          <div
            key={item.id}
            className="flex border p-4 my-2 rounded justify-between"
          >
            <div className="ml-1">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">
                {item.company} — {item.location}
              </p>
              <Badge variant="default" className="bg-blue-500 dark:text-white font-semibold rounded">
                {item.status}
              </Badge>
              
            </div>
            <div className="flex">
              <ManageJobDropdown jobId={item.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostedJobs;
