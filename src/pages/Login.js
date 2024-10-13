import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authAPI'; 
import './AuthForm.css';

const Login = ({ onLogin }) => {
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('Введите имя пользователя'),
        password: Yup.string().required('Введите пароль'),
    });

    return (
        <div className="auth-form">
            <h2>Sign in</h2>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setServerError('');
                    try {
                        const response = await loginUser(values.username, values.password); 
                        onLogin(response, values.username); 
                        navigate('/'); 
                    } catch (error) {
                        setServerError(error.message); 
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <Field type="text" name="username" />
                            <ErrorMessage name="username" component="div" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <Field type="password" name="password" />
                            <ErrorMessage name="password" component="div" className="error-message" />
                        </div>
                        {serverError && <div className="server-error">{serverError}</div>}
                        <button type="submit" disabled={isSubmitting}>Sign in</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;
