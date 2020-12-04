import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { forgotPassword } from "../../api/auth";
import { showError, isValidEmail } from "../../utils";
import { ReactComponent as Logo } from "../../assets/logo-full.svg";

function ForgotPassword( )
{
	const [ error, setError ] = useState( "" );
	const [ sent, setSent ] = useState( false );
	const [ input, setInput ] = useState( {
		email: ""
	} );
	
	const handleInputChange = ( event ) => {
		setInput( {
			...input,
			[ event.target.name ]: event.target.value
		} );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault( );

		const { email } = input;

		if ( !isValidEmail( email ) ) {
			setError( "Correo electrónico inválido" );

			return;
		}
		
		forgotPassword( email )
			.then( ( response ) => {
				setSent( true );
			} )
			.catch( ( error ) => {
				showError( "¡Ocurrió un error inesperado!" );
			} );
	};
	
	if ( sent ) {
		return renderEmailSent( );
	}

	return (
		<Container className="auth-modal__wrapper" noGutters>
			<div className="auth-modal__modal">
				<Logo className="auth-modal__logo" />
				<p className="auth-modal__info">
					Ingresa los datos de tu cuenta
				</p>
				{ !error ? null : <p className="auth-modal__error">{ error }</p> }
				<Form className="auth-modal__form" onSubmit={ ( event ) => handleSubmit( event ) }>
					<Form.Group>
						<Form.Control
							required
							name="email"
							type="email"
							value={ input.email }
							placeholder="Ingresa tu correo electrónico"
							onChange={ handleInputChange }
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Solicitar código
					</Button>
				</Form>
				<div className="auth-modal__links">
					<p>¿Recordaste tu clave? <Link to="/login">Iniciar sesión</Link></p>
					<p>Si quieres puedes <Link to="/">volver al inicio</Link></p>
				</div>
			</div>
		</Container>
	);
};

function renderEmailSent( )
{
	return (
		<div className="auth-modal__page-message">
			<h2>¡Enviamos un código de recuperación a tu email!</h2>
			<p>Si quieres puedes <Link to="/">volver al inicio</Link>.</p>
		</div>
	);
}

export default ForgotPassword;