import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import useLocalStorage from 'use-local-storage';
import { Navigate, useNavigate } from 'react-router-dom';

import download from './download.png';
const LoginApp = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit(values) {
      axios
        .post('/user/login', {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          localStorage.setItem('token', response.data.jwt);
          localStorage.setItem('isLoggedin', 1);
          navigate('/book');
        });
    },
  });
  useEffect(() => {
    if (localStorage.getItem('isLoggedin') === '1') {
      alert('Logout to move to login page');
      navigate('/book');
    }
  });
  return (
    <div className='login-form'>
      <form onSubmit={formik.handleSubmit}>
        <div className='avatar'>
          <i>
            <img src={download} />
          </i>
        </div>
        <h4>Login to Your Account</h4>
        <div className='form-group'>
          <input
            type='text'
            className='form-control'
            placeholder='email'
            onChange={formik.handleChange}
            value={formik.values.email}
            name='email'
            required='required'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            className='form-control'
            name='password'
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder='Password'
            required='required'
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary btn-block btn-lg'
          value='Login'
        />
      </form>
    </div>
  );
};
export default LoginApp;
