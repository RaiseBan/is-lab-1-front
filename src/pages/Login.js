import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('Введите имя пользователя'),
        password: Yup.string().required('Введите пароль'),
    });

    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                axios.post('http://localhost:8080/api/v1/auth/authenticate', values)
                    .then(response => {
                        onLogin(response.data, values.username); // Вызовем функцию авторизации
                        navigate('/'); // Перенаправляем на главную страницу
                    })
                    .catch(error => console.error('Ошибка авторизации:', error))
                    .finally(() => setSubmitting(false));
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div>
                        <label htmlFor="username">Имя пользователя</label>
                        <Field type="text" name="username" />
                        <ErrorMessage name="username" component="div" />
                    </div>
                    <div>
                        <label htmlFor="password">Пароль</label>
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" component="div" />
                    </div>
                    <button type="submit" disabled={isSubmitting}>Войти</button>
                </Form>
            )}
        </Formik>
    );
};

export default Login;
