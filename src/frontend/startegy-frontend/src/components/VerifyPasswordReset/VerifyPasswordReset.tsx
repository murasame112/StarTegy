import { useState, useEffect } from 'react';
import styles from './VerifyPasswordReset.module.css';
import { useParams, Link } from 'react-router-dom';


function VerifyPasswordReset() {
	const { token } = useParams();
		useEffect(() => {
			if (token) {
				fetch(`http://localhost:4200/verify-password-reset/${token}`)
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
