import React, { useEffect } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { verifySession } from "../../actions/auth";
import { loadCategories } from "../../actions/category";

/* =================================================================================
* 			[ Importamos las hojas de estilos en orden ]
* ================================================================================= */

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "floating-label-react/styles.css";
import "../../styles/global.scss";

/* =================================================================================
* 			[ Importamos componentes y contenedores ]
* ================================================================================= */

/*import Home 			from "../Home/Home.jsx";
import Catalogue 		from "../Catalogue/Catalogue.jsx";
import Cart 			from "../Cart/Cart.jsx";
import Product 			from "../Product/Product.jsx";
import Order 			from "../Order/Order.jsx";
import Purchases 		from "../Purchases/Purchases.jsx";
import Review 			from "../Review/Review.jsx";*/
import NavBar 			from "../NavBar/NavBar.jsx";

import SelectAuth 		from "../Auth/Select.jsx";
import Login 			from "../Auth/Login.jsx";
import Logout 			from "../Auth/Logout.jsx";
import SignUp 			from "../Auth/SignUp.jsx";
import ForgotPassword 	from "../Auth/ForgotPassword.jsx";
import ResetPassword 	from "../Auth/ResetPassword.jsx";

import AdminDashboard 	from "../Admin/Dashboard.jsx";
import AdminNavigation 	from "../Admin/Navigation.jsx";
import CategoryManager 	from "../Admin/CategoryManager.jsx";
import CategoryDetails 	from "../Admin/CategoryDetails.jsx";
import OrderManager 	from "../Admin/OrderManager.jsx";
import ProductManager 	from "../Admin/ProductManager.jsx";
import ProductDetails 	from "../Admin/ProductDetails.jsx";
import UserManager 		from "../Admin/UserManager.jsx";
import ReviewManager 	from "../Admin/ReviewManager.jsx";
import OfferManager 	from "../Admin/OfferManager.jsx";

import Notification 	from "../Notification/Notification.jsx";
import ErrorPage 		from "../ErrorPage/ErrorPage.jsx";
import ProtectedRoute 	from "../ProtectedRoute/ProtectedRoute.jsx";

/* =================================================================================
* 			  [ Creamos el componente App, cargamos las categorías y
* 			   		verificamos el usuario local al renderizar ]
* ================================================================================= */

function App( )
{
	const dispatch = useDispatch( );

	useEffect( ( ) => {
		dispatch( verifySession( ) );
		dispatch( loadCategories( ) );
	}, [ dispatch ] );

	return (
		<Container fluid className="app">
			<Switch>
				<ProtectedRoute path="/admin" requiredAccess={ 1 } children={ <AdminNavigation /> } />
				<Route path="/auth" component={ null } />
				<Route path="/" component={ NavBar } />
			</Switch>
			
			<Switch>
				{ 	/* =================================================================================
					* 			[ Rutas comunes ]
					* ================================================================================= */ }
				
				{/* <Route exact path="/" component={ Home } />
				<Route exact path="/catalogue" component={ Catalogue } />
				<Route exact path="/cart" component={ Cart } />
				<Route exact path="/product/:productId" render={ ( { match } ) =>
					<Product productId={ match.params.productId } />
				} /> */}
				
				{ 	/* =================================================================================
					* 			[ Rutas de usuarios autentificados ]
					* ================================================================================= */ }
				
				{/* <ProtectedRoute exact path="/order" component={ Order } />
				<ProtectedRoute exact path="/purchases" component={ Purchases } />
				<ProtectedRoute exact path="/product/:productId/review" render={ ( { match } ) =>
					<Review reviewId={ match.params.productId } />
				} /> */}
				
				{ 	/* =================================================================================
					* 			[ Rutas de autentificación ]
					* ================================================================================= */ }
				
				<Route exact path="/auth/login" component={ Login } />
				<Route exact path="/auth/signup" component={ SignUp } />
				<Route exact path="/auth/select" component={ SelectAuth } />
				<Route exact path="/auth/logout" component={ Logout } />
				<Route exact path="/auth/forgot" component={ ForgotPassword } />
				<Route exact path="/auth/reset/:token" render={ ( { match } ) =>
					<ResetPassword token={ match.params.token } />
				} />
				
				{	/* =================================================================================
					* 			[ Rutas de administración ]
					* ================================================================================= */ 	}
				
				<ProtectedRoute exact path="/admin/dashboard" requiredAccess={ 1 } component={ AdminDashboard } />
				
				<ProtectedRoute exact path="/admin/products" requiredAccess={ 1 } component={ ProductManager } />
				<ProtectedRoute exact path="/admin/products/:id" requiredAccess={ 1 } component={ ProductDetails } />
				
				<ProtectedRoute exact path="/admin/categories" requiredAccess={ 1 } component={ CategoryManager } />
				<ProtectedRoute exact path="/admin/categories/:id" requiredAccess={ 1 } component={ CategoryDetails } />
				
				<ProtectedRoute exact path="/admin/orders" requiredAccess={ 1 } component={ OrderManager } />
				<ProtectedRoute exact path="/admin/users" requiredAccess={ 1 } component={ UserManager } />
				<ProtectedRoute exact path="/admin/reviews" requiredAccess={ 1 } component={ ReviewManager } />
				<ProtectedRoute exact path="/admin/offers" requiredAccess={ 1 } component={ OfferManager } />
				
				
				{/* <ProtectedRoute exact path="/admin/orders/:id" requiredAccess={ 1 } render={ ( { match } ) =>
					<OrdersDetails id={ match.params.id } />
				} />
				<ProtectedRoute exact path="/admin/users/:id" requiredAccess={ 1 } render={ ( { match } ) =>
					<UsersDetails id={ match.params.id } />
				} />
				<ProtectedRoute exact path="/admin/reviews/:id" requiredAccess={ 1 } render={ ( { match } ) =>
					<ReviewsDetails id={ match.params.id } />
				} />
				<ProtectedRoute exact path="/admin/offers/:id" requiredAccess={ 1 } render={ ( { match } ) =>
					<OffersDetails id={ match.params.id } />
				} /> */}
				
				{	/* =================================================================================
					* 			[ Ruta de error handling ]
					* ================================================================================= */ }
				
				<Route exact path="/error/:type" render={ ( { match } ) =>
					<ErrorPage type={ match.params.type } />
				} />
				
				<Route path="*" render={ ( ) => <Redirect to="/error/404" /> } />
			</Switch>
			
			<Notification />
		</Container>
	);
}

export default App;