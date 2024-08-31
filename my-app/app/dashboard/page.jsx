'use client'

import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from '@nextui-org/react'
import PastTableComponent from '@/components/Table/PastTable'
import FutureTableComponent from '@/components/Table/FutureTable'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/context/user'
import { useSearchParams } from 'next/navigation'


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('scheduledInterview')
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()

  const userId = searchParams.get('userid')
  console.log(`userid: ${userId}`)

  useEffect(() => {
    if (user === null) {
      return
    }

    if (user.role !== 'expert') {
      router.push('/')
      return
    }

    setHasAccess(true)
    setLoading(false)
  }, [user, router])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4 p-4 pt-24 '>
      <Tabs
        aria-label='Options'
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
      >
        <Tab key='pastInterview' title='Past Interviews'>
          <div className='w-full'>
            <PastTableComponent />
          </div>
        </Tab>
        <Tab key='scheduledInterview' title='Scheduled Interviews'>
          <div className='w-full'>
            <FutureTableComponent />
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Dashboard
