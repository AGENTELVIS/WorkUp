"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/app/supabase/supabasecClient";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const AppliedJobs = () => {
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAppliedJobs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("applications")
        .select(`
            id,
            job_id,
            status,
            postjob:job_id (
            id,
            title,
            company,
            location,
            jobdesc,
            created_at
            )
        `)
        .eq("user_id", user.id);

      if (error) {
        console.error("Fetch saved jobs error:", error);
      } else {
        setJobs(data);
      }

      setLoading(false);
    };

    fetchAppliedJobs();
  }, [user]); // Only refetch when user changes

  if (loading) return <p>Loading saved jobs...</p>;

  return (
    <div>
      {jobs.length === 0 ? (
        <p>No jobs applied for..</p>
      ) : (
        jobs.map((item) => (
          <div key={item.id} className="border p-4 my-2 rounded">
            <h2 className="text-lg font-semibold">{item.postjob.title}</h2>
            <p className="text-sm text-gray-600">
              {item.postjob.company} — {item.postjob.location}
            </p>
            <Badge
              className={cn(
                "rounded text-white",
                item.status === "accepted" && "bg-green-500 dark:bg-green-600 shadow-sm",
                item.status === "rejected" && "bg-red-500 dark:bg-red-600 shadow-sm",
                item.status === "inprogress" && "bg-blue-500 dark:bg-blue-600 shadow-sm"
              )}
            >
              {item.status}
            </Badge>

          </div>
        ))
      )}
    </div>
  )
}

export default AppliedJobs