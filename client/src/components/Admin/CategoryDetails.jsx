import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUndoAlt, faCheck } from "@fortawesome/free-solid-svg-icons";
import { addCategory, modifyCategory } from "../../actions/category";
import { showNotification } from "../../actions/notification";
import Loading from "../Loading/Loading.jsx";

function CategoryDetails( props )
{
	const id = parseInt( props.match.params.id );
	
	const [ loading, setLoading ] = useState( true );
	const [ input, setInput ] = useState( {
		name: "",
		description: ""
	} );
	
	const storeCategories = useSelector( ( state ) => state.category.categories );
	
	const dispatch = useDispatch( );
	const history = useHistory( );

	/* =================================================================================
	* 		[ General Handlers ]
	* ================================================================================= */
	
	const handleInputChange = ( event ) => {
		const { name, value } = event.target;
		
		setInput( {
			...input, [ name ]: value
		} );
	};
	
	const handleResetClick = ( event ) => {
		event.preventDefault( );
		
		history.go( 0 );
	}

	const handleConfirmChanges = ( event ) => {
		event.preventDefault( );
		
		const error = validateInput( );
		
		if ( error ) {
			dispatch( showNotification( error, "error" ) );
			
			return;
		}
		
		const data = {
			name: input.name,
			description: input.description
		};
		
		( id > 0 ) ?
			dispatch( modifyCategory( id, data.name, data.description ) ) :
			dispatch( addCategory( data.name, data.description ) );
	};

	/* =================================================================================
	* 		[ Helpers ]
	* ================================================================================= */
	
	const validateInput = ( ) => {
		if ( !input.name ) {
			return "Debes ingresar un título";
		}
		
		if ( !input.description ) {
			return "Debes ingresar una descripción";
		}
		
		return null;
	}

	/* =================================================================================
	* 		[ Effects ]
	* ================================================================================= */
	
	useEffect( ( ) => {
		if ( id <= 0 ) {
			setLoading( false );
			
			return;
		}
		
		if ( !storeCategories || ( storeCategories.length === 0 ) ) {
			return;
		}
		
		const category = storeCategories.find( ( c ) => c.id === id );
		
		setInput( {
			name: category.name,
			description: category.description
		} );
		
		setLoading( false );
	}, [ storeCategories ] ); //eslint-disable-line

	/* =================================================================================
	* 		[ Render ]
	* ================================================================================= */
	
	if ( loading ) {
		return (
			<div className="admin__page-wrapper">
				<div className="admin__page-panel">
					<Loading />
				</div>
			</div>
		);
	}
	
	return (
		<div className="admin__page-wrapper">
			<div className="admin__page-panel">
				<Row className="admin__detail-header">
					<Col className="admin__detail-button admin__detail-back">
						<Link to="/admin/categories">
							<button>
								<FontAwesomeIcon icon={ faArrowLeft } /> Volver atrás
							</button>
						</Link>
					</Col>
					<Col className="admin__detail-button admin__detail-reset">
						<button onClick={ handleResetClick }>
							<FontAwesomeIcon icon={ faUndoAlt } /> Reiniciar valores
						</button>
					</Col>
				</Row>
				<Form className="admin__detail-form">
					<Form.Group as={ Col } xs={ 12 }>
						<Form.Label>Nombre</Form.Label>
						<Form.Control
							required
							name="name"
							type="text"
							value={ input.name }
							placeholder="Ingresa el nombre"
							onChange={ handleInputChange }
						/>
					</Form.Group>
					<Form.Group as={ Col } xs={ 12 }>
						<Form.Label>Descripción</Form.Label>
						<Form.Control
							required
							name="description"
							type="text"
							value={ input.description }
							placeholder="Ingresa la descripción"
							onChange={ handleInputChange }
						/>
					</Form.Group>
				</Form>
				<Row className="admin__detail-footer">
					<Col className="admin__detail-button admin__detail-confirm">
						<button onClick={ handleConfirmChanges }>
							<FontAwesomeIcon icon={ faCheck } /> Confirmar
						</button>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default CategoryDetails;