import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ApplyJobDialog } from "./ApplyJob";
import { useUser } from "@clerk/nextjs";



export default function SeekerJobView({ job }: { job: any }) {
    const router = useRouter()
    const { user } = useUser();
    const isPoster = user?.id === job.user_id;
  return (
    <div>
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-600">{job.company} • {job.location}</p>
      <p className="text-sm mt-2">Applicants: {job.applicantCount}</p>

      <div
        className="prose dark:prose-invert mt-6"
        dangerouslySetInnerHTML={{ __html: job.jobdesc }}
      />

      <ApplyJobDialog
        jobId={job.id}
        screeningQuestions={job.screeningquestions || []}
        disabled={isPoster}
      />
    </div>
  );
}
