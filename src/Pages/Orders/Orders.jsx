import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Orders.css'

const UpdateOrderForm = ({ order, handleUpdate, show, handleClose }) => {
  const [formData, setFormData] = useState({
    status: "",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "",
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData, order._id);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formStatus">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </Form.Control>
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
//controle statuse color=============
function getStatusColor(status) {
  switch (status) {
    case "Pending":
      return "lightgray";
    case "Processing":
      return "orange";
    case "Shipped":
      return "teal";
    case "Delivered":
      return "darkgreen";
    default:
      return "black"; 
  }
}


const OrderDetailsModal = ({ orderDetails, handleClose }) => (
  <Modal show={orderDetails !== null} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Order Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {orderDetails && (
  <>
    <p><span style={{fontWeight:'800'}}>Order Items:</span></p>
    <ul style={{paddingRight: '32px'}}>
      {orderDetails.order_items.map(item => (
        <li key={item._id} style={{display:'flex', justifyContent: 'space-between', padding: 0}}>
          <p>{item.product_name}</p>
          <h5>{item.price}$</h5>
        </li>
      ))}
    </ul>
    <p><span style={{fontWeight:'800'}}>Order Date:</span> {orderDetails.order_date}</p>
    <p><span style={{fontWeight:'800'}}>Status:</span> <span style={{ background: getStatusColor(orderDetails.status), padding:'10px', borderRadius:'8px' }}>{orderDetails.status}</span> </p>
    <p><span style={{fontWeight:'800'}}>Total Price:</span> {orderDetails.cart_total_price}$</p>
    <p><span style={{fontWeight:'800'}}>Customer FirstName:</span> {orderDetails.first_name}</p>
    <p><span style={{fontWeight:'800'}}>Customer LastName:</span> {orderDetails.last_name}</p>
  </>
)}
    </Modal.Body>
    <Modal.Footer className="Modal-Footer">
      <Button className="savebtn" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);


  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/orders?page=${currentPage}&perPage=${itemsPerPage}`
      );
      setOrders(response.data);
    } catch (error) {
      toast.error(`Error fetching orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const updateOrderEndpoint = (orderId) =>
    `https://e-commerce-project-backend-yec6.onrender.com/v1/orders/${orderId}`;

    const handleUpdate = async (updatedData, orderId) => {
      try {
        console.log('Updating order...', updatedData);
        const response = await axios.put(
          updateOrderEndpoint(orderId),
          updatedData
        );
    
        if (response.status === 200) {
          fetchOrders();
          toast.success("Order updated successfully");
        } else {
          toast.error("Failed to update order");
        }
      } catch (error) {
        toast.error(`Error updating order: ${error.message}`);
      } finally {
        handleClose();
      }
    };

  const handleShow = (order) => {
    setSelectedOrder(order);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedOrder(null);
  };
  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const viewOrderDetailsEndpoint = (orderId) =>
    `https://e-commerce-project-backend-yec6.onrender.com/v1/orders/${orderId}`;

    const handleViewDetails = async (orderId) => {
      try {
        const response = await axios.get(viewOrderDetailsEndpoint(orderId));
        if (response.status === 200) {
          setViewOrderDetails(response.data[0]);
        } else {
          toast.warning("Failed to fetch order details");
        }
      } catch (error) {
        toast.error(`Error viewing order details: ${error.message}`);
      }
    };


  return (
    <>
      <div className="custom-table" >
        <h1 style={{fontSize: '2.1em',fontWeight: '600',marginBottom: '28px'}}>Orders List</h1>
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
                <th style={{ borderTopLeftRadius: "8px" }}>Status</th>
                <th>Order Date</th>
                <th>Total Price</th>
                <th>Update</th>
                <th style={{ borderTopRightRadius: "8px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((order) => (
                <tr key={order._id}>
                  <td className="align-middle"><div style={{ background: getStatusColor(order.status), padding:'10px', borderRadius:'8px', color:'white', textAlign: 'center' }}>{order.status}</div> </td>
                  <td className="align-middle">{(order.order_date).split('T')[0]}</td>
                  <td className="align-middle">{order.cart_total_price}</td>
                  <td className="align-middle">
                    <EditIcon
                      onClick={() => handleShow(order)}
                      style={{ cursor: "pointer", color: "blue" }}
                    />
                  </td>
                  <td className="align-middle">
                    <VisibilityIcon
                      onClick={() => {
                        handleViewDetails(order._id);
                        setViewOrderDetails(order);
                      }}
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
                background: "var(--active)",
                cursor: "pointer",
                margin: "0 2px",
                padding: "5px 15px",
                color:'var(--background2)'
              }}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      {selectedOrder && (
        <UpdateOrderForm
          order={selectedOrder}
          handleUpdate={handleUpdate}
          show={show}
          handleClose={handleClose}
        />
      )}
      {viewOrderDetails && (
        <OrderDetailsModal
          orderDetails={viewOrderDetails}
          handleClose={() => setViewOrderDetails(null)}
        />
      )}
    </>
  );
};

export default Orders;

