import { createContext, useContext } from 'react'

/** Lets any button open the "Hire me" dialog. */
export const HireContext = createContext<() => void>(() => {})
export const useHire = () => useContext(HireContext)
