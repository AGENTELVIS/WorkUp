'use client'
import AppliedJobs from '@/components/shared/AppliedJobs'
import PostedJobs from '@/components/shared/PostedJobs'
import SavedJobs from '@/components/shared/SavedJobs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const MyJobs = () => {
  return (
    <div>
      <Tabs defaultValue="saved">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
          <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          <SavedJobs />
        </TabsContent>
        <TabsContent value="applied">
          <AppliedJobs />
        </TabsContent>
        <TabsContent value="posted">
          <PostedJobs />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MyJobs