'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  User,
  Pagination,
} from '@nextui-org/react'
import { format, parseISO } from 'date-fns'
import { SearchIcon } from './SearchIcon'
import ExpertForm from '../expertform'

const columns = [
  { name: 'ID', uid: '_id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'ROLE', uid: 'jobPosition', sortable: true },
  { name: 'RESUME', uid: 'resumeLink' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'INTERVIEW DATE', uid: 'interviewTime', sortable: true },
  // { name: 'INVITE', uid: 'HostLink' },
  { name: 'REPORT', uid: 'report' },
  { name: 'QUESTIONS', uid: 'questions' },
]

// const statusOptions = [
//   { name: 'Selected', uid: 'selected' },
//   { name: 'Rejected', uid: 'rejected' },
//   { name: 'Pending', uid: 'pending' },
// ]

const statusColorMap = {
  selected: 'success',
  rejected: 'danger',
  pending: 'warning',
}

const baseColumns = [
  '_id',
  'name',
  'jobPosition',
  'email',
  'status',
  'interviewTime',
  'resumeLink',
  'HostLink',
  // 'questions',
  'report',
]

export default function PastTableComponent({ userId }) {
  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(new Set(baseColumns))
  const [statusFilter, setStatusFilter] = useState(new Set([]))
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'name',
    direction: 'ascending',
  })
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([]) // State for storing fetched users

  const hasSearchFilter = Boolean(filterValue)

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (!userId) {
          console.error('No userId provided')
          return
        }

        const response = await fetch('/api/interviews/past', {
          headers: {
            userid: userId, // Ensure proper header key
          },
        })

        const data = await response.json()
        console.log('API response data:', data) // Debug log

        if (response.ok) {
          const { candidates = [] } = data
          setUsers(candidates)
          console.log('Fetched candidates:', candidates) // Debug log
        } else {
          console.error('API error message:', data.message)
        }
      } catch (error) {
        console.error('Error fetching interviews:', error)
      }
    }

    fetchInterviews()
  }, [userId]) // Refetch if userId changes

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (statusFilter.size > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        statusFilter.has(user.status)
      )
    }

    return filteredUsers
  }, [users, filterValue, statusFilter])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aValue = a[sortDescriptor.column]
      const bValue = b[sortDescriptor.column]
      const cmp = aValue < bValue ? -1 : aValue > bValue ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const formatDate = (dateString) => {
    let date
    try {
      date = parseISO(dateString)
    } catch (error) {
      console.error('Error parsing date:', dateString, error)
      date = new Date(dateString) // Fallback
    }
    if (isNaN(date.getTime())) {
      return { formattedDate: 'Invalid Date', formattedTime: '' }
    }
    const formattedDate = format(date, 'MM/dd/yyyy')
    const formattedTime = format(date, 'HH:mm')
    return { formattedDate, formattedTime }
  }

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        )
      case 'jobPosition':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-small capitalize'>{cellValue}</p>
            <p className='text-bold text-tiny capitalize text-default-400'>
              {user.team}
            </p>
          </div>
        )
      case 'status':
        return (
          <Chip
            className='capitalize'
            color={statusColorMap[user.status]}
            size='sm'
            variant='flat'
          >
            {cellValue}
          </Chip>
        )
      case 'interviewTime':
        const { formattedDate, formattedTime } = formatDate(cellValue)
        return (
          <div>
            <div>{formattedDate}</div>
            <div
              className='text-default-400 text-tiny'
              style={{ opacity: 0.7 }}
            >
              {formattedTime}
            </div>
          </div>
        )
      case 'resumeLink':
        return (
          <Button
            color='primary'
            variant='solid'
            size='sm'
            as='a'
            href={cellValue}
            rel='noopener noreferrer'
          >
            View Resume
          </Button>
        )
      case 'report':
        return (
          <Button
            color='primary'
            variant='solid'
            size='sm'
            as='a'
            href={cellValue}
            target='_blank'
            rel='noopener noreferrer'
          >
            View Report
          </Button>
        )
      case 'questions':
        return (
          <Button
            color='primary'
            variant='solid'
            size='sm'
            as='a'
            href={`/questions`}
            target='_blank'
            rel='noopener noreferrer'
          >
            View Questions
          </Button>
        )
      default:
        return cellValue || 'N/A'
    }
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center gap-3'>
          <Input
            isClearable
            className='w-full sm:max-w-[58%]'
            placeholder='Search by name...'
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <ExpertForm />
        </div>

        <div className='flex justify-between items-center'>
          <span className='text-default-400 text-small'>
            Total {users.length} users
          </span>
          <label className='flex items-center text-default-400 text-small'>
            Rows per page:
            <select
              className='bg-transparent outline-none text-default-400 text-small'
              onChange={onRowsPerPageChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    onClear,
  ])

  const bottomContent = useMemo(() => {
    return (
      <div className='py-2 px-2 flex justify-between items-center'>
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden sm:flex w-[30%] justify-end gap-2'>
          <Button
            isDisabled={page === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={page === pages}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onNextPage,
    onPreviousPage,
  ])

  return (
    <Table
      aria-label='User Data Table'
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      selectedKeys={selectedKeys}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement='outside'
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No users found'} items={sortedItems}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
