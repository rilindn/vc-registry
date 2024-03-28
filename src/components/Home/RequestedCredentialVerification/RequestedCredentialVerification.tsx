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
import Button from '@/components/Buttons/Button/Button';
import styles from './RequestedCredentialVerification.module.scss'
import { updateCredVerification } from '../../../../lib/api/ApiMethods';

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

  const handleUpdateVerification = (id: string, status: string) => {
    try {
      const res = updateCredVerification({ id, status })
    } finally {
      fetchMyCredentialVerifications();
    }
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
              <TableRow
                key={v["@id"]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {v.user['user:userName']}
                </TableCell>
                <TableCell component="th" scope="row">
                  {v.user['user:email']}
                </TableCell>
                <>
                  {v.status === 'pending' ?
                    <TableCell sx={{ display: 'flex', gap: 2 }}>
                      <Button className={styles.approveButton} title='Approve' onClick={() => handleUpdateVerification(v["@id"], 'accepted')} />
                      <Button className={styles.denyButton} title='Deny' onClick={() => handleUpdateVerification(v["@id"], 'denied')} />
                    </TableCell> :
                    <TableCell sx={{ fontSize: 14 }}>
                      {_.capitalize(v.status)}
                      {v.status === 'accepted' ? ' ✅' : v.status === 'denied' ? ' ❌' : ' ⏳'}
                    </TableCell>
                  }
                </>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
