import React from 'react'
import Header from '../Header';
import styles from './styles.module.css';

function Layout({ children }) {
	return (
		<div className={styles.container}>
		  {/*error && <ErrorModal error={error} onHandleClose={handleCloseErrorModal} />*/}
		  <Header />
		  {children}
		</div>
	  )
}

export default Layout
