import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { ReactComponent as LogoFull } from "../../assets/logo-full.svg";
import { ReactComponent as LogoSmall } from "../../assets/logo-small.svg";

function Login( )
{
	const isLogged = useSelector( ( state ) => state.auth.isLogged );
	
	if ( isLogged ) {
		return renderAlreadyLogged( );
	}

	return (
		<Container className="auth-modal__wrapper" noGutters>
			<div className="auth-modal__modal">
				<LogoFull className="auth-modal__logo" />
				<p className="auth-modal__info">
					Elige como prefieres iniciar sesión
				</p>
				<div className="auth-modal__login-methods-list">
					<Link to="/auth/login">
						<div className="auth-modal__login-method">
							<div className="auth-modal__login-method--icon auth-modal__local">
								<LogoSmall />
							</div>
							<div className="auth-modal__login-method--text">
								Iniciar sesión con Six Games
							</div>
						</div>
					</Link>
					<Link to="/auth/select">
						<div className="auth-modal__login-method">
							<div className="auth-modal__login-method--icon auth-modal__google">
								<FontAwesomeIcon icon={ faGoogle }/>
							</div>
							<div className="auth-modal__login-method--text">
								Iniciar sesión con Google
							</div>
						</div>
					</Link>
					<Link to="/auth/select">
						<div className="auth-modal__login-method">
							<div className="auth-modal__login-method--icon auth-modal__facebook">
								<FontAwesomeIcon icon={ faFacebook }/>
							</div>
							<div className="auth-modal__login-method--text">
								Iniciar sesión con Facebook
							</div>
						</div>
					</Link>
				</div>
				<div className="auth-modal__links">
					<p>¿No tienes una cuenta? <Link to="/auth/signup">Crea una cuenta</Link></p>
					<p>¿Estas en el lugar equivocado? <Link to="/">Volver al inicio</Link></p>
				</div>
			</div>
		</Container>
	);
};

function renderAlreadyLogged( )
{
	return (
		<div className="auth-modal__page-message">
			<h2>Ya estás autenticado en una cuenta</h2>
			<p>Si quieres puedes <Link to="/">volver al inicio</Link>.</p>
		</div>
	);
}

export default Login;