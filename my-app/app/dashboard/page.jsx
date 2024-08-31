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

  const userId = searchParams.get('id')
  console.log(`id: ${userId}`)

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
    return (<section className="bg-gradient-to-b from-gray-100 to-white h-screen flex items-center justify-center">
      <div className="flex items-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="ml-4 text-gray-800">Loading user data...</p>
      </div>
    </section>)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4 '>
      <Tabs
        aria-label='Options'
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
      >
        <Tab key='pastInterview' title='Past Interviews'>
          <div className='w-full'>
            <PastTableComponent userId={userId} />
          </div>
        </Tab>
        <Tab key='scheduledInterview' title='Scheduled Interviews'>
          <div className='w-full'>
            <FutureTableComponent userId={userId} />
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Dashboard
