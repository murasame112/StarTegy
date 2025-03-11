// ===== components =====
import Blank from './components/Blank/Blank';
import StratList from './components/StratList/StratList';
import StratSingle from './components/StratSingle/StratSingle';
import StratNew from './components/StratNew/StratNew';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TempNavbar from './components/TempNavbar/TempNavbar';
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


function App() {
    return (
			<Router>
			<Header/>
        <div className='content'>
					<TempNavbar/>
                {/* <Link to="/strategy/id" >display strategy</Link>  */}
                {/* <Link to="/edit/id" >edit strategy</Link>  */}
                {/* <Link to="/players" >Players list</Link> */}
                {/* <Link to="/profile/id" >user profile</Link>  */}

                <Routes>
                    <Route path='/strategies' element={<StratList />}></Route>
                    <Route
                        path='/strategy/:id'
                        element={<StratSingle />}
                    ></Route>
                    <Route path='/create' element={<StratNew/>}></Route>
                    <Route path='/edit/id'></Route>
                    <Route path='/players'></Route>
                    <Route path='/profile/id'></Route>
                    <Route
                        path='*'
                        element={<Navigate to='/' replace />}
                    ></Route>
                </Routes>
        </div>
				<Footer/>
				</Router>
    );
}

export default App;
