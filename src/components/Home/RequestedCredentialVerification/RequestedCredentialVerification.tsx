'use client'

import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSession } from 'next-auth/react';
import _ from 'lodash'

import { getCredVerificationRequestsByVerifier } from '../../../../lib/api/FlureeMethods';
import CredentialVerificationRow from './CredentialVerificationRow/CredentialVerificationRow';

interface IRequestedCredentialVerification {
  "@id": string
  user: {
    'user:userName': string
    'user:email': string
  }
  verifier: {
    'user:userName': string
    'user:email': string
  }
  status: 'pending' | 'accepted' | 'denied'
}

export default function RequestedCredentialVerification() {
  const { data: session } = useSession()
  const [myCredentialVerifications, setMyCredentialVerifications] = useState<IRequestedCredentialVerification[]>([])

  useEffect(() => {
    fetchMyCredentialVerifications();
  }, [])

  const fetchMyCredentialVerifications = async () => {
    const user = session?.user?.["@id"]
    if (!user) return

    const requests = await getCredVerificationRequestsByVerifier(user)
    setMyCredentialVerifications(requests)
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Requester username</TableCell>
              <TableCell>Requester email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myCredentialVerifications.map((v) => (
              <CredentialVerificationRow
                key={v["@id"]}
                v={v}
                refetchMyCredentialVerifications={fetchMyCredentialVerifications}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

