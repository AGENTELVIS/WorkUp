import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import createClerkSupabaseClient from "@/app/supabase/supabasecClient";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function PosterJobView({
  job,
  setJob,
}: {
  job: any;
  setJob: (job: any) => void;
}) {
  const supabase = createClerkSupabaseClient();
  const { user } = useUser();
  const router = useRouter();

  const handleStatusChange = async (jobid: number, newStatus: string) => {
    const { error } = await supabase
      .from("postjob")
      .update({ status: newStatus })
      .eq("id", jobid);

    if (error) {
      console.error("Failed to update status:", error);
      return;
    }

    // ✅ Update local job state to reflect new status
    setJob({ ...job, status: newStatus });
  };

    
  return (
    <div>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-gray-600">{job.company} • {job.location}</p>

        {/* Management Options */}
        <div className="flex justify-between items-center mt-4">
            <p><strong>Status:</strong> {job.status}</p>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["open", "paused", "closed"].map((statusOption) => (
                    <DropdownMenuItem
                      key={statusOption}
                      onClick={() => handleStatusChange(job.id, statusOption)}
                    >
                      {statusOption}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <p className="text-sm mt-2">Applicants: {job.applicantCount}</p>
        <p className="text-sm mt-2">Saved by: {job.savedCount}</p>
        <div className="flex justify-between items-center mt-4">
            <Button onClick={() => router.push(`/home/post-jobs/${job.id}/applicants`)}>
                View Applicants
            </Button>
            <Pencil
            onClick={() => {
                if (job.applicantCount === 0) {
                router.push(`/home/post-jobs/${job.id}`);
                }
            }}
            className={`${
                job.applicantCount > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-800 cursor-pointer underline"
            }`}
            />
        </div>
    </div>
  );
}
