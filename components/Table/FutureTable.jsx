"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Link,
} from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import { SearchIcon } from "./SearchIcon";
import ExpertForm from "../expertform";

const columns = [
  { name: "ID", uid: "_id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "ROLE", uid: "jobPosition", sortable: true },
  { name: "RESUME", uid: "resume" },
  { name: "EMAIL", uid: "email" },
  { name: "INTERVIEW DATE", uid: "interviewTime", sortable: true },
  { name: "INVITE", uid: "HostLink" },
  { name: "QUESTIONS", uid: "questions" },
];

const baseColumns = [
  "_id",
  "name",
  "jobPosition",
  "email",
  "interviewTime",
  "resume",
  "HostLink",
  "questions",
];

export default function FutureTableComponent({ userId }) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(baseColumns));
  const [statusFilter, setStatusFilter] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]); // fetched interviews, enriched with resume metadata

  const hasSearchFilter = Boolean(filterValue);

  // Fetch interviews, then enrich each with resume metadata from resumes collection
  const fetchInterviews = useCallback(async () => {
    try {
      if (!userId) {
        console.error("No userId provided");
        return;
      }

      const response = await fetch("/api/interviews/future", {
        headers: { userid: userId },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("API error:", err);
        return;
      }

      const data = await response.json();
      const { candidates = [] } = data;

      // Normalize interviewId field and prepare requests for resume metadata
      const normalized = candidates.map((c) => {
        // prefer explicit interviewId, fall back to _id (string)
        const interviewId = c.interviewId || (c._id ? String(c._id) : null);
        return { ...c, interviewId };
      });

      // Fetch resume metadata in parallel (meta=true returns {exists, filename})
      const metaPromises = normalized.map(async (row) => {
        if (!row.interviewId) return { interviewId: null, hasResume: false };
        try {
          const metaRes = await fetch(
            `/api/resume?interviewId=${encodeURIComponent(
              row.interviewId
            )}&meta=true`
          );
          if (!metaRes.ok) {
            // 404 -> no resume; other errors log and treat as no resume
            return { interviewId: row.interviewId, hasResume: false };
          }
          const meta = await metaRes.json();
          return {
            interviewId: row.interviewId,
            hasResume: !!meta.exists,
            resumeFilename: meta.filename || null,
            resumeContentType: meta.contentType || null,
          };
        } catch (err) {
          console.error("Resume meta fetch error for", row.interviewId, err);
          return { interviewId: row.interviewId, hasResume: false };
        }
      });

      const metas = await Promise.all(metaPromises);

      // Merge metadata into rows
      const merged = normalized.map((row) => {
        const m = metas.find((x) => x.interviewId === row.interviewId) || {};
        return {
          ...row,
          hasResume: !!m.hasResume,
          resumeFilename: m.resumeFilename,
        };
      });

      setUsers(merged);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleInterviewScheduled = useCallback(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        (user.name || "").toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter.size > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        statusFilter.has(user.status)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aValue = a[sortDescriptor.column] ?? "";
      const bValue = b[sortDescriptor.column] ?? "";
      const cmp = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const formatDate = (dateString) => {
    let date;
    try {
      date = parseISO(dateString);
    } catch (error) {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      return { formattedDate: "Invalid Date", formattedTime: "" };
    }
    return {
      formattedDate: format(date, "MM/dd/yyyy"),
      formattedTime: format(date, "HH:mm"),
    };
  };

  // Download resume handler (calls the binary GET endpoint)
  const handleViewResume = async (interviewId) => {
    try {
      const res = await fetch(
        `/api/resume?interviewId=${encodeURIComponent(interviewId)}`
      );
      if (!res.ok) throw new Error("Resume not found");

      const blob = await res.blob();
      // filename from Content-Disposition if present
      let filename = "resume.pdf";
      const disposition = res.headers.get("Content-Disposition");
      if (disposition) {
        const match = disposition.match(
          /filename\*?=UTF-8''(.+)|filename="?([^"]+)"?/
        );
        const extracted = match?.[1] || match?.[2];
        if (extracted) filename = decodeURIComponent(extracted);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Resume not found or download failed");
    }
  };

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "_id":
        return (user._id || "").toString().slice(-3);
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "jobPosition":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.team}
            </p>
          </div>
        );
      case "interviewTime": {
        const { formattedDate, formattedTime } = formatDate(cellValue);
        return (
          <div>
            <div>{formattedDate}</div>
            <div
              className="text-default-400 text-tiny"
              style={{ opacity: 0.7 }}
            >
              {formattedTime}
            </div>
          </div>
        );
      }
      case "resume":
        // Use hasResume flag obtained from the resumes collection
        if (!user.hasResume) {
          return (
            <Chip color="error" size="sm">
              Resume not uploaded
            </Chip>
          );
        }
        return (
          <div className="flex items-center justify-center">
            <Button
              color="primary"
              variant="solid"
              size="sm"
              onClick={() => handleViewResume(user.interviewId)}
            >
              View
            </Button>
          </div>
        );
      case "HostLink":
        return (
          <Button
            color="primary"
            variant="solid"
            size="sm"
            as={Link}
            href={cellValue}
            target="_blank"
            rel="noopener noreferrer"
            showAnchorIcon
          >
            Join
          </Button>
        );
      case "questions":
        return (
          <Button
            color="primary"
            variant="solid"
            size="sm"
            as={Link}
            href={`/questions?interviewId=${user.interviewId}`}
          >
            View Questions
          </Button>
        );
      default:
        return cellValue || "N/A";
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) setPage((p) => p + 1);
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) setPage((p) => p - 1);
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[58%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="w-full sm:w-auto">
            <ExpertForm onInterviewScheduled={handleInterviewScheduled} />
          </div>
        </div>
      </div>
    );
  }, [filterValue, handleInterviewScheduled, onClear, onSearchChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <small>Rows per page:</small>
          <select
            className="bg-white text-black rounded-md border p-1"
            value={rowsPerPage}
            onChange={onRowsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          onChange={(newPage) => setPage(newPage)}
          total={pages}
          onNext={onNextPage}
          onPrevious={onPreviousPage}
        />
      </div>
    );
  }, [
    page,
    pages,
    rowsPerPage,
    onRowsPerPageChange,
    onNextPage,
    onPreviousPage,
  ]);

  return (
    <Table
      aria-label="Future Interviews Table"
      sortDescriptor={sortDescriptor}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      topContent={topContent}
      bottomContent={bottomContent}
      className="opacity-95"
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
