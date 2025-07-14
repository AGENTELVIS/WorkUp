'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

import { useUser } from "@clerk/nextjs"
import createClerkSupabaseClient from "@/app/supabase/supabasecClient"
import { User } from "@clerk/nextjs/server"

const applySchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  resume: z.any()
    .refine((file) => file?.length === 1, { message: "Resume required" })
    .refine((file) => ["application/pdf"].includes(file?.[0]?.type), {
      message: "Must be PDF",
    }),
  answers: z.array(z.object({ answer: z.string().min(1) })),
})

type ApplyFormType = z.infer<typeof applySchema>

export function ApplyJobDialog({ jobId, screeningQuestions,disabled = false }: {
  jobId: string,
  screeningQuestions: { question: string }[],
  disabled:boolean
}) {
  const { user } = useUser();
  const supabase = createClerkSupabaseClient();
  const [step, setStep] = useState(1);
  const hasQuestions = screeningQuestions.length > 0;

  const form = useForm<ApplyFormType>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      email: "",
      phone: "",
      resume: undefined,
      answers: screeningQuestions.map(() => ({ answer: "" })),
    },
  });

  const { register, handleSubmit, watch, formState: { errors }, reset } = form;

  const closeAndReset = () => {
    reset();
    setStep(1);
  };

  const onSubmit = async (values: ApplyFormType) => {
    try {
      const file = values.resume[0];
      const ext = file.name.split('.').pop();
      const filePath = `resume/${user?.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('resume')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;


      const { error } = await supabase.from('applications').insert({
        user_id: user?.id,
        job_id: jobId,
        email: values.email,
        phone: values.phone,
        resume_path: filePath,
        status:'inprogress',
        answers: screeningQuestions.map((q, i) => ({
          question: q.question,
          answer: values.answers?.[i]?.answer || "",
        })),
      });

      if (error) throw error;

      alert("✅ Application submitted!");
      closeAndReset();
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && closeAndReset()}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Apply</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for this Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(step === 1 || !hasQuestions) && (
            <>
              <div>
                <Label>Email</Label>
                <Input {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <Label>Phone</Label>
                <Input {...register("phone")} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <Label>Resume (PDF only)</Label>
                <Input type="file" {...register("resume")} />
                {errors.resume && <p className="text-sm text-red-500">{}</p>}
              </div>
              {hasQuestions ? (
                <Button type="button" onClick={() => setStep(2)} className="w-full">Next</Button>
              ) : (
                <Button type="submit" className="w-full">Submit</Button>
              )}
            </>
          )}

          {step === 2 && hasQuestions && (
            <>
              {screeningQuestions.map((q, index) => (
                <div key={index}>
                  <Label>{q.question}</Label>
                  <Input {...register(`answers.${index}.answer`)} />
                  {errors.answers?.[index]?.answer && (
                    <p className="text-sm text-red-500">{errors.answers[index]?.answer?.message}</p>
                  )}
                </div>
              ))}
              <div className="flex justify-between gap-2">
                <Button type="button" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit">Submit</Button>
              </div>
            </>
          )}
        </form>

        <DialogClose asChild>
          <Button variant="ghost" className="mt-4 w-full" onClick={closeAndReset}>Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}