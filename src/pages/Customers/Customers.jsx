import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
// import ManageAccountsOutlinedIcon from "@mui/icons-material/Edit";
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import VisibilityIcon from "@mui/icons-material/Visibility";
import "bootstrap/dist/css/bootstrap.min.css";
import "./customers.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "../../Partials/Navbar/Navbar";
const UpdateCustomerForm = ({ customer, handleUpdate, show, handleClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData, customer._id);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="Modal-Footer">
        <Button className="savebtn" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [view, setView] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const Close = () => setView(false);
  const views = () => setView(true);
  const [sortDirection, setSortDirection] = useState("ASC");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/customers?page=${currentPage}&perPage=${itemsPerPage}&sort=${sortDirection}`
      );
      setCustomers(response.data);
    } catch (error) {
      toast.error(`Error fetching customers: ${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, sortDirection]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  const handleSortChange = () => {
    const newSortDirection = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortDirection(newSortDirection);
  };
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const updateCustomerEndpoint = (customerId) =>
    `https://e-commerce-project-backend-yec6.onrender.com/v1/customers/${customerId}`;

  const handleUpdate = async (updatedData, customerId) => {
    try {
      const response = await axios.put(
        updateCustomerEndpoint(customerId),
        updatedData,
      );

      if (response.status === 200) {
        fetchCustomers();
        toast.success("Customer updated successfully")
      } else {
        toast.warning("Failed to update customer")
      }
    } catch (error) {
      toast.error(`Error updating customer: ${error.message}`)
    } finally {
      handleClose();
    }
  };

  const handleShow = (customer) => {
    setSelectedCustomer(customer);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCustomer(null);
  };

  const viewCustomerEndpoint = (customerId) =>
    `https://e-commerce-project-backend-yec6.onrender.com/v1/customers/${customerId}`;

  const viewCustomer = async (customerId) => {
    try {
      const response = await axios.get(viewCustomerEndpoint(customerId));
      if (response.status === 200) {
        views();
        setCustomerData(response.data);
      } else {
        toast.warning("Failed to fetch customer details")
      }
    } catch (error) {
      toast.error(`Error viewing customer: ${error.message}`)
    }
  };

  const searchCustomersEndpoint = "https://e-commerce-project-backend-yec6.onrender.com/v1/customers";

  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (value) => {
    setSearchValue(value);

    try {
      setLoading(true);
      if (value.trim() === '') {
        fetchCustomers();
        setSearchResults([]); 
      } else {
      const response = await axios.get(searchCustomersEndpoint, {
        params: {
          query: value,
        },
      });
      const results = response.data;
      if (results.length === 0) {
        toast.warning('No users found with the given name.')
      } else {
        setSearchResults(results);
      }
    }
    
    } catch (error) {
      toast.error(`Error searching users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setCustomers(searchResults);
  }, [searchResults]);

  // sorting logic ========================

  
  return (
    <>
      <div className="custom-table">
      <div className="top">
          <h1>Customer List</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleSortChange} style={{ cursor: 'pointer', backgroundColor: "var(--background2)", color:"var(--background)", borderRadius: '15px'}}>Sort <SortByAlphaIcon /></Button>
          </div>
        </div>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <ClipLoader color="#fff" loading={loading} size={50} />
            </div>
          </div>
        )}
        <ToastContainer/>
        <div className="ttable">
          <Table striped hover style={{ border: "0px solid inherit" }}>
            <thead>
              <tr>
                <th style={{ borderTopLeftRadius: "8px" }}>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Update</th>
                <th style={{ borderTopRightRadius: "8px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {customers
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((customer) => (
                  <tr key={customer._id}>
                    <td className="align-middle">{customer.first_name}</td>
                    <td className="align-middle">{customer.last_name}</td>
                    <td className="align-middle">{customer.email}</td>
                    <td className="align-middle">
                      <ManageAccountsOutlinedIcon
                        onClick={() => handleShow(customer)}
                        style={{ cursor: "pointer", color: "blue" }}
                      />
                    </td>
                    <td className="align-middle">
                      <VisibilityIcon
                        onClick={() => viewCustomer(customer._id)}
                        style={{ cursor: "pointer", color: "green" }}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="pagination">
          {currentPage > 1 && (
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                color:'var(--background2)',
                background: "var(--active)",
                cursor: "pointer",
                margin: "0 2px",
                padding: "5px 15px",
              }}
            >
              Previous
            </Button>
          )}

          {currentPage < totalPages && (
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                color:'var(--background2)',
                background: "var(--active)",
                cursor: "pointer",
                margin: "0 2px",
                padding: "5px 15px",
              }}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      <Modal show={view} onHide={Close}>
        <Modal.Header closeButton>
          <Modal.Title>All Customer's infos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {customerData && (
            <div >
                <p><span style={{fontWeight:'800'}}> firstName: </span>{customerData.first_name}</p>
                <p><span style={{fontWeight:'800'}}> lastName:</span> {customerData.last_name}</p>
                <p><span style={{fontWeight:'800'}}> Email:</span> {customerData.email}</p>
                <p><span style={{fontWeight:'800'}}> validAccount:</span> {" "}
                {customerData.valid_account === true ? (
                    <span style={{ color: "green" }}>true</span>
                  ) : (
                    <span style={{ color: "red" }}>false</span>
                  )}
                </p>
                <p><span style={{fontWeight:'800'}}>create date:</span> {(customerData.createdAt)}</p>
                <p><span style={{fontWeight:'800'}}>update dste:</span> {(customerData.updatedAt)}</p>
                <p>
                <span style={{fontWeight:'800'}}>active:</span> {" "}
                  {customerData.active === true ? (
                    <span style={{ color: "green" }}>true</span>
                  ) : (
                    <span style={{ color: "red" }}>false</span>
                  )}
                </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="Modal-Footer">
          <Button className="savebtn" onClick={Close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {selectedCustomer && (
        <UpdateCustomerForm
          customer={selectedCustomer}
          handleUpdate={handleUpdate}
          show={show}
          handleClose={handleClose}
        />
      )}
      <Navbar handleSearch={handleSearch} searchValue={searchValue} />
    </>
  );
};

export default CustomersList;
