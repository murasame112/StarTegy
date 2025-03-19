// ===== components =====
import StratList from './components/StratList/StratList';
import StratSingle from './components/StratSingle/StratSingle';
import StratNew from './components/StratNew/StratNew';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
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


function App() {
    return (
			<Router>
			<Header/>
        <div className='content'>
					<div className={'blank'}>
                <Routes>
										<Route path="/" element={<StratList />} />
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
        </div>
				<Footer/>
				</Router>
    );
}

export default App;
