import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import globalStyles from "../../theme/globalStyles.module.css";
import styles from './styles.module.css';

function Home() {

	return (
		<Layout>
			<div className={globalStyles.container}>
				<div className={styles.gotchiContainer}>
					<div className={styles.buttonContainer}>
					<Link
						to="/play"
						className={globalStyles.primaryButton}
						//onClick={() => playSound("send")}
					>
						Start
					</Link>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default Home
