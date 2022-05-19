/* eslint-disable no-undef */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import { useState, useEffect } from 'react';
import axios from 'axios';
var FormData = require('form-data');

const AddBook = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [bookData, setBookData] = useState([]);
  const [name, setName] = useState();
  const [author, setAuthor] = useState();
  const [category_id, setCategory] = useState([]);
  const [publication, setPublication] = useState();
  const [availability, setAvailability] = useState();
  const [price, setPrice] = useState();
  const [category, setCat] = useState([]);
  let [file, setFile] = useState();
  const [filename, setFileName] = useState('');

  const [editname, seteditName] = useState();
  const [editauthor, seteditAuthor] = useState();
  const [editpublication, seteditPublication] = useState();
  const [editavailability, seteditAvailability] = useState();
  const [editprice, seteditPrice] = useState();
  const [editcategory, seteditCat] = useState();
  const [delid, setdelId] = useState();
  let [bookId, setBookId] = useState();
  const getBook = () => {
    axios
      .get('/categories')
      .then((res) => {
        setCategory(res.data);
        console.log('Category', res.data);
      })
      .catch((error) => console.log(error));

    axios
      .get('/books', {
        headers: {
          token,
        },
      })
      .then((res) => {
        setBookData(res.data);
        console.log('Book', res.data);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getBook();
  }, []);
  if (localStorage.getItem('isLoggedin') === '1') {
    console.log('Logged in');
  } else {
    navigate('/login');
  }
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [editModal, setEditModal] = useState(false);
  const editToggle = () => {
    setEditModal(!editModal);
  };

  const [delModal, setDelModal] = useState(false);
  const deltoggle = () => setDelModal(!delModal);
  const deleteBook = (id) => {
    axios
      .delete(`/books/del/${id}`, {
        headers: {
          token,
        },
      })
      .then((res) => {
        console.log(res.data);
        deltoggle();
        getBook();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addBook = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('publication', publication);
    formData.append('price', price);
    formData.append('categoryId', category);
    formData.append('image', file);
    formData.append('availabilty', availability);
    console.log(formData);
    console.log(availability);
    try {
      console.log(category_id);
      axios({
        method: 'POST',
        url: 'http://localhost:3000/books/add/',
        headers: { token },
        data: formData,
      }).then(() => {
        console.log(file);
        alert('Book added successfully');
        getBook();
      });
    } catch (ex) {
      console.log(ex);
    }
  };

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  const getSingleBookedit = (id) => {
    axios.get(`/books/${id}`, { headers: { token } }).then((res) => {
      seteditName(res.data.name);
      seteditAuthor(res.data.author);
      seteditPrice(res.data.price);
      seteditPublication(res.data.publication);
      seteditAvailability(res.data.availability);
      seteditCat(res.data.categoryId);
      setBookId(res.data.id);
    });
  };

  const saveEdittedData = (e) => {
    e.preventDefault();
    axios({
      method: 'PUT',
      url: `/books/edit/${bookId}`,
      data: {
        name: editname,
        author: editauthor,
        publication: editpublication,
        price: editprice,
        categoryId: editcategory,
        availability: editavailability,
      },
      headers: { token },
    })
      .then(() => {
        editToggle();
        getBook();
      })
      .catch((error) => {
        console.log(error);
        alert('Validation Failed');
      });
  };

  return (
    //Main app
    <div className='addbook'>
      <h1 className='text-center head'>Book App</h1>
      <button
        className='btn btn-danger col-2  logout'
        onClick={() => {
          navigate('/login');
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedin');
          setTimeout(() => {
            alert('Loggedout successfully');
          }, 500);
        }}
      >
        Logout
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-door-closed'
          viewBox='0 0 16 16'
        >
          <path d='M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2zm1 13h8V2H4v13z' />
          <path d='M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z' />
        </svg>
      </button>
      <div className=' col-lg-9 col-md-9 col-sm-9 mx-auto'>
        <div>
          <button className='button m-1 addbook' onClick={toggle}>
            Add Book
          </button>
        </div>
        {/* Modal for adding book */}
        <Modal isOpen={modal} animation={false} toggle={toggle}>
          <ModalHeader>Adding Book </ModalHeader>
          <ModalBody>
            <Form onSubmit={addBook}>
              <FormGroup>
                <Input
                  type='text'
                  name='name'
                  className='form-control my-3  mx-auto'
                  placeholder='Enter title'
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Input
                  type='text'
                  name='author'
                  className='form-control my-3 mx-auto'
                  placeholder='Enter Author'
                  onChange={(e) => {
                    setAuthor(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type='text'
                  name='publication'
                  className='form-control my-3 mx-auto'
                  placeholder='publication'
                  onChange={(e) => {
                    setPublication(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type='number'
                  name='price'
                  className='form-control my-3 mx-auto'
                  placeholder='price'
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <select
                  name='category_id'
                  className='form-control'
                  onChange={(e) => {
                    setCat(e.target.value);
                  }}
                >
                  <option>Select category</option>
                  {category_id.map((val) => {
                    return <option value={val.id}>{val.name}</option>;
                  })}
                </select>
              </FormGroup>
              <Label>Book Image</Label>
              <FormGroup>
                <Input
                  type='file'
                  accept='image/*'
                  required
                  name='image'
                  onChange={saveFile}
                />
              </FormGroup>
              <FormGroup>
                <select
                  name='availability'
                  defaultValue={true}
                  className='form-control'
                  onChange={(e) => {
                    setAvailability(e.target.value);
                  }}
                >
                  <option value='true'>Available</option>
                  <option value='false'>Not Available</option>
                </select>
              </FormGroup>
              <button
                className='btn btn-primary '
                type='submit'
                onClick={addBook}
              >
                Add Book
              </button>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={toggle}>
              Go Back
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      {/* Main Content */}
      <div className='cards-list'>
        {bookData.map((val, index) => {
          return (
            <div className='col-lg-3 col-sm-6 col-md-6'>
              <div className='card team3_divimg'>
                <img className='team3-card-img-top' src={val.image} />
                <div className='card-body'>
                  <div>
                    <h4>{val.name}</h4> <br />
                    <h6>Author: {val.author}</h6>
                  </div>
                  <h6>Publication: {val.publication} </h6>
                  <h6 className='available'>
                    {val.availability ? 'Available' : 'Not Available'} <br />
                  </h6>
                  <h5 className='aligncenter'>
                    Price : <b>${val.price}</b>
                  </h5>
                  <div className='d-flex flex-row-reverse'>
                    <Button
                      className='m-2 w-50'
                      color='primary'
                      onClick={() => {
                        editToggle();
                        getSingleBookedit(val.id);
                      }}
                    >
                      {' '}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-pencil-square'
                        viewBox='0 0 16 16'
                      >
                        <path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z' />
                        <path
                          fillRule='evenodd'
                          d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'
                        />
                      </svg>{' '}
                      Edit
                    </Button>

                    <Modal isOpen={editModal} toggle={editToggle}>
                      <ModalHeader>Editing Book Details</ModalHeader>
                      <ModalBody>
                        <Form onSubmit={saveEdittedData}>
                          <FormGroup>
                            <Input
                              type='text'
                              name='name'
                              value={editname}
                              className='form-control my-3  mx-auto'
                              placeholder='Enter title'
                              onChange={(e) => {
                                seteditName(e.target.value);
                              }}
                            />
                          </FormGroup>

                          <FormGroup>
                            <Input
                              type='text'
                              name='author'
                              className='form-control my-3 mx-auto'
                              placeholder='Enter Author'
                              value={editauthor}
                              onChange={(e) => {
                                seteditAuthor(e.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Input
                              type='text'
                              name='publication'
                              className='form-control my-3 mx-auto'
                              placeholder='publication'
                              value={editpublication}
                              onChange={(e) => {
                                seteditPublication(e.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <Input
                              type='number'
                              name='price'
                              className='form-control my-3 mx-auto'
                              placeholder='price'
                              value={editprice}
                              onChange={(e) => {
                                seteditPrice(e.target.value);
                              }}
                            />
                          </FormGroup>
                          <FormGroup>
                            <select
                              name='category_id'
                              className='form-control'
                              onChange={(e) => {
                                seteditCat(e.target.value);
                              }}
                            >
                              <option>Select category</option>
                              {category_id.map((val) => {
                                return (
                                  <option value={val.id}>{val.name}</option>
                                );
                              })}
                            </select>
                          </FormGroup>
                          <FormGroup>
                            <select
                              name='availability'
                              defaultValue={true}
                              className='form-control'
                              onChange={(e) => {
                                seteditAvailability(e.target.value);
                              }}
                            >
                              <option value='true'>Available</option>
                              <option value='false'>Not Available</option>
                            </select>
                          </FormGroup>
                          <div className='text-center'>
                            <Button color='success' onClick={saveEdittedData}>
                              Save Details
                            </Button>
                          </div>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button color='danger' onClick={editToggle}>
                          Go Back
                        </Button>
                      </ModalFooter>
                    </Modal>

                    <Button
                      className='btn btn-danger btn-sm m-2'
                      onClick={() => {
                        setdelId(val.id);
                        deltoggle();
                      }}
                    >
                      Delete
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        className='bi bi-trash'
                        viewBox='0 0 16 16'
                      >
                        <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
                        <path
                          fillRule='evenodd'
                          d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
                        />
                      </svg>
                    </Button>
                    {/* Modal for delete confirmation */}
                    <Modal isOpen={delModal}>
                      <ModalHeader>
                        <ModalHeader>Want to Delete ?</ModalHeader>
                        <ModalBody>
                          Deleting the data will remove all its content
                          <Button
                            className='cancel'
                            onClick={() => {
                              deltoggle();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            className='btn btn-danger delete'
                            onClick={() => {
                              deleteBook(delid);
                            }}
                          >
                            Delete
                          </Button>
                        </ModalBody>
                      </ModalHeader>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AddBook;
