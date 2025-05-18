import { useState } from 'react';

export function useEmailForm() {
  const [isEmailFormOpen, setIsEmailFormOpen] = useState<boolean>(false);
  const [emailTo, setEmailTo] = useState<string>('');

  const openEmailForm = (email: string) => {
    setEmailTo(email);
    setIsEmailFormOpen(true);
  };

  const closeEmailForm = () => {
    setIsEmailFormOpen(false);
    setEmailTo('');
  };

  return {
    isEmailFormOpen,
    emailTo,
    openEmailForm,
    closeEmailForm,
  };
}
