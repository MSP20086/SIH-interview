'use client'

import React from 'react'
import { Tabs, Tab } from '@nextui-org/react'
import PastTableComponent from '@/components/Table/PastTable'
import FutureTableComponent from '@/components/Table/FutureTable'
import { useSearchParams } from 'next/navigation'

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('scheduledInterview')
  const SearchParams = useSearchParams()

  const userId = SearchParams.get('userid');
  console.log(`userId: ${userId}`);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4 '>
      <Tabs
        aria-label='Options'
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
      >
        <Tab key='pastInterview' title='Past Interviews'>
          <div className='w-full'>
            <PastTableComponent userId={userId}/>
          </div>
        </Tab>
        <Tab key='scheduledInterview' title='Scheduled Interviews'>
          <div className='w-full'>
            <FutureTableComponent userId={userId}/>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Dashboard
