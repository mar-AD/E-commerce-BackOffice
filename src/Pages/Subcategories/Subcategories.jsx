import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Subcategories.css"; // Create a CSS file for Subcategories if needed
import Navbar from "../../Partials/Navbar/Navbar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCategory = ({ createShow, handleClose, handleCreate }) => {
  const [newSubcategory, setNewSubcategory] = useState({
    SubcategoryName:"",
    categoryId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubcategory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(newSubcategory);
  };

  return (
    <Modal show={createShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSubCategoryName">
            <Form.Label>Subcategory Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              name="SubcategoryName"
              value={newSubcategory.SubcategoryName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formCategoryID">
            <Form.Label>Categorie ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category ID"
              name="categoryId"
              value={newSubcategory.categoryId}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="Modal-Footer">
        <Button className="savebtn" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const UpdateSubcategoryForm = ({ subcategory, handleUpdate, show, handleClose }) => {
  const [formData, setFormData] = useState({
    subcategoryName: "",
    categoryId:"",
    active: true, 
  });

  useEffect(() => {
    if (subcategory) {
      setFormData({
        subcategoryName: subcategory.subcategory_name || "",
        categoryId: subcategory.category_id ||"",
        active: subcategory.active || true,
      });
    }
  }, [subcategory]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData, subcategory._id);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryID">
            <Form.Label>Subcategory Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              name="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formcategoryId">
            <Form.Label>Category ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category ID"
              name="categoryId"
              value={formData.categoryId}
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

function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    fetchSubcategories();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://e-commerce-project-backend-yec6.onrender.com/v1/Subcategories?page=${currentPage}&perPage=${itemsPerPage}`);
      setSubcategories(response.data);
    } catch (error) {
      toast.error(`Error fetching Subcategories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
    // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

    // create ==========================
    const handleCreate = async (newSubcategory) => {
    try {
      const response = await axios.post(
        "https://e-commerce-project-backend-yec6.onrender.com/v1/Subcategories",
        newSubcategory
      );

      if (response) {
        toast.success("New Subategory created successfully");
        fetchSubcategories();
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.warning('The category with that ID is not found')
      } else if(error.response.status === 400){
        toast.warning('subcategory name already exists')
      }else{
        toast.error(`Error creating a new subcategory: ${error.message}`);
      }
    } finally {
      handleClose();
    }
  };
  // update========================
  const handleUpdate = async (updatedData, subcategoryId) => {
    try {
      const response = await axios.put(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/Subcategories/${subcategoryId}`,
        updatedData
      );

      if (response.status === 200) {
        fetchSubcategories();
        toast.success("Subcategory updated successfully");
      }
    } catch (error) {
      if (error.response.status === 404) {
        toast.warning('No subcategory with that ID found')
      }else{
        toast.error(`Error updating the subcategory: ${error.message}`);
      }
    } finally {
      handleClose();
    }
  };

  const handleShow = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedSubcategory(null);
    setCreateModalVisible(false);
  };
// remove===================
  const removeSubcategory = async (subcategoryId) => {
    try {
      const response = await axios.delete(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/Subcategories/${subcategoryId}`
      );
      if (response.status === 200) {
        const updatedSubcategories = subcategories.filter(
          (subcategory) => subcategory._id !== subcategoryId
        );
        setSubcategories(updatedSubcategories);
        toast.success("Subcategory deleted successfully");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.warning('Products are attached, cannot delete this subcategory')
      }else if (error.response.status === 404){
        toast.error('This subcategory does not exist');
      }else{
        toast.error(`Error deleting subcategory: ${error.message}`);
      }
    }
  };
   // for searching============================

   const [searchValue, setSearchValue] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   const handleSearch = async (value) => {
     setSearchValue(value);
 
     try {
       setLoading(true);
       if (value.trim() === '') {
        fetchSubcategories();
         setSearchResults([]); 
       } else {
       const response = await axios.get('https://e-commerce-project-backend-yec6.onrender.com/v1/Subcategories', {
         params: {
           query: value,
         },
       });
       const results = response.data;
       if (results.length === 0) {
         toast.warning('No products found with the given name.');
       } else {
         setSearchResults(results);
       }
     }
     } catch (error) {
       toast.error(`Error searching subcategories: ${error.message}`);
     } finally {
       setLoading(false);
     }
   };
   useEffect(() => {
    setSubcategories(searchResults);
   }, [searchResults]);

  return (
    <>
      <div className="custom-table">
        <div className="top">
          <h1>Subcategories List</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={() => setCreateModalVisible(true)} style={{ cursor: 'pointer', backgroundColor: "var(--background2)", color:"var(--background)", borderRadius: '15px'}}>Add <AddIcon/></Button>
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
                        <th style={{ borderTopLeftRadius: "8px" }}>Subcategory ID</th>
                        <th>Subcategory Name</th>
                        <th>Category Name</th>
                        <th>Active</th>
                        <th>Update</th>
                        <th style={{ borderTopRightRadius: "8px" }}>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {subcategories
                    .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    )
                    .map((subcategory) => (
                        <tr key={subcategory._id}>
                            <td className="align-middle">{subcategory._id}</td>
                            <td className="align-middle">{subcategory.subcategory_name}</td>
                            <td className="align-middle">{subcategory.categoryName}</td>
                            <td>
                                {subcategory.active === true ? (
                                    <span style={{ color: "green" }}>true</span>
                                ) : (
                                    <span style={{ color: "red" }}>false</span>
                                )}
                            </td>
                            <td className="align-middle">
                                <EditIcon
                                    onClick={() => handleShow(subcategory)}
                                    style={{ cursor: "pointer", color: "blue", width:'100%' }}
                                />
                            </td>
                            <td className="align-middle">
                                <DeleteIcon
                                onClick={() => removeSubcategory(subcategory._id)}
                                style={{ cursor: "pointer", color: "red", width:'100%' }}
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
      <UpdateSubcategoryForm
        subcategory={selectedSubcategory}
        handleUpdate={handleUpdate}
        show={show}
        handleClose={handleClose}
      />
      <CreateCategory
        createShow={isCreateModalVisible}
        handleClose={handleClose}
        handleCreate={handleCreate}
      />
      <Navbar 
        handleSearch={handleSearch} 
        searchValue={searchValue}
      />
    </>
  );
}

export default Subcategories;
