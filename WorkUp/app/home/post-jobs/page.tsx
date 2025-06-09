"use client"

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from '@/components/ui/button'
import { Form,FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { useUser } from '@clerk/nextjs'
import { createClerkSupabaseClient } from '@/app/supabase/supabasecClient'
import CompanyDialog  from '@/components/shared/AddCompany'
import RichTextEditor from '@/components/shared/Editor'
import CompanySeletor from '@/components/shared/CompanySeletor'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {State} from 'country-state-city'

const postSchema = z.object({
  title: z.string().min(1, {message: "Please enter Job title.",}),
  company:z.string().min(1,{message:"Please enter Company name"}),
  location:z.string().min(1,{message:"Please enter Job location"}),
  jobtype:z.string().min(1,{message:"Please enter Job type"}),
  workplace:z.string().min(1,{message:"Please enter Workplace"}),
})

const PostJobs = () => {
  const [content, setContent] = useState<string>("");
  const {user} = useUser()
  const client = createClerkSupabaseClient()
  const [loading, setLoading] = useState(true)
  const [Jobs,setJobs] = useState<any[]>([])

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      company:"",
      location:"",
      jobtype:"",
      workplace:"",

    },
  })

  useEffect(() => {
      if (!user) return
  
      async function loadJobs() {
        setLoading(true)
        const { data, error } = await client.from('postjob').select()
        if (!error) setJobs(data)
        setLoading(false)
      }
  
      loadJobs()
    }, [user])

  async function onSubmit(values: z.infer<typeof postSchema>) {
     
    const {error} = await client.from('postjob').insert({
      title:values.title,
      company:values.company,
      location:values.location,
      jobtype:values.jobtype,
      workplace:values.workplace,
      jobdesc:content,
      user_id:user?.id
    })

    if (error) {
    console.error("Error inserting job:", error)
    alert("Error saving job. Check console.")
    return
    }
    window.location.reload()
    console.log(values)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=''>
            {loading && <p>Loading...</p>}

            {!loading && Jobs.length > 0 && Jobs.map((job: any) =><div key={job.id}> <p >{job.title}</p>
            <div className="prose dark:prose-invert max-w-none mt-4"
            dangerouslySetInnerHTML={{ __html: job.jobdesc }} />
            </div>
            )}

            {!loading && Jobs.length === 0 && <p>No Jobs found</p>}
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
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Full-Time" {...field} />
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
                    <Input placeholder="Office" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <RichTextEditor content={content} onChange={setContent} />
            <Button type="submit">Submit</Button>
          </div>
        </form>
        <CompanyDialog/>
      </Form>
    </>
  )
  
}

export default PostJobs