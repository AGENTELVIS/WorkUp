"use client"

import React, { useEffect, useRef, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from '@/components/ui/button'
import { Form,FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import  createClerkSupabaseClient  from '@/app/supabase/supabasecClient'
import CompanyDialog  from '@/components/shared/AddCompany'
import RichTextEditor from '@/components/shared/Editor'
import CompanySeletor from '@/components/shared/CompanySeletor'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import {State} from 'country-state-city'
import { useRouter } from "next/navigation";
import { redirect, useParams } from 'next/navigation'
import ScreeningQuestions from "@/components/shared/ScreenQuestions";
import { postSchema } from '@/lib/validation'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { toast } from 'sonner'
import { Variable } from 'lucide-react'
import { toggleVariants } from '../ui/toggle'

export default function PostJobForm() {
  const [content, setContent] = useState<string>("");
  const {user} = useUser()
  const client = createClerkSupabaseClient()
  const { id } = useParams(); // job id
  const isEditing = !!id;
  const hasFetched = useRef(false);
  const router = useRouter();
  const [date,setDate] = useState<Date | undefined>(new Date())

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      company:"",
      location:"",
      jobtype:"",
      workplace:"",
      screeningquestions:[],
      openings:1,
    },
  })
  const { watch, setValue } = form;
  const screeningQuestions = watch("screeningquestions");

  useEffect(() => {
    async function fetchJob() {
      if (!isEditing || hasFetched.current) return;
      hasFetched.current = true;

      // Fetch job data
      const { data: job, error } = await client
        .from("postjob")
        .select("*")
        .eq("id", id)
        .single();

      if (!job || error) {
        console.error("Job not found or error:", error);
        router.push("/home/job-list");
        return;
      }

      // ✅ Check if job has applicants
      const { count, error: countError } = await client
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", id);

      if (count && count > 0) {
        toast.error("Editing is not allowed",{
          description: "Job already has applicants."},
        );
        setTimeout(() => {
          router.push("/home/job-list");
        }, 0);

        return;
      }
      if (job.user_id !== user?.id) {
        toast.error("Access Denied",{
          description: "You are not allowed to edit this job."},
        );
        setTimeout(() => {
          router.push("/home/job-list");
        }, 0);

        return;
      }


      form.reset({
        title: job.title,
        company: job.company,
        location: job.location,
        jobtype: job.jobtype,
        workplace: job.workplace,
        openings: job.openings,
        screeningquestions: job.screeningquestions,
      });
      setContent(job.jobdesc);
    }

    fetchJob();
  }, [id, user]);


  async function onSubmit(values: z.infer<typeof postSchema>) {
    const payload = {
      title: values.title,
      company: values.company,
      location: values.location,
      jobtype: values.jobtype,
      workplace: values.workplace,
      openings: values.openings,
      screeningquestions: values.screeningquestions,
      jobdesc: content,
      user_id: user?.id,
    };

    const { data,error } = isEditing
      ? await client.from("postjob").update(payload).eq("id", id)
      : await client.from("postjob").insert(payload);

    if (error) {
      console.error("Error saving job:", error);
      alert("Error saving job. Check console.");
      return;
    }
    console.log("Update result:", { data, error });
    redirect("/home/job-list");
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input placeholder="Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <CompanySeletor value={field.value} onChange={field.onChange}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            name="location"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            />
            <FormField
              control={form.control}
              name="jobtype"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Full Time">Full Time</SelectItem>
                          <SelectItem value="Part Time">Part Time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Volunteer">Volunteer</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workplace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workplace</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select workplace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="On-site">On-site</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of openings</FormLabel>
                  <FormControl>
                    <Input type='number' {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="screeningquestions"
              render={() => (
                <FormItem>
                  <FormLabel>Screening Questions</FormLabel>
                  <ScreeningQuestions
                    value={screeningQuestions}
                    onChange={(updated) => setValue("screeningquestions", updated)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <RichTextEditor content={content} onChange={setContent} />
            <Button type="submit">Submit</Button>
        </form>
        <CompanyDialog/>
      </Form>
    </>
  )
  
}