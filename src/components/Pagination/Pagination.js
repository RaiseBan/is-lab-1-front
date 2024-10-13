import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className={styles.pagination}>
            {pageNumbers.map(number => (
                <li
                    key={number}
                    className={`${styles.pageItem} ${currentPage === number ? styles.active : ''}`}
                >
                    <button
                        className={styles.pageLink}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default Pagination;
