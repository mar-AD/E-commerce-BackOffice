
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import './Login.css'

function PasswordResetProcess() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        verifyToken();
    }, []);

    const verifyToken = async () => {
        try { 
            const response = await axios.get(`https://e-commerce-project-backend-yec6.onrender.com/v1/users/password/reset/verify/${token}`);
            // toast.success(response.data.message);
            setIsValidToken(true);
        } catch (error) {
            toast.error('Token verification failed:', error);
            setIsValidToken(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            await verifyToken();
            if (isValidToken) {
                setLoading(true);
                if (!newPassword.trim() || newPassword.trim().length < 6) {
                    toast.error('Password must not be empty and must be at least 6 characters');
                    return;
                }
                if (newPassword !== confirmPassword) {
                    toast.error('Passwords do not match');
                    return;
                }
                const response = await axios.post(`https://e-commerce-project-backend-yec6.onrender.com/v1/users/password/reset/update/${token}`, {
                    newPassword: newPassword,
                });
                toast.success(response.data.message);
                navigate('/login');
            } else {
                toast.error('Invalid token');
            }
        } catch (error) {
            toast.error('Password reset failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bodys-res'>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                        <ClipLoader color="#333" loading={loading} size={50} />
                    </div>
                </div>
            )}
            <div className='formas'>
                <h1 style={{ color: '#333' }}>Reset Password</h1>
                <label style={{ display: 'block', margin: '10px 0', fontSize: '16px' }}>New Password:</label>
                <input
                    className='forminput'
                    type="password"
                    value={newPassword}
                    placeholder='Enter your new password'
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                        background: 'white',
                        color: 'black',
                    }}
                />
                <label style={{ display: 'block', margin: '10px 0', fontSize: '16px' }}>Confirm New Password:</label>
                <input
                    className='forminput'
                    type="password"
                    value={confirmPassword}
                    placeholder='Confirm your new password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                        background: 'white',
                        color: 'black',
                    }}
                />
                <button
                    onClick={handleResetPassword}
                    style={{
                        backgroundColor: '#f1e496',
                        color: '#333',
                        marginTop: '18px',
                        padding: '12px 20px',
                        fontSize: '18px',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer',
                    }}
                >
                    Reset Password
                </button>
            </div>
            <ToastContainer />
        </div>
    );
}      

export default PasswordResetProcess;
