import {
	Link,
	useLocation
} from 'react-router-dom';

function TempNavbar(){
  const location = useLocation();
	let className = 'navbarTemp';
  if (location.pathname !== '/'){
		className += 'Inactive'
	}
	return (	
	<div className={className}>
		<p>TEMPORARY NAVBAR</p><br/>
		<Link to='/strategies'>Strategy list</Link><br/>
		<Link to='/create'>Add new strategy</Link><br/>
		<Link to='/parse'>build parser</Link>
	</div>);
}

export default TempNavbar;