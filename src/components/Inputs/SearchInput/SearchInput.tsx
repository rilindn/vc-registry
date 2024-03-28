'use client'

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface SearchInputProps {
  options: IUser[];
  handleSelectUser: (val: IUser) => void,
  disabled: boolean
}

interface IUser {
  "@id": string
  name: string
  email: string
  emailVerified: boolean
}

export default function SearchInput({options, handleSelectUser, disabled}: SearchInputProps) {
  const [open, setOpen] = useState(false);
  const loading = open && options.length === 0;

  return (
    <Autocomplete
      sx={{
        '& input': {
          width: 200,
          color: '#ced2d9 !important',
          '&:hover': {
            borderColor: '#0366d6',
          },
        },
        '& fieldset': {
          borderColor: 'rgb(107 114 128 / var(--tw-border-opacity)) !important'
        },
        '& label': {
          color: '#ced2d9 !important',
        },
        '& .Mui-disabled': {
          opacity: 0.3
        }
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      id='user-search'
      isOptionEqualToValue={(option, value) => option.email === value.email}
      options={options}
      getOptionLabel={(option) => ''}
      // getOptionKey={(option: IUser) => option.email}
      renderOption={({key, ...props}, option, { selected }) => (
        <li key={key} {...props} className='flex flex-col p-2'>
          <p>{option.name} ({option.emailVerified ? 'verified' : 'not verified'})</p>
          <span>{option.email}</span>
        </li>
      )}
      value={{}}
      filterSelectedOptions={true}
      filterOptions={(options, state) => {
        const displayOptions = options.filter((option) =>
          option.name.toLowerCase().trim()
            .includes(state.inputValue.toLowerCase().trim()) ||
          option.email.toLowerCase().trim()            
            .includes(state.inputValue.toLowerCase().trim()),
        );

        return displayOptions;
      }}
      onChange={(event, value, reason) => {
        handleSelectUser(value)
      }}
      disabled={disabled}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Input"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
