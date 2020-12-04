import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button } from "react-bootstrap";
import { login } from "../../actions/auth";
import { isValidPassword, isValidEmail } from "../../utils";
import { ReactComponent as Logo } from "../../assets/logo-full.svg";

function Login( )
{
	const [ error, setError ] = useState( "" );
	const [ input, setInput ] = useState( {
		email: "",
		password: ""
	} );
	
	const firstRender = useRef( true );
	const isLogged = useSelector( ( state ) => state.auth.isLogged );
	const dispatch = useDispatch( );
	const history = useHistory( );

	const handleInputChange = ( event ) => {
		setInput( {
			...input,
			[ event.target.name ]: event.target.value
		} );
	};
	
	const handleRedirectOnSuccess = ( ) => {
		setTimeout( ( ) => {
			history.push( "/products" );
		}, 1500 );
	}

	const handleSubmit = ( event ) => {
		event.preventDefault( );

		const { email, password } = input;

		if ( !isValidEmail( email ) ) {
			setError( "Correo electrónico inválido" );

			return;
		}

		if ( !isValidPassword( password ) ) {
			setError( "Clave inválida (mínimo cuatro caracteres)" );

			return;
		}

		dispatch( login( email, password, handleRedirectOnSuccess ) );
	};
	
	if ( firstRender.current ) {
		firstRender.current = false;
		
		if ( isLogged ) {
			return renderAlreadyLogged( );
		}
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
					
					<Form.Group>
						<Form.Control
							required
							minlength={ 4 }
							name="password"
							type="password"
							value={ input.password }
							placeholder="Ingresa tu clave"
							onChange={ handleInputChange }
						/>
					</Form.Group>
					<Button type="submit" className="auth-modal__button">
						Iniciar sesión ahora
					</Button>
				</Form>
				
				<div className="auth-modal__links">
					<p>¿Has olvidado tu clave? <Link to="/auth/forgot">Recupérala</Link></p>
					<p>¿No tienes una cuenta? <Link to="/auth/signup">Crea una cuenta</Link></p>
					<p>Volver a <Link to="/auth/select">todas las opciones de inicio de sesión</Link></p>
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