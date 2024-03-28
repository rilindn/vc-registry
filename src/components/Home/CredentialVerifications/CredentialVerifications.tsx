'use client'

import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Modal, ModalContent, NextUIProvider } from "@nextui-org/react";
import { Box, Skeleton } from '@mui/material';

import { getCredVerificationRequestByUser } from '../../../../lib/api/FlureeMethods';
import Button from '../../Buttons/Button/Button';
import styles from './CredentialVerifications.module.scss'
import { useSession } from 'next-auth/react';
import RequestVerifications from './RequestVerifications/RequestVerifications';
import MyRequestedCredentialVerification from './MyRequestedCredentialVerification/MyRequestedCredentialVerification';
import TextInput from '@/components/Inputs/TextInput/TextInput';
import { createCredential, updateUser } from '../../../../lib/api/ApiMethods';

interface ICredentialVerificationRequest {
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

const schema = yup.object().shape({
  name: yup.string().required().label('Name'),
  description: yup.string().required().label('Description'),
});

interface VCFormData {
  name: string;
  description: string;
}

export default function CredentialVerifications() {
  const { data: session, update } = useSession()
  const [myCredentialVerifications, setMyCredentialVerifications] = useState<ICredentialVerificationRequest[]>([])
  const [myVerificationsApproved, setMyVerificationsApproved] = useState(false)
  const vcDocument = session?.user?.['person:vc']
  const [vcDocumentShown, setVcDocumentShown] = useState(false)
  const [vcDocumentFormShown, setVcDocumentFormShown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentVC, setCurrentVC] = useState('')
  const { handleSubmit, control } = useForm<VCFormData>({ resolver: yupResolver(schema), });
  const [dataHasLoaded, setDataHasLoaded] = useState(false)

  useEffect(() => {
    fetchMyCredentialVerifications();
  }, [])

  const fetchMyCredentialVerifications = async () => {
    try {
      const user = session?.user?.["@id"]
      if (!user) return

      const requests = await getCredVerificationRequestByUser(user)
      console.log("🚀 ~ fetchMyCredentialVerifications ~ requests:", requests)
      setMyCredentialVerifications(requests)
      setMyVerificationsApproved(
        requests?.length && requests.every((r: ICredentialVerificationRequest) => r.status === 'accepted')
      )
    } finally {
      setDataHasLoaded(true)
    }
  }

  const handleVcCreation: SubmitHandler<VCFormData> = async (data: any) => {
    console.log("🚀 ~ handleVcCreation ~ data:", data)
    setLoading(true)
    try {
      const userId = session?.user?.['person:did']?.[0]?.['@id']
      if (!userId) return

      const { data: vcDocument, status } = await createCredential({ issuer: "system", userId })
      if (status === 200 && vcDocument) {
        const userRes = await updateUser({
          email: session?.user?.email,
          updateData: {
            "person:vc": [{ "@id": vcDocument["@id"] }],
          }
        })
      }
    } catch (error) {
      console.log('eerr', error)
    } finally {
      update()
      setLoading(false)
      setVcDocumentFormShown(false)
    }
  }

  return (
    <div>
      {!dataHasLoaded ?
        <Box sx={{ width: 300 }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box> :
        (!myVerificationsApproved ? (
          !myCredentialVerifications?.length ?
            <RequestVerifications refetchMyCredentialVerifications={fetchMyCredentialVerifications} /> :
            <MyRequestedCredentialVerification myCredentialVerifications={myCredentialVerifications} />
        ) :
          <>
            <div className='flex flex-col justify-between px-3'>
              <p className='font-semibold text-xl mb-5 pb-2 border-b-1 border-b-slate-600 border-solid'>You are all set. Now you can create your VCs</p>
              <div className='flex justify-between'>
                <h2 className=" mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Your VCs</h2>
                <span className='bg-emerald-500 rounded-lg py-2 px-7 hover:bg-emerald-400 cursor-pointer' title='Create VC' onClick={() => setVcDocumentFormShown(true)} >
                  <svg fill="#fff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="20px" height="20px" viewBox="0 0 45.402 45.402" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z"></path> </g> </g></svg>
                </span>
              </div>
            </div>
            {vcDocument?.map((doc) => (
              <div className='border border-slate-600 rounded-lg p-3 mt-1 flex items-center justify-between' key={doc?.["@id"]}>
                <span>{doc?.["@id"]}</span>
                <button
                  type="button"
                  className='border p-2 rounded-lg hover:bg-slate-600'
                  onClick={() => {
                    setCurrentVC(doc?.["@id"] || '')
                    setVcDocumentShown(true)
                  }}
                >Resolve</button>
              </div>
            ))}
          </>
        )
      }
      <NextUIProvider>
        <Modal onClose={() => setVcDocumentShown(false)} isOpen={vcDocumentFormShown} size='3xl' >
          <ModalContent className="p-5 flex flex-col justify-center items-center bg-[#0d1117] rounded-3xl">
            <div className="card px-8 py-5 w-full">
              <div className="w-full flex justify-center items-center py-5">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">VC
                  <span className="text-emerald-400"> Metadata</span>
                </h2>
              </div>
              <div className='w-full'>
                <TextInput
                  control={control}
                  className='!mb-5'
                  name="vc"
                  label="VC (optional)"
                  placeholder="Paste your VC"
                  multiline
                  maxRows={6}
                />
                <TextInput
                  control={control}
                  className='!mb-5'
                  name="name"
                  label="Name"
                  placeholder="Enter name"
                />
                <TextInput
                  control={control}
                  className='!mb-5'
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  multiline
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmit(handleVcCreation)} primary loading={loading} title='Create' />
              <Button onClick={() => setVcDocumentFormShown(false)} title='Cancel' />
            </div>
          </ModalContent>
        </Modal>
        {/* <Modal onClose={() => setVcDocumentShown(false)} isOpen={vcDocumentShown} size='5xl' >
          <VcDocumetModal vc={currentVC} />
        </Modal> */}
      </NextUIProvider>
    </div >
  );
}
