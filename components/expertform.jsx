"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import emailjs from "@emailjs/browser";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast"; // Import toast

export default function ExpertForm({ onInterviewScheduled }) {
  const SearchParams = useSearchParams();
  const userId = SearchParams.get("id");
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null); // New state for resume file
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobPosition: "",
    interviewDate: "",
    interviewTime: "",
    HostLink: "",
    candidateLink: "",
    InterviewLink: "",
    skillSets: "",
    resumeLink: "",
    expertId: userId,
  });
  const [mes, setMes] = useState("");
  const [emailMes, setEmailMes] = useState("");
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleChange = (e) => {
    if (e.target.name === "interviewTime") {
      const time = e.target.value;
      const date = formData.interviewDate;
      const formattedDateTime = `${date}T${time}`;
      setFormData({ ...formData, interviewTime: formattedDateTime });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const postData = async () => {
    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setId(result.interview._id.toString());
      setFormData((prevData) => ({
        ...prevData,
        InterviewLink: `https://sih2024-seven.vercel.app/can?id=${result.interview._id}`,
      }));

      toast.success("Interview scheduled successfully!");
      setMes("Interview scheduled successfully!");
      return result.interview._id;
    } catch (error) {
      console.error("Failed to post data:", error);
      toast.error("Failed to schedule the interview");
      setMes("Failed to schedule the interview");
    }
  };

  // New function to upload resume
  const uploadResume = async (interviewId) => {
    if (!resumeFile) return;
    const fd = new FormData();
    fd.append("resume", resumeFile);
    fd.append("interviewId", interviewId);
    const res = await fetch("/api/resume", {
      method: "POST",
      body: fd,
    });
    if (!res.ok) throw new Error("Resume upload failed");
  };

  const sendEmail = async () => {
    try {
      setIsLoading(true);
      const interviewId = await postData();

      // Upload resume after interview is created
      if (interviewId && resumeFile) {
        await uploadResume(interviewId);
      }

      if (interviewId) {
        emailjs
          .send(
            "service_u84bp1n",
            "template_0lrcsxn",
            {
              ...formData,
              InterviewLink: `https://sih2024-seven.vercel.app/can?id=${interviewId}`,
            },
            "ZIHQMfKI0iwengpp8"
          )
          .then(
            (response) => {
              setIsLoading(false);
              if (onInterviewScheduled) {
                onInterviewScheduled();
              }
              toast.success("Email sent successfully!");
              setEmailMes("Email sent successfully!");
            },
            (err) => {
              setIsLoading(false);
              toast.error("Failed to send the email");
              setEmailMes("Failed to send the email");
            }
          );
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Error while scheduling and sending email");
    }
  };

  const handleroute = () => {
    window.open("https://nexusmeetapp.vercel.app/", "_blank");
  };

  return (
    <>
      <Button
        onPress={handleOpen}
        radius="full"
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
      >
        Schedule New Interview
      </Button>
      <Modal
        backdrop="opaque"
        size="lg"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="center"
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Interview Details
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  name="name"
                  placeholder="Enter candidate's name"
                  variant="bordered"
                  onChange={handleChange}
                  isRequired
                />

                <Input
                  label="Email ID"
                  name="email"
                  placeholder="Enter candidate's email"
                  type="email"
                  variant="bordered"
                  onChange={handleChange}
                  isRequired
                  isClearable
                />

                <Input
                  label="Job Position"
                  name="jobPosition"
                  placeholder="Enter job position"
                  variant="bordered"
                  onChange={handleChange}
                  isRequired
                />

                <div className="flex flex-row gap-2">
                  <Input
                    label="Interview Date"
                    name="interviewDate"
                    placeholder="Select interview time"
                    type="date"
                    variant="bordered"
                    onChange={handleChange}
                    isRequired
                  />
                  <Input
                    label="Interview Time"
                    name="interviewTime"
                    placeholder="Select interview time"
                    type="time"
                    variant="bordered"
                    onChange={handleChange}
                    isRequired
                  />
                </div>
                <Button color="primary" onPress={handleroute} variant="flat">
                  Click here to schedule a meeting
                </Button>
                <Input
                  label="Host Link"
                  name="HostLink"
                  placeholder="Enter Host meet link"
                  variant="bordered"
                  onChange={handleChange}
                  isRequired
                />
                <Input
                  label="Candidate Link"
                  name="candidateLink"
                  placeholder="Enter Attendee meet link"
                  variant="bordered"
                  onChange={handleChange}
                  isRequired
                />
                {/* Resume upload field */}
                <Input
                  label="Resume (PDF only)"
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>

                <Button
                  color="primary"
                  onPress={sendEmail}
                  isLoading={isLoading}
                >
                  Create & Share
                </Button>
                {mes && emailMes && (
                  <div className="text-center">
                    <div id="mes" className="text-sm text-gray-500">
                      {mes}
                    </div>
                    <div id="emailmes" className="text-sm text-gray-500">
                      {emailMes}
                    </div>
                  </div>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
