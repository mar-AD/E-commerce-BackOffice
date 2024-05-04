import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Categories.css"; // Create a CSS file for Categories if needed
import Navbar from "../../Partials/Navbar/Navbar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCategory = ({ createShow, handleClose, handleCreate }) => {
  const [newCategory, setNewCategory] = useState({
    category_name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(newCategory);
  };

  return (
    <Modal show={createShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              name="category_name"
              value={newCategory.category_name}
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

const UpdateCategoryForm = ({ category, handleUpdate, show, handleClose }) => {
  const [formData, setFormData] = useState({
    category_name: "",
    active: true, 
  });

  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name || "",
        active: category.active || true, 
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData, category._id);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              name="category_name"
              value={formData.category_name}
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

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://e-commerce-project-backend-yec6.onrender.com/v1/categories?page=${currentPage}&perPage=${itemsPerPage}`);
      setCategories(response.data);
    } catch (error) {
      toast.error(`Error fetching categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
    // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

    // create ==========================
    const handleCreate = async (newCategory) => {
    try {
      const response = await axios.post(
        "https://e-commerce-project-backend-yec6.onrender.com/v1/categories",
        newCategory
      );

      if (response) {
        toast.success("New Category created successfully");
        fetchCategories();
      }
    } catch (error) {
      if(error.response.status === 400) {
        toast.warning(`there is already a category with that name`);
      }else{
        toast.error(`Error creating a new category: ${error.message}`);
      }
    } finally {
      handleClose();
    }
  };
  // update========================
  const handleUpdate = async (updatedData, categoryId) => {
    try {
      const response = await axios.put(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/categories/${categoryId}`,
        updatedData
      );

      if (response.status === 200) {
        fetchCategories();
        toast.success("Category updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update category", error);
    } finally {
      handleClose();
    }
  };

  const handleShow = (category) => {
    setSelectedCategory(category);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCategory(null);
    setCreateModalVisible(false);
  };
// remove===================
  const removeCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/categories/${categoryId}`
      );
      if (response.status === 200) {
        const updatedCategories = categories.filter(
          (category) => category._id !== categoryId
        );
        setCategories(updatedCategories);
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      if (error.response.status === 400) {
        toast.warning("Unable to delete this category, subcategories are attached to it");
      }else{
        toast.warning("the categorie ID is invalide");
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
        fetchCategories();
         setSearchResults([]); 
       } else {
       const response = await axios.get('https://e-commerce-project-backend-yec6.onrender.com/v1/Categories', {
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
       toast.error(`Error searching products: ${error.message}`);
     } finally {
       setLoading(false);
     }
   };
   useEffect(() => {
    setCategories(searchResults);
   }, [searchResults]);
  return (
    <>
      <div className="custom-table">
        <div className="top">
          <h1>Categories List</h1>
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
                        <th style={{ borderTopLeftRadius: "8px" }}>Category ID</th>
                        <th>Category Name</th>
                        <th>Active</th>
                        <th>Update</th>
                        <th style={{ borderTopRightRadius: "8px" }}>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {categories
                    .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    )
                    .map((category) => (
                        <tr key={category._id}>
                            <td className="align-middle">{category._id}</td>
                            <td className="align-middle">{category.category_name}</td>
                            <td>
                                {category.active === true ? (
                                    <span style={{ color: "green" }}>true</span>
                                ) : (
                                    <span style={{ color: "red" }}>false</span>
                                )}
                            </td>
                            <td className="align-middle">
                                <EditIcon
                                    onClick={() => handleShow(category)}
                                    style={{ cursor: "pointer", color: "blue" }}
                                />
                            </td>
                            <td className="align-middle">
                                <DeleteIcon
                                onClick={() => removeCategory(category._id)}
                                style={{ cursor: "pointer", color: "red" }}
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
      <UpdateCategoryForm
        category={selectedCategory}
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

export default Categories;
