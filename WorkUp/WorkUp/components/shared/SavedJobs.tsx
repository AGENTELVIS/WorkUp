"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import createClerkSupabaseClient from "@/app/supabase/supabasecClient";

const SavedJobs = () => {
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSavedJobs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("savedjobs")
        .select(
          `
            id,
            job_id,
            postjob (
              id,
              title,
              company,
              location,
              jobdesc,
              created_at
            )
          `
        )
        .eq("user_id", user.id); // Use user.id safely here

      if (error) {
        console.error("Fetch saved jobs error:", error);
      } else {
        setJobs(data);
      }

      setLoading(false);
    };

    fetchSavedJobs();
  }, [user]); // Only refetch when user changes

  if (loading) return <p>Loading saved jobs...</p>;

  return (
    <div>
      {jobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        jobs.map((item) => (
          <div key={item.id} className="border p-4 my-2 rounded">
            <h2 className="text-lg font-semibold">{item.postjob.title}</h2>
            <p className="text-sm text-gray-600">
              {item.postjob.company} — {item.postjob.location}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
