import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form, Button } from "react-bootstrap";
import { signUp } from "../../actions/auth";
import { isValidPassword, isValidEmail } from "../../utils";
import { ReactComponent as Logo } from "../../assets/logo-full.svg";

function SignUp( )
{
	const [ error, setError ] = useState( "" );
	const [ input, setInput ] = useState( {
		firstName: "",
		lastName: "",
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
			history.push( "/product" );
		}, 1500 );
	}

	const handleSubmit = ( event ) => {
		event.preventDefault( );

		const { firstName, lastName, email, password } = input;

		if ( ( firstName < 2 ) || ( lastName < 2 ) ) {
			setError( "Nombre y/o apellido muy corto" );

			return;
		}

		if ( !isValidEmail( email ) ) {
			setError( "Correo electrónico inválido" );

			return;
		}

		if ( !isValidPassword( password ) ) {
			setError( "Clave inválida (mínimo cuatro caracteres)" );

			return;
		}
		
		dispatch( signUp( firstName, lastName, email, password, handleRedirectOnSuccess ) );
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
							minlength={ 2 }
							name="firstName"
							type="text"
							value={ input.firstName }
							placeholder="Ingresa tu nombre"
							onChange={ handleInputChange }
						/>
					</Form.Group>
					<Form.Group>
						<Form.Control
							required
							minlength={ 2 }
							name="lastName"
							type="text"
							value={ input.lastName }
							placeholder="Ingresa tu apellido"
							onChange={ handleInputChange }
						/>
					</Form.Group>
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
						Crear cuenta ahora
					</Button>
				</Form>
				<div className="auth-modal__links">
					<p>¿Ya tienes una cuenta? <Link to="/auth/select">Iniciar sesión</Link></p>
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
			<h2>No puedes crear una cuenta estando autenticado</h2>
			<p>Si quieres puedes <Link to="/">volver al inicio</Link>.</p>
		</div>
	);
}

export default SignUp;