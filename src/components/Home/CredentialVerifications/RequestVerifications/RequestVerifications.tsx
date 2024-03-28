'use client'

import SearchInput from '@/components/Inputs/SearchInput/SearchInput';
import { useEffect, useState } from 'react';
import CustomAvatar from '@/components/Avatar/Avatar';
import CloseIcon from '@mui/icons-material/Close';

import { listUsers } from '../../../../../lib/api/FlureeMethods';
import Button from '../../../Buttons/Button/Button';
import styles from './RequestVerifications.module.scss'
import { requestCredVerification } from '../../../../../lib/api/ApiMethods';
import { useSession } from 'next-auth/react';

interface IUser {
  "@id": string
  name: string
  email: string
  emailVerified: boolean
}

export default function RequestVerifications({ refetchMyCredentialVerifications }: { refetchMyCredentialVerifications: any }) {
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      const excludeUsers = session?.user?.["email"] ? [session?.user?.["email"]] : []
      const users = await listUsers({ excludeUsers })
      setUsers(users)
    }
    fetchUsers();
  }, [])

  const handleSelectUser = (user: IUser) => {
    if (
      !user ||
      selectedUsers.find(u => u.email === user.email)
    ) return
    setSelectedUsers([...selectedUsers, user])
  }

  const handleRemoveUser = (user: IUser) => {
    if (!user) return
    const filteredUsers = selectedUsers.filter((u) => {
      return u.email !== user.email
    })
    setSelectedUsers(filteredUsers)
  }

  const handleCredVerificationRequest = async () => {
    setLoading(true)
    try {
      if (!session?.user?.["@id"]) return
      const res = await Promise.all(
        selectedUsers.map(user => requestCredVerification({
          verifier: user["@id"],
          user: session?.user?.["@id"]
        }))
      )
      console.log("🚀 ~ handleCredVerificationRequest ~ res:", res)
    } finally {
      setLoading(false)
      refetchMyCredentialVerifications()
    }
  }

  return (
    <div>
      <p className='mb-2'>Invite someone to approve your VC (2 people)</p>
      <SearchInput disabled={selectedUsers?.length >= 2} options={users} handleSelectUser={handleSelectUser} />
      <div className='mt-6 text-xl'>Your selections</div>
      {selectedUsers?.map(user => (
        <div key={user.email} className='flex justify-between mt-1 items-center border border-gray-600 rounded-md p-2'>
          <div className='flex'>
            <CustomAvatar name={user.name} />
            <div className="flex flex-col ml-3 mr-5">
              <p className='font-semibold'>{user.name} ({user.emailVerified ? 'verified' : 'not verified'})</p>
              <span className='text-sm'>{user.email}</span>
            </div>
          </div>
          <CloseIcon onClick={() => handleRemoveUser(user)} className='cursor-pointer' />
        </div>
      ))}
      <Button
        onClick={handleCredVerificationRequest}
        disabled={selectedUsers.length !== 2}
        className={styles.button}
        primary
        title='Request verification'
        loading={loading}
      />
    </div>
  );
}
