import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, Pencil, Users } from 'lucide-react'
import createClerkSupabaseClient from '@/app/supabase/supabasecClient';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const ManageJobDropdown = ({ jobId }: { jobId: string }) => {
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  const [hasApplicants, setHasApplicants] = useState<boolean | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!user || !jobId) return;

    const checkApplicants = async () => {
      const { count, error } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", jobId);

      if (error) {
        console.error("Failed to check applicants:", error);
        setHasApplicants(false); // fail-safe: allow editing
      } else {
        setHasApplicants((count ?? 0) > 0);
      }
    };

    checkApplicants();
  }, [user, jobId]);

  return (
    <div>
      <DropdownMenu >
        <DropdownMenuTrigger>
          <Ellipsis className="mt-0.5 mr-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem className='flex items-center gap-2' onClick={() => router.push(`/home/job-page/${jobId}`)}>
                <Pencil className="w-4 h-4" />
                Manage Job
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuItem className="text-red-600">Delete (WIP)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ManageJobDropdown;