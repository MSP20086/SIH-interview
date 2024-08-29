'use client'

import React from 'react'
import { Tabs, Tab } from '@nextui-org/react'
import PastTableComponent from '@/components/Table/PastTable'
import FutureTableComponent from '@/components/Table/FutureTable'

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('scheduledInterview')

  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-4 p-4 pt-24 '>
      <Tabs
        aria-label='Options'
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
      >
        <Tab key='pastInterview' title='Past Interviews'>
          <div className='w-full'>
            <PastTableComponent/>
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