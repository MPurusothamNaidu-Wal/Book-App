import logo from './logo.svg';
import './App.css';
import LoginApp from './login';
import AddBook from './addbook';
import { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeApp from './home';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeApp />} />
          <Route path='/login' element={<LoginApp />} />
          <Route path='/book' element={<AddBook />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
