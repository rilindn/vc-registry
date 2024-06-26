'use client'

import React, { useState, forwardRef, ForwardedRef } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { signIn } from 'next-auth/react';

import TextInput from '../../Inputs/TextInput/TextInput';
import styles from './RegisterForm.module.scss';
import Button from '../../Buttons/Button/Button';
import { createDID, createDidMetadata, registerUser, sendEmail } from '../../../../lib/api/ApiMethods';
import { generateVerificationCode } from '../../../../helpers/generateVerificationCode';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({                                                             
  name: yup.string().required().label('Name'),
  email: yup.string().email().required().label('Email'),
  password: yup.string().required().label('Password'),
});

interface RegisterFormProps {
  className?: string;
  onCancel?: () => void;
}

const RegisterForm = forwardRef(
  ({ className, onCancel }: RegisterFormProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      handleSubmit,
      reset,
      control,
    } = useForm<RegisterFormData>({resolver: yupResolver(schema),});
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<RegisterFormData> = async (data: any) => {
      setLoading(true);
      try {
        const verificationCode = generateVerificationCode(40)
        const payload = {...data, verificationCode}  
        const didRes = await createDID()
        console.log("🚀 ~ constonSubmit:SubmitHandler<RegisterFormData>= ~ didRes:", didRes)
        if (didRes.status === 200) {
          const userRes = await registerUser({...payload, did: didRes.data["@id"]});
          console.log("🚀 ~ constonSubmit:SubmitHandler<RegisterFormData>= ~ userRes:", userRes)
          if (userRes.status === 200){
            const didMetadataRes = await createDidMetadata({
              did: didRes.data["@id"], 
              name: "User DID", 
              description: "This DID was automatically generated for the user during the signup process."
            })
            console.log("🚀 ~ constonSubmit:SubmitHandler<RegisterFormData>= ~ didMetadataRes:", didMetadataRes)
          }
          
          const emailSenderResult = await sendEmail({
            recipientEmail: payload.email,
            verificationCode,
            locationOrigin: window.location.origin
          })
        }
      } finally {
        setLoading(false);          
        await signIn('credentials', { email: data.email, password: data.password , callbackUrl: window.location.origin})
      }
    };

    return (
      <div className={classNames(styles.main, className)} ref={ref}>
        <div className={styles.form}>
          <TextInput
            control={control}
            name="name"
            className={styles.textInput}
            label="Name"
            placeholder="Enter name"
          />
          <TextInput
            control={control}
            name="email"
            className={styles.textInput}
            label="Email"
            placeholder="Enter email"
          />
          <TextInput
            control={control}
            name="password"
            className={styles.textInput}
            label="Password"
            placeholder="Enter password"
          />
        </div>
        <Button onClick={handleSubmit(onSubmit)} primary loading={loading} title='Register'/>
      </div>
    );
  }
);

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
