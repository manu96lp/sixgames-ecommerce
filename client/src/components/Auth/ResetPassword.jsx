import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { resetPassword } from "../../api/auth";
import { showError, showSuccess, isValidPassword } from "../../utils";
import { ReactComponent as Logo } from "../../assets/logo-full.svg";

function ResetPassword( { token } )
{
	const [ error, setError ] = useState( "" );
	const [ input, setInput ] = useState( {
		password: "",
		confirm: ""
	} );

	const history = useHistory( );

	const handleInputChange = ( event ) => {
		setInput( {
			...input,
			[ event.target.name ]: event.target.value
		} );
	};

	const handleSubmit = ( event ) => {
		event.preventDefault( );

		const { password, confirm } = input;

		if ( !isValidPassword( password ) ) {
			setError( "Clave inválida (mínimo cuatro caracteres)" );

			return;
		}

		if ( password !== confirm ) {
			setError( "Las claves ingresadas no coinciden" );

			return;
		}

		resetPassword( token, password )
			.then( ( response ) => {
				setTimeout( ( ) => {
					history.push( "/login" );
				}, 3000 );

				showSuccess( "¡Cambiaste correctamente la clave de tu cuenta!" );
			} )
			.catch( ( error ) => {
				showError( "Token de recuperación vencido o inexistente" );
			} );
	};

	if ( !token || ( token.length !== 64 ) ) {
		return renderInvalidToken( );
	}

	return (
		<Container className="auth-modal__wrapper" noGutters>
			<div className="auth-modal__modal">
				<Logo className="auth-modal__logo" />
				<p className="auth-modal__info">
					Reestablecer la clave de tu cuenta
				</p>
				{ !error ? null : <p className="auth-modal__error">{ error }</p> }
				<Form className="auth-modal__form" onSubmit={ ( event ) => handleSubmit( event ) }>
					<Form.Group>
						<Form.Control
							required
							minlength={ 4 }
							name="password"
							type="password"
							value={ input.password }
							placeholder="Ingresa tu nueva clave"
							onChange={ handleInputChange }
						/>
					</Form.Group>

					<Form.Group>
						<Form.Control
							required
							minlength={ 4 }
							name="confirm"
							type="password"
							placeholder="Repite la clave anterior"
							value={ input.confirm }
							onChange={ handleInputChange }
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Cambiar clave ahora
					</Button>
				</Form>
				<div className="auth-modal__links">
					<p>¿No necesitas cambiar tu clave? <Link to="/login">Iniciar sesión</Link></p>
					<p>Si quieres puedes <Link to="/">volver al inicio</Link></p>
				</div>
			</div>
		</Container>
	);
};

function renderInvalidToken( )
{
	return (
		<div className="auth-modal__page-message">
			<h2>El token de recuperación es inválido</h2>
			<p>Si quieres puedes <Link to="/">volver al inicio</Link>.</p>
		</div>
	);
}

export default ResetPassword;