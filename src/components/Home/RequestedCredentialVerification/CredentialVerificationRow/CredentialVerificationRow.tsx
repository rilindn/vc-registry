
import { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import _ from 'lodash'

import Button from '@/components/Buttons/Button/Button';
import styles from '../RequestedCredentialVerification.module.scss'
import { updateCredVerification } from '../../../../../lib/api/ApiMethods';

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

interface ICredentialVerificationRow {
  v: IRequestedCredentialVerification,
  refetchMyCredentialVerifications: any
}

export default function CredentialVerificationRow({ v, refetchMyCredentialVerifications }: ICredentialVerificationRow) {
  const [loadingActionBtn, setLoadingActionBtn] = useState('')

  const handleUpdateVerification = async (id: string, status: string) => {
    setLoadingActionBtn(status)
    try {
      const res = await updateCredVerification({ id, status })
    } finally {
      await refetchMyCredentialVerifications();
      setLoadingActionBtn('')
    }
  }

  return (
    <TableRow
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
            <Button
              loading={loadingActionBtn === 'accepted'}
              className={styles.approveButton}
              title='Approve'
              onClick={() => handleUpdateVerification(v["@id"], 'accepted')}
            />
            <Button
              loading={loadingActionBtn === 'denied'}
              className={styles.denyButton}
              title='Deny'
              onClick={() => handleUpdateVerification(v["@id"], 'denied')}
            />
          </TableCell> :
          <TableCell sx={{ fontSize: 14 }}>
            {_.capitalize(v.status)}
            {v.status === 'accepted' ? ' ✅' : v.status === 'denied' ? ' ❌' : ' ⏳'}
          </TableCell>
        }
      </>
    </TableRow>
  )
}