import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Modal, Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Products.css";
import Navbar from '../../Partials/Navbar/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProduct = ({ createShow, handleClose, handleCreate }) => {
  const [newProduct, setNewProduct] = useState({
    sku: "",
    productName: "",
    subcategoryID: "",
    shortDescription: "",
    longDescription: "",
    price: "",
    discountPrice: "",
    options: "",
    productImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduct((prevData) => ({
      ...prevData,
      productImage: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreate(newProduct);
  };

  return (
    <Modal show={createShow} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSku">
            <Form.Label>SKU</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SKU"
              name="sku"
              value={newProduct.sku}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formProductImage">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              name="productImage"
              onChange={handleImageChange}
            />
          </Form.Group>

          <Form.Group controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              name="productName"
              value={newProduct.productName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formSubcategoryID">
            <Form.Label>Subcategory ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subcategory ID"
              name="subcategoryID"
              value={newProduct.subcategoryID}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formShortDescription">
            <Form.Label>Short Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter short description"
              name="shortDescription"
              value={newProduct.shortDescription}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formLongDescription">
            <Form.Label>Long Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter long description"
              name="longDescription"
              value={newProduct.longDescription}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter price"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formDiscountPrice">
            <Form.Label>Discount Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter discount price"
              name="discountPrice"
              value={newProduct.discountPrice}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formOptions">
            <Form.Label>Options</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter options"
              name="options"
              value={newProduct.options}
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

const UpdateProductForm = ({ product, handleUpdate, show, handleClose }) => {
  const [formData, setFormData] = useState({
    sku: "",
    productName: "",
    subcategoryID: "",
    shortDescription: "",
    longDescription: "",
    price: "",
    discountPrice: "",
    options: "",
    productImage: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || "",
        productImage: product.product_image || "",
        productName: product.product_name || "",
        subcategoryID: product.subcategory_id
          ? product.subcategory_id.toString()
          : "",
        shortDescription: product.short_description || "",
        longDescription: product.long_description || "",
        price: product.price || "",
        discountPrice: product.discount_price || "",
        options: product.options || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      productImage: file,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData, product._id);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSku">
            <Form.Label>SKU</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formProductImage">
            <Form.Label>Product Image</Form.Label>
            <Form.Control
              type="file"
              name="productImage"
              onChange={handleImageChange}
            />
          </Form.Group>

          <Form.Group controlId="formProductName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formSubcategoryID">
            <Form.Label>Subcategory ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subcategory ID"
              name="subcategoryID"
              value={formData.subcategoryID}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formShortDescription">
            <Form.Label>Short Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter short description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formLongDescription">
            <Form.Label>Long Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter long description"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formDiscountPrice">
            <Form.Label>Discount Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter discount price"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="formOptions">
            <Form.Label>Options</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter options"
              name="options"
              value={formData.options}
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

function ProductsList() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState(null);
  const [productData, setProductData] = useState([]);
  const Close = () => setView(false);
  const views = () => setView(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://e-commerce-project-backend-yec6.onrender.com/v1/allproducts?page=${currentPage}&perPage=${itemsPerPage}`
        );
        setProducts(response.data);
      } catch (error) {
        toast.error(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  //create product==============================

  const handleCreate = async (newProduct) => {
    try {
      const formData = new FormData();
      formData.append("sku", newProduct.sku);
      formData.append("productName", newProduct.productName);
      formData.append("subcategoryID", newProduct.subcategoryID);
      formData.append("shortDescription", newProduct.shortDescription);
      formData.append("longDescription", newProduct.longDescription);
      formData.append("price", newProduct.price);
      formData.append("discountPrice", newProduct.discountPrice);
      formData.append("options", newProduct.options);
      formData.append("product_image", newProduct.productImage);

      const response = await axios.post(
        "https://e-commerce-project-backend-yec6.onrender.com/v1/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("New Product created successfully");
        fetchProducts(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const validationErrors = error.response.data.err;
        toast.warning([...validationErrors, 'Please check your input and try again.'].join('\n'));
      }else if(error.response && error.response.status === 404){
        toast.warning("This subcategory is not found")
      } else {
        const errorMessage =  "This product already exists, check the SKU input ";
        toast.error(errorMessage);
      }
    } finally {
      handleClose();
    }
  };

  const ShowCreate = () => {
    setCreateModalVisible(true);
  };
  // update product =========================

  const handleUpdate = async (updatedData, productId) => {
    try {
      const response = await axios.patch(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/products/${productId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        fetchProducts();
        toast.success("Product updated successfully");
      } else {
        toast.warning("Failed to update product");
      }
    } catch (error) {
      toast.error("Error updating product:", error);
    } finally {
      handleClose();
    }
  };

  const handleShow = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedProduct(null);
    setCreateModalVisible(false);
  };

  //remove product======================================

  const removeProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/products/${productId}`
      );
      if (response.status === 200) {
        const updatedProducts = products.filter(
          (product) => product._id !== productId
        );
        setProducts(updatedProducts);
        toast.success("Product deleted successfully");
      } else {
        toast.warning("Failed to delete product");
      }
    } catch (error) {
      toast.error("Error deleting product:", error);
    }
  };

  //view moreee=========================

  const viewProduct = async (productId) => {
    try {
      const response = await axios.get(
        `https://e-commerce-project-backend-yec6.onrender.com/v1/products/${productId}`
      );
      if (response.status === 200) {
        views()
        setProductData(response.data[0]);
      } else {
        toast.warning("Failed to fetch product details");
      }
    } catch (error) {
      toast.error("Error viewing product:", error);
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
        fetchProducts();
        setSearchResults([]); 
      } else {
      const response = await axios.get('https://e-commerce-project-backend-yec6.onrender.com/v1/allproducts', {
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
    setProducts(searchResults);
  }, [searchResults]);
  
  return (
    <>
      <div className="custom-table">
        <div className="top">
          <h1>Products List</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={ShowCreate} style={{ cursor: 'pointer', backgroundColor: "var(--background2)", color:"var(--background)", borderRadius: '15px'}}>Add <AddIcon/></Button>
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
                <th style={{ borderTopLeftRadius: "8px" }}>Images</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Update</th>
                <th>Remove</th>
                <th style={{ borderTopRightRadius: "8px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {products
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.product_image}
                        alt="Product"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td className="align-middle">{product.sku}</td>
                    <td className="align-middle">{product.product_name}</td>
                    <td className="align-middle">{product.price}</td>
                    <td className="align-middle">{product.categoryName}</td>
                    <td className="align-middle">
                      <EditIcon
                        onClick={() => handleShow(product)}
                        style={{ cursor: "pointer", color: "blue", width:'100%' }}
                      />
                    </td>
                    <td className="align-middle">
                      <DeleteIcon
                        onClick={() => removeProduct(product._id)}
                        style={{ cursor: "pointer", color: "red", width:'100%' }}
                      />
                    </td>
                    <td className="align-middle">
                      <VisibilityIcon
                        onClick={() => viewProduct(product._id)}
                        style={{ cursor: "pointer", color: "green", width:'100%' }}
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
          <Modal.Title>All Product's infos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productData && (
            <div style={{ display: "flex", gap: "2rem" }}>
              <span>
                <img
                  src={productData.product_image}
                  alt="img"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "8px",
                  }}
                />
              </span>
              <span style={{ width: "250px" }}>
                <p><span style={{fontWeight:'800'}}>Sku:</span> {productData.sku}</p>
                <p><span style={{fontWeight:'800'}}>Product Name:</span> {productData.product_name}</p>
                <p><span style={{fontWeight:'800'}}>Short Description:</span> {productData.short_description}</p>
                <p><span style={{fontWeight:'800'}}>Long Description:</span> {productData.long_description}</p>
                <p><span style={{fontWeight:'800'}}>Price:</span> {productData.price}</p>
              </span>
              <span style={{ width: "250px" }}>
                <p><span style={{fontWeight:'800'}}>Discount Price:</span> {productData.discount_price}</p>
                <p><span style={{fontWeight:'800'}}>Options:</span> {productData.options}</p>
                <p><span style={{fontWeight:'800'}}>Saveubcategory Name:</span> {productData.subcategoryName}</p>
                <p>
                <span style={{fontWeight:'800'}}>Active:</span>{" "}
                  {productData.active === true ? (
                    <span style={{ color: "green" }}>true</span>
                  ) : (
                    <span style={{ color: "red" }}>false</span>
                  )}
                </p>
              </span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="Modal-Footer">
          <Button className="savebtn" onClick={Close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {selectedProduct && (
        <UpdateProductForm
          product={selectedProduct}
          handleUpdate={handleUpdate}
          show={show}
          handleClose={handleClose}
        />
      )}
      <CreateProduct
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

export default ProductsList;
