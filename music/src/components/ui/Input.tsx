import React from 'react'

interface InputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inputValue: string
}

export const Input: React.FC<InputProps> = ({
  inputValue
}) => {
  return (
    <input type="text" value={inputValue}
        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
    />
  )
}