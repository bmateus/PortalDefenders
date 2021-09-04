import React from 'react';
import { NavLink } from 'react-router-dom';
//import { playSound } from '../../helpers/hooks/useSound';
import { useMoralis } from 'react-moralis';
import { smartTrim } from '../../helpers';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import * as globalStyles from '../../theme/globalStyles.module.css';
import * as styles from './styles.module.css';

const WalletButton = () => {

	const { authenticate, isAuthenticated, user, logout } = useMoralis();

	const handleWalletClick = () => {
	  if (!isAuthenticated) {
		//playSound('click');
		authenticate();
	  }
	  else 
	  	logout();
	};

	if (user)
	console.log(user.get("ethAddress"))

	return (
		<button className={styles.walletContainer} onClick={handleWalletClick}>
		  {isAuthenticated  ? (
			  <div className={styles.walletAddress}>
				<Jazzicon diameter={24} seed={jsNumberForAddress(user.get("ethAddress"))} />
				<div className={styles.connectedDetails}>
				  <p>
					{user.get("name")}
				  </p>
				  <p>
					{smartTrim(user.get("ethAddress"),8)}
				  </p>
				</div>
			  </div>
			)
			: 'Connect'}
		</button>
	  );
}

function Header() {
	return (
		<header className={styles.header}>
		<nav className={`${globalStyles.container} ${styles.desktopHeaderContent}`}>
		  <ul className={styles.navContainer}>
			<NavLink
			  //onClick={() => playSound('click')}
			  to="/"
			  className={styles.navLink}
			  activeClassName={styles.activeNavLink}
			  isActive={(_, location) => {
				if (!location) return false;
				const { pathname } = location;
				return pathname === '/';
			  }}
			>
			  Game
			</NavLink>
			<NavLink
			  //onClick={() => playSound('click')}
			  to="/leaderboard"
			  className={styles.navLink}
			  activeClassName={styles.activeNavLink}
			>
			  Leaderboard
			</NavLink>
			<NavLink
			  //onClick={() => playSound('click')}
			  to="/settings"
			  className={styles.navLink}
			  activeClassName={styles.activeNavLink}
			>
			  Settings
			</NavLink>
		  </ul>

		  <WalletButton />

		</nav>

	  </header>
	)
}

export default Header
