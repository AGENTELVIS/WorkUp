// pages/view-applicants/[jobId].tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import createClerkSupabaseClient from "@/app/supabase/supabasecClient";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight, SquareArrowOutUpRightIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function ViewApplicantsPage() {
  const { id } = useParams();
  const client = createClerkSupabaseClient();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser()
  const router = useRouter()

  const handleStatusChange = async (applicantid: number, newStatus: string) => {
    
  const { error } = await client
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicantid);

  if (error) {
    console.error("Failed to update status:", error);
    return;
  }

  // Optional: update local state
  setApplicants((prev) =>
    prev.map((a) =>
      a.id === applicantid ? { ...a, status: newStatus } : a
    )
  );
  };
  useEffect(() => {
    if (!id || !user) return;
    
    const fetchApplicants = async () => {
      const { data, error } = await client
        .from("applications")
        .select(`
          created_at,
          email,
          phone,
          resume_path,
          job_id,
          user_id,
          answers,
          status,
          postjob:job_id!inner(
          user_id
          )
          `)
        .eq("job_id", id);

      if (error) {
        console.error("Failed to fetch applicants:", error);
        setLoading(false);
        return;
      }
      // Generate signed URLs
      const applicantsWithUrls = await Promise.all(
        data.map(async (applicant) => {
          if (!applicant.resume_path) return applicant;

          const { data: signed, error: signedError } = await client.storage
            .from("resume")
            .createSignedUrl(applicant.resume_path, 60); // 60 sec validity

          return {
            ...applicant,
            signedUrl: signed?.signedUrl || null,
          };
        })
      );

      setApplicants(applicantsWithUrls);
      setLoading(false);
    };

    fetchApplicants();
  }, [id]);

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Applicants</h1>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((a) => (
            <li key={a.id} className="border p-4 rounded">
              <p><strong>Email:</strong> {a.email}</p>
              <p><strong>Phone:</strong> {a.phone}</p>
              <p><strong>Status:</strong> {a.status}</p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["inprogress", "accepted", "rejected"].map((statusOption) => (
                    <DropdownMenuItem
                      key={statusOption}
                      onClick={() => handleStatusChange(a.id, statusOption)}
                    >
                      {statusOption}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {a.signedUrl ? (
                <a
                  href={a.signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">View Resume <SquareArrowOutUpRightIcon size={65} className="size-4"/></Button>
                </a>
              ) : (
                <p className="text-sm text-red-500">No resume available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}