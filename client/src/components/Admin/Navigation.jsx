import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faAlignJustify, faShoppingCart, faUsers, faComment, faTag, faUser, faSignOutAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../assets/logo-full.svg';

function AdminNavigation( )
{
	const { firstName } = useSelector( ( state ) => state.auth.user );
	
	return (
		<>
			<div className="admin__navigation admin__side-nav">
				<div className="admin__logo">
					<Logo />
				</div>
				
				<NavLink to="/admin/dashboard">
					<FontAwesomeIcon icon={ faTachometerAlt } /> Dashboard
				</NavLink>
				<NavLink to="/admin/products">
					<FontAwesomeIcon icon={ faBox } /> Productos
				</NavLink>
				<NavLink to="/admin/categories">
					<FontAwesomeIcon icon={ faAlignJustify } /> Categorías
				</NavLink>
				<NavLink to="/admin/orders">
					<FontAwesomeIcon icon={ faShoppingCart } /> Órdenes
				</NavLink>
				<NavLink to="/admin/users">
					<FontAwesomeIcon icon={ faUsers } /> Usuarios
				</NavLink>
				<NavLink to="/admin/reviews">
					<FontAwesomeIcon icon={ faComment } /> Reseñas
				</NavLink>
				<NavLink to="/admin/offers">
					<FontAwesomeIcon icon={ faTag } /> Ofertas
				</NavLink>
			</div>
			<div className="admin__navigation admin__top-nav">
				<Link to="/">
					<FontAwesomeIcon icon={ faHome } /> Ir al Inicio
				</Link>
				<Link to="/auth/logout">
					<FontAwesomeIcon icon={ faSignOutAlt } /> Cerrar sesión
				</Link>
				<p>
					<FontAwesomeIcon icon={ faUser } /> { firstName }
				</p>
			</div>
		</>
	);
	
}

export default AdminNavigation;