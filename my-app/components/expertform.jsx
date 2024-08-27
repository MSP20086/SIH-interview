'use client'
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react"; 
import emailjs from '@emailjs/browser'

export default function ExpertForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobPosition: '',
    interviewTime: '',
    candidateLink: '',
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send email using EmailJS
  const sendEmail = () => {
    emailjs.send(
      'service_u84bp1n', 
      'template_0lrcsxn',
      formData,
      'ZIHQMfKI0iwengpp8' 
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      handleClose();
    }, (err) => {
      console.error('FAILED...', err);
    });
  };

  return (
    <>
      <Button onPress={handleOpen} color="primary">Open Modal</Button>
      <Modal 
        backdrop="opaque" 
        size="lg"
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
        placement="top-center"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Interview Details</ModalHeader>
              <ModalBody>
                {/* Input for Candidate Name */}
                <Input
                  autoFocus
                  label="Name"
                  name="name"
                  placeholder="Enter candidate's name"
                  variant="bordered"
                  onChange={handleChange}
                />
                
                {/* Input for Email ID */}
                <Input
                  label="Email ID"
                  name="email"
                  placeholder="Enter candidate's email"
                  type="email"
                  variant="bordered"
                  onChange={handleChange}
                />
                
                {/* Input for Job Position */}
                <Input
                  label="Job Position"
                  name="jobPosition"
                  placeholder="Enter job position"
                  variant="bordered"
                  onChange={handleChange}
                />
                
                {/* Input for Interview Time */}
                <Input
                  label="Interview Time"
                  name="interviewTime"
                  placeholder="Select interview time"
                  type="datetime-local"
                  variant="bordered"
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                {/* Close Button */}
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                
                {/* Share Button */}
                <Button color="primary" onPress={sendEmail}>
                  Create & Share
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
