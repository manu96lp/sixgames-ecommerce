import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../assets/logo-small.svg';
import { logout } from '../../actions/auth';
import SearchBar from '../SearchBar/SearchBar.jsx';

function NavBar( )
{
	const cartProductsCount = useSelector( ( state ) => ( state.cart.count > 0 ) ? `${ state.cart.count }` : null );
	const { firstName, accessLevel } = useSelector( ( state ) => state.auth.user );
	
	const history = useHistory( );
	const dispatch = useDispatch( );
	
	const handleRedirectOnSuccess = ( ) => {
		setTimeout( ( ) => {
			history.push( '/' );
		}, 1500 );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault( );
		
		dispatch( logout( handleRedirectOnSuccess ) );
	};

	return (
		<Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" className="navbar-main">
			<Navbar.Brand>
				<Logo className="navbar-logo"/>
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="navbarCollapse">
				<FontAwesomeIcon icon={ faBars } className="navbar-open-menu"/>
				<FontAwesomeIcon icon={ faTimes } className="navbar-close-menu"/>
			</Navbar.Toggle>
			<Navbar.Collapse id="navbarCollapse">
				<Nav className="navbar-nav-left">
					<Nav.Link as={ NavLink } to="/products">
						<p className="navbar-text navbar-text-outline">Tienda</p>
					</Nav.Link>
					<div className="navbar-separator"></div>
					<Nav.Link as={ NavLink } to="/admin/dashboard">
						<p className="navbar-text navbar-text-outline">Administración</p>
					</Nav.Link>
				</Nav>
				<Nav className="navbar-nav-right">
					<Nav.Link as={ NavLink } to="/cart" className="navbar-nav-cart">
						<FontAwesomeIcon icon={ faShoppingCart }/>
						<p className="navbar-text">
							Carrito { cartProductsCount && cartProductsCount }
						</p>
					</Nav.Link>
					<Nav.Link as={ NavLink } to="/auth/select" className="navbar-nav-user">
						<FontAwesomeIcon icon={ faUser }/>
						<p className="navbar-text">Ingresar</p>
					</Nav.Link>
					<SearchBar/>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default NavBar;

/*import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, NavLink } from 'react-router-dom';
import { Nav, Navbar, Card, DropdownButton, ButtonGroup, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../assets/logo-full.svg';
import SearchBar from '../SearchBar/SearchBar.jsx';
import { logout } from '../../actions/auth';

function NavBar( )
{
	const cartProductsCount = useSelector( ( state ) => ( state.cart.count > 0 ) ? `${ state.cart.count }` : null );
	const { firstName, accessLevel } = useSelector( ( state ) => state.auth.user );
	
	const history = useHistory( );
	const dispatch = useDispatch( );
	
	const handleRedirectOnSuccess = ( ) => {
		setTimeout( ( ) => {
			history.push( '/' );
		}, 1500 );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault( );
		
		dispatch( logout( handleRedirectOnSuccess ) );
	};

	return (
		<>
			<div class="navbar-top-spacing"></div>
			<Navbar collapseOnSelect expand="lg" fixed="top" variant="dark" className="navbar-main">
				<Navbar.Brand>
					<Nav.Link as={Link} to="/">
						<Logo className="navbar-logo" />
					</Nav.Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarCollapse">
					<FontAwesomeIcon icon={faBars} className="navbar-open-menu" />
					<FontAwesomeIcon icon={faTimes} className="navbar-close-menu" />
				</Navbar.Toggle>
				<Navbar.Collapse id="navbarCollapse">
					<Nav className="navbar-nav-left">
						<NavLink as={Link} exact activeClassName="active" to="/products">
							<p className="navbar-text navbar-text-outline">Tienda</p>
						</NavLink>
						<div className="navbar-separator"></div>
						{userAccessLevel > 0 ?
						<NavLink as={Link} exact activeClassName="active" to="/admin">
							<p className="navbar-text navbar-text-outline">Administración</p>
						</NavLink> : null}
					</Nav>
					<Nav className="navbar-nav-right">
						<NavLink as={Link} exact activeClassName="active" to="/cart" className="navbar-nav-cart">
							<FontAwesomeIcon icon={faShoppingCart} />
							<p className="navbar-text">
								Carrito <span className="cart-count">{cartProductsCount && cartProductsCount}</span>
							</p>
						</NavLink>
						{
							userFirstName ?
							<DropdownButton className="navbar-user-options"
								as={ButtonGroup}
								menuAlign={{ lg: 'right' }}
								icon={<FontAwesomeIcon icon={faUser} />}
								title={
									<p className="navbar-text">
										{userFirstName}
									</p>}
								id="dropdown-menu-align-responsive-1"
							>
								<Form onSubmit={(event) => handleSubmit (event)}>
									<Card>
										<Card.Header bsPrefix="card-header">
											<Card.Title bsPrefix="card-title">Hola {userFirstName}</Card.Title>
										</Card.Header>

										<Card.Body bsPrefix="card-body">
												<Link to="/login/logued/shops">
													<Card.Text bsPrefix="card-text">Mis Compras</Card.Text>
												</Link>
												<Link>
													<Card.Text>Mis Datos</Card.Text>
												</Link>
												<Link>
													<Card.Text>Seguridad</Card.Text>
												</Link>
										</Card.Body>
										<Card.Footer>
											<Button type= "submit" className="card-button">
												Salir
											</Button>
										</Card.Footer>
									</Card>
								</Form>
							</DropdownButton> :
							<NavLink as={ Link } className="navbar-nav-user" exact activeClassName="active" to="/login" >
								<FontAwesomeIcon icon={ faUser }/>
								<p className="navbar-text">
									{ userFirstName || 'Ingresar' }
								</p>
							</NavLink>
						}
						<SearchBar/>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</>
	);
};

export default NavBar;*/