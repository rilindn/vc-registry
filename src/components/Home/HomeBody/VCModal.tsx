import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ModalContent } from "@nextui-org/react";

import { getDidDocument, getDidDocumentMetadata } from '../../../../lib/api/ApiMethods';

interface IDidDocumentMetadata {
  name?: string
  description?: string
}

export default function VcDocumetModal({ did }: { did: string }) {
  const [didDocument, setDidDocument] = useState(null);
  const [didDocumentMetadata, setDidDocumentMetadata] = useState<IDidDocumentMetadata>({})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [document, documentMeta] = await Promise.all([
          getDidDocument(did),
          getDidDocumentMetadata(did)
        ])

        setDidDocument(document.data);
        setDidDocumentMetadata(documentMeta.data || {});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [did]);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(JSON.stringify(didDocument?.[0], null, 2));
  };

  return (
    <ModalContent className="bg-slate-700 p-3 flex">
      {!loading ?
        <section className='flex flex-col p-3'>
          <h1 className='text-2xl font-bold'>{didDocumentMetadata?.name}</h1>
          <h4 className='text-xl mb-2 mt-1 opacity-80'>{didDocumentMetadata?.description}</h4>
          <div className='bg-slate-800 p-3 rounded-md max-h-[72dvh] overflow-auto'>
            <div className="flex justify-end mb-2">
              <button type="button" title="Copy logs to the clipboard" className='absolute border p-3 rounded-md hover:bg-slate-600' onClick={handleCopyAll}>
                <span>
                  <div style={{ opacity: "1", transform: "none" }}>
                    <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" fill="currentColor"></path>
                    </svg>
                  </div>
                </span>
              </button>
            </div>
            <pre className=''>{JSON.stringify(didDocument?.[0], null, 2)}</pre>
          </div>
        </section> :
        <div>Please wait...</div>
      }
    </ModalContent>
  );
}
