'use client'

import React, { useState } from 'react'
import { Tab } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import CredentialVerifications from '../CredentialVerifications/CredentialVerifications';
import RequestedCredentialVerification from '../RequestedCredentialVerification/RequestedCredentialVerification';

export default function HomeBody() {
  const [value, setValue] = useState('1');

  const handleChange = (event: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <section className="flex flex-col gap-5">
      <TabContext value={value}>
        <div>
          <TabList onChange={handleChange}>
            <Tab label="Your credentials" value="1" />
            <Tab label="Credential verification requests" value="2" />
          </TabList>
        </div>
        <TabPanel value="1">
          <CredentialVerifications />
        </TabPanel>
        <TabPanel value="2">
          <RequestedCredentialVerification />
        </TabPanel>
      </TabContext>
    </section>
  )
}