import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('Введите имя пользователя'),
        password: Yup.string().min(6, 'Пароль должен быть не менее 6 символов').required('Введите пароль'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
            .required('Подтвердите пароль'),
    });

    return (
        <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                axios.post('http://localhost:8080/api/v1/auth/register', {
                    username: values.username,
                    password: values.password,
                })
                    .then(() => navigate('/login')) // Перенаправление на страницу логина после успешной регистрации
                    .catch(error => console.error('Ошибка регистрации:', error))
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
                    <div>
                        <label htmlFor="confirmPassword">Подтвердите пароль</label>
                        <Field type="password" name="confirmPassword" />
                        <ErrorMessage name="confirmPassword" component="div" />
                    </div>
                    <button type="submit" disabled={isSubmitting}>Зарегистрироваться</button>
                </Form>
            )}
        </Formik>
    );
};

export default Register;
