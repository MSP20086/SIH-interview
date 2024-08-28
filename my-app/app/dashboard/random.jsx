'use client'
import TableComponent from '@/components/Table/PastTable'
import React from 'react'
import { Tabs, Tab } from '@nextui-org/react'

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
            <TableComponent tabType={activeTab} />
          </div>
        </Tab>
        <Tab key='scheduledInterview' title='Scheduled Interviews'>
          <div className='w-full'>
            <TableComponent tabType={activeTab} />
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Dashboard
