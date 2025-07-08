// ===== components =====
import StratList from './components/StratList/StratList';
import StratSingle from './components/StratSingle/StratSingle';
import StratNew from './components/StratNew/StratNew';
import StratEdit from './components/StratEdit/StratEdit';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Profile from './components/Profile/Profile';
import MFAPage from './components/MFAPage/MFAPage';
import stylesBlank from './components/Blank/Blank.module.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
		useLocation
} from 'react-router-dom';

// ===== styles =====
import './index.css';
import VerifyPage from './components/VerifyPage/VerifyPage';
import VerifyPasswordReset from './components/VerifyPasswordReset/VerifyPasswordReset';




function App() {
    return (
			<Router>
			<Header/>
        <div className='content'>
					<div className='blank'>
                <Routes>
										<Route path="/" element={<StratList />} />
                    <Route
                        path='/strategy/:id'
                        element={<StratSingle />}
                    ></Route>
                    <Route path='/create' element={<StratNew/>}></Route>
                    <Route path='/edit/:id' element={<StratEdit/>}></Route>
                    <Route path='/players'></Route>
                    <Route path='/profile' element={<Profile/>}></Route>
										<Route path='/login' element={<Login/>}></Route>
										<Route path='/registration' element={<Registration/>}></Route>
										<Route path='/authenticate' element={<MFAPage/>}></Route>
										<Route path='/verify-password-reset/:token' element={<VerifyPasswordReset/>}></Route>
										<Route path='/verify' element={<VerifyPage/>}></Route>
                    <Route
                        path='*'
                        element={<Navigate to='/' replace />}
                    ></Route>
                </Routes>
						</div>
        </div>
				<Footer/>
				</Router>
    );
}

export default App;
