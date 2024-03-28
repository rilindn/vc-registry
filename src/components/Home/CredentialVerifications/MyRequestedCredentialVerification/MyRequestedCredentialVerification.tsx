'use client'


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSession } from 'next-auth/react';
import _ from 'lodash'

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

export default function MyRequestedCredentialVerification({ myCredentialVerifications }: { myCredentialVerifications: IRequestedCredentialVerification[] }) {
  const { data: session } = useSession()

  return (
    <div>
      <h3 className='font-semibold text-xl mb-3'>Your are waiting for credential verification approvals from</h3>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Verifier username</TableCell>
              <TableCell>Verifier email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myCredentialVerifications.map((v) => (
              <TableRow
                key={v["@id"]}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {v.verifier['user:userName']}
                </TableCell>
                <TableCell component="th" scope="row">
                  {v.verifier['user:email']}
                </TableCell>
                <TableCell>
                  {_.capitalize(v.status)}
                  {v.status === 'accepted' ? ' ✅' : v.status === 'denied' ? ' ❌' : ' ⏳'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
