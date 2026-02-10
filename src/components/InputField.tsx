import type { ChangeEvent } from 'react';
import './InputField.css';

interface InputAttributes {
  contentType: 'text' | 'password';
  placeholder: string;
  value: string;
  onChangeFunction: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function InputField({ contentType, placeholder, onChangeFunction} : InputAttributes) {
  return (
    <>
      <input className="input-field" onChange={onChangeFunction} type={contentType} placeholder={placeholder}></input>
    </>
  )
}