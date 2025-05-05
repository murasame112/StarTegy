import styles from './Header.module.css';
import logo from '/pictures/logo/logo-three_s-removebg-preview.png';
import { useAuth } from '../../context/auth-context';
import {useNavigate} from 'react-router-dom';
import React, { useRef, useEffect, useState} from 'react';

function Header() {
	const navigate = useNavigate();
	const { isLoggedIn, logout } = useAuth();
	const [userMenuVisible, setuserMenuVisible] = useState<boolean>(false);
	const [userMenuPosition, setUserMenuPosition] = useState({top: 0, left: 0});
	const targetRef = useRef<HTMLButtonElement>(null);

	const toStratlist = () => {
		navigate("/");
	}

	useEffect(() => {
		console.log(isLoggedIn);
		const updateUserMenuPosition = () => {
			const rect = targetRef.current?.getBoundingClientRect();
			if (rect){
				setUserMenuPosition({
					top: rect.bottom + window.scrollY,
					left: rect.left + window.scrollX
				});	
			}
		};

		updateUserMenuPosition();
		window.addEventListener('resize', updateUserMenuPosition);
		window.addEventListener('scroll', updateUserMenuPosition, true);

		return () => {
			window.removeEventListener('resize', updateUserMenuPosition);
			window.removeEventListener('scroll', updateUserMenuPosition, true);
		}

	}, []);

	const handleLogout = () => {
		logout();
		navigate('/login');
		setuserMenuVisible(false);
	}

    return (
        <div className={styles.header}>
            <div className={styles.content} onClick={toStratlist}>
                <div className={styles.logo}>
                    <img
                        className={styles.logo_image}
                        src={logo}
                        alt='pic'
                    ></img>
                </div>
                <div className={styles.title}>
                    <h1>Startegy</h1>
                    <h3>Starcraft 2 build order tool</h3>
                </div>
            </div>
						<div>
						{isLoggedIn && (
							<button
							className={
								userMenuVisible
										? 'buttonSecondaryActive'
										: 'buttonSecondary'
						}
						onClick={() => {
								setuserMenuVisible(!userMenuVisible);
						}}
						ref={targetRef}
						>
								User
							</button>
      			)}
												{userMenuVisible && (
                              <div
															style={{
																position: 'absolute',
																top: userMenuPosition.top,
																left: userMenuPosition.left
																
															}}
															className = {styles.userMenu}
														>
													<ul>
														<li>Profile</li>
														<hr/>
														<li onClick={handleLogout}>Logout</li>
													</ul>
                        </div>
                    )}
						</div>

        </div>
    );
}

export default Header;
