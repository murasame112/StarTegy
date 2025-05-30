import { useState, useEffect } from 'react';
import styles from './VerifyPasswordReset.module.css';
import { useNavigate, Link } from 'react-router-dom';

function VerifyPasswordReset() {

		useEffect(() => {
			const params = new URLSearchParams(window.location.search);
			const token = params.get("token");

			if (token) {
				fetch(`http://localhost:4200/verify-password-reset?token=${token}`)
					.then(res => res.text())
					.then(text => alert(text))
					.catch(() => alert("Something went wrong"));
			}
		}, []);


    return (
        <div className='card' style={{ width: '800px' }}>
            <Link to={'/profile'}>
                <button className='buttonSecondary'>Back to profile</button>
            </Link>
        </div>
    );
}

export default VerifyPasswordReset;
