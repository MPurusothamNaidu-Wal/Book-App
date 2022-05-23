import { useNavigate } from 'react-router-dom';
import library from './library.webp';
import LoginApp from './login';
const HomeApp = () => {
  var navigate = useNavigate();
  return (
    <div
      className='container-fluid app'
      style={{ backgroundImage: `url(${library})` }}
    >
      <p className='header'>Library App</p>
      <div className='wrap'>
        <button
          className='button'
          onClick={() => {
            navigate('/login');
          }}
        >
          Login
        </button>
        <button
          className='button'
          onClick={() => {
            if (localStorage.getItem('isLoggedin') === '1') {
              navigate('/book');
            } else {
              alert('Please Log in');
              navigate('/login');
            }
          }}
        >
          Books
        </button>
      </div>
    </div>
  );
};
export default HomeApp;
