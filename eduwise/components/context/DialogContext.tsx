import { createContext, useContext, useState } from 'react'

type DialogContextType = {
  dialogs: { [key: string]: boolean }
  openDialog: (dialogKey: string) => void
  closeDialog: (dialogKey: string) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState<{ [key: string]: boolean }>({})

  const openDialog = (dialogKey: string) => {
    setDialogs({ ...dialogs, [dialogKey]: true })
  }

  const closeDialog = (dialogKey: string) => {
    setDialogs({ ...dialogs, [dialogKey]: false })
  }

  return (
    <DialogContext.Provider value={{ dialogs, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  return useContext(DialogContext)
}
