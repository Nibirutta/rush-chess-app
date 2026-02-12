import { useState, type ChangeEvent } from 'react';
import { SubmitButton } from '../components/SubmitButton';
import './LoginForm.css';
import { InputField } from '../components/InputField';
import { requestLogin } from '../api/player/playerService';

export function LoginForm() {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loading, setLoading ] = useState(false);

  function UpdateUsername(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function UpdatePassword(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function Login() {
    if (!loading) {      
      setLoading(true);

      try {
        const data = await requestLogin({username, password});

        console.log(data);
      } catch {
        setLoading(false);
      }
      setLoading(false);
    }
  }

  function RedirectRegister() {
    console.log(password);
  }

  return (
    <div className="login-form">
      <InputField placeholder='Username' value={username} contentType='text' onChangeFunction={UpdateUsername} />
      <InputField placeholder='Password' value={password} contentType='password' onChangeFunction={UpdatePassword} />
      <div className='login-buttons'>
        <SubmitButton name='Login' submitFunction={Login}/>
        <SubmitButton name='Register' submitFunction={RedirectRegister} />
      </div>
    </div>
  )
}