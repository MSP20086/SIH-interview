'use client'
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import emailjs from '@emailjs/browser';

export default function ExpertForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jobPosition: '',
    interviewTime: '',
    HostLink: '',
    candidateLink: '',
    InterviewLink: '',
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const postData = async () => {
    try {
      const response = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Data posted successfully:', result);

      setId(result.interview._id.toString());
      setFormData((prevData) => ({
        ...prevData,
        InterviewLink: `http://localhost:3000/can/${result.interview._id}`,
      }));
      return result.interview._id;

    } catch (error) {
      console.error('Failed to post data:', error);
    }
  };

  const sendEmail = async () => {
    try {
      setIsLoading(true);
      const interviewId = await postData();

      if (interviewId) {
        emailjs.send(
          'service_u84bp1n',
          'template_0lrcsxn',
          { ...formData, InterviewLink: `http://localhost:3000/can/${interviewId}` },
          'ZIHQMfKI0iwengpp8'
        )
          .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            setIsLoading(false);
            handleClose();
          }, (err) => {
            console.error('FAILED...', err);
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setIsLoading(false);
    }
  };

  const handleroute = () => {
    window.open('https://nexusmeetapp.vercel.app/', '_blank');
  };

  return (
    <>
      <Button
        onPress={handleOpen}
        radius='full'
        className='bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'
      >
        Schedule New Interview
      </Button>
      <Modal
        backdrop='opaque'
        size='lg'
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="center"
        classNames={{
          backdrop:
            'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Interview Details
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label='Name'
                  name='name'
                  placeholder="Enter candidate's name"
                  variant='bordered'
                  onChange={handleChange}
                  isRequired
                />

                <Input
                  label='Email ID'
                  name='email'
                  placeholder="Enter candidate's email"
                  type='email'
                  variant='bordered'
                  onChange={handleChange}
                  isRequired
                  isClearable
                />

                <Input
                  label='Job Position'

                  name='jobPosition'
                  placeholder='Enter job position'
                  variant='bordered'
                  onChange={handleChange}
                  isRequired
                />

                <Input
                  label="Interview Time"
                  name="interviewTime"
                  placeholder="Select interview time"
                  type="datetime-local"
                  variant="bordered"
                  onChange={handleChange}
                  isRequired
                />
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>

                <Button color="primary" onPress={sendEmail} isLoading={isLoading}>
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
