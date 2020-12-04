import React, { useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUndoAlt, faCheck } from "@fortawesome/free-solid-svg-icons";
import { mediaApi, productApi } from "../../api";
import { showNotification } from "../../actions/notification";
import bsCustomFileInput from 'bs-custom-file-input';
import MediaFrame from "../MediaFrame/MediaFrame.jsx";
import Loading from "../Loading/Loading.jsx";

function OrderDetails( props )
{
	const id = parseInt( props.match.params.id );
	
	const [ loading, setLoading ] = useState( true );
	const [ media, setMedia ] = useState( [ ] );
	const [ categories, setCategories ] = useState( { available: [ ], added: [ ] } );
	const [ input, setInput ] = useState( {
		name: "",
		description: "",
		price: "",
		developer: "",
		publisher: "",
		publishDate: "",
		keys: "",
		file: "",
		type: "",
		path: ""
	} );
	
	const storeCategories = useSelector( ( state ) => state.category.categories );
	const inputFileElement = useRef( null );
	const dispatch = useDispatch( );
	const history = useHistory( );

	/* =================================================================================
	* 		[ General Handlers ]
	* ================================================================================= */
	
	const handleInputChange = ( event ) => {
		const { name } = event.target;
		const value = ( name === "file" ) ? event.target.files[ 0 ] : event.target.value;
		
		if ( name === 'file' ) {
			inputFileElement.current.labels[ 0 ].innerHTML = value.name;
		}
		
		setInput( { ...input, [ name ]: value } );
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
			description: input.description,
			price: input.price,
			stock: input.stock,
			developer: input.developer,
			publisher: input.publisher,
			publishDate: input.publishDate,
			media: media.map( ( m ) => m.id ) || [ ],
			categories: categories.added.map( ( c ) => c.id ) || [ ]
		};
		
		new Promise( ( resolve, reject ) => {
			if ( id > 0 ) {
				productApi.updateProduct( id, data )
					.then( ( response ) => resolve( response.data ) )
					.catch( ( error ) => reject( error ) );
			}
			else {
				productApi.createProduct( data )
					.then( ( response ) => resolve( response.data ) )
					.catch( ( error ) => reject( error ) );
			}
		} )
		.then( ( product ) => {
			dispatch( showNotification( `¡Producto ${ ( id > 0 ) ? 'actualizado' : 'creado' } correctamente`, "success" ) );
		} )
		.then( ( error ) => {
			dispatch( showNotification( `Ocurrió un error al intentar ${ ( id > 0 ) ? 'actualizar' : 'crear' } el producto`, "error" ) );
		} );
	};

	/* =================================================================================
	* 		[ Categories Handler ]
	* ================================================================================= */
	
	const handleCategoriesChange = ( event ) => {
		const value = parseInt( event.target.value );
		
		let category = categories.available.find( ( c ) => c.id === value );
		
		if ( category ) {
			setCategories( {
				available: categories.available.filter( ( c ) => c.id !== value ),
				added: [ ...categories.added, category ].sort( ( a, b ) => ( a.name < b.name ) ? -1 : 1 )
			} );
		}
		else {
			category = categories.added.find( ( c ) => c.id === value );
			
			setCategories( {
				available: [ ...categories.available, category ].sort( ( a, b ) => ( a.name < b.name ) ? -1 : 1 ),
				added: categories.added.filter( ( c ) => c.id !== value )
			} );
		}
		
		event.target.value = "";
	};

	/* =================================================================================
	* 		[ Media Handlers ]
	* ================================================================================= */
	
	const handleMediaDelete = ( id ) => {
		setMedia( media.filter( m => m.id !== id ) );
	};
	
	const handleMediaCreate = ( event ) => {
		event.preventDefault( );
		
		if ( !input.type || ( input.type === "none" ) )
		{
			dispatch( showNotification( "¡Debes elegir un tipo de media!", "error" ) );
			
			return;
		}
		
		if ( !input.file && !input.path )
		{
			dispatch( showNotification( "¡Debes ingresar una ruta o un achivo!", "error" ) );
			
			return;
		}
		
		addMediaToProduct( input.file, input.path );
		
		setInput( {
			...input,
			file: "",
			type: "",
			path: ""
		} );
		
		inputFileElement.current.labels[ 0 ].innerHTML = "Seleccionar un archivo";
	};

	/* =================================================================================
	* 		[ Helpers ]
	* ================================================================================= */
	
	const addMediaToProduct = ( file, url ) => {
		new Promise( ( resolve, reject ) => {
			if ( file ) {
				const formData = new FormData( );
		
				formData.append( "file", input.file );
				
				mediaApi.uploadFile( formData )
					.then( ( response ) => resolve( response.data ) )
					.catch( ( error ) => reject( error ) );
			}
			else {
				resolve( url );
			}
		} )
		.then( ( url ) => {
			return mediaApi.createMedia( input.type, url );
		} )
		.then( ( response ) => {
			setMedia( [ ...media, response.data ] );
			
			dispatch( showNotification( "¡Media añadido correctamente!", "success" ) );
		} )
		.catch( ( error ) => {
			dispatch( showNotification( "¡Ocurrió un error al intentar añadir la media!", "error" ) );
		} );
	};
	
	const loadProduct = ( ) => {
		productApi.getProductById( id )
			.then( ( response ) => {
				const resProduct = response.data;
				const resCategories = resProduct.categories.map( ( c ) => storeCategories.find( ( sc ) => sc.id === c.id ) );
				
				setMedia( resProduct.media );
				setCategories( {
					available: storeCategories.filter( ( c ) => !resCategories.find( ( rc ) => rc.id === c.id ) ),
					added: resCategories
				} );
				
				setInput( {
					name: resProduct.name,
					description: resProduct.description,
					price: resProduct.price,
					stock: resProduct.stock,
					developer: resProduct.developer,
					publisher: resProduct.publisher,
					publishDate: resProduct.publishDate.slice( 0, 10 )
				} );
				
				setLoading( false );
			} );
	};
	
	const validateInput = ( ) => {
		if ( !input.name ) {
			return "Debes ingresar un título";
		}
		
		if ( !input.description ) {
			return "Debes ingresar una descripción";
		}
		
		if ( !input.price ) {
			return "Debes ingresar un precio";
		}
		
		if ( !input.developer ) {
			return "Debes ingresar una desarrolladora";
		}
		
		if ( !input.publisher ) {
			return "Debes ingresar una publicadora";
		}
		
		if ( !input.publishDate || ( input.publishDate.length < 10 ) || ( input.publishDate[ 4 ] !== '-' ) ) {
			return "Debes ingresar una fecha de publicación";
		}
		
		const year = parseInt( input.publishDate.substring( 0, 4 ) );
		
		if ( ( isNaN( year ) ) || ( year > 2050 ) || ( year < 1980 ) ) {
			return "La fecha de publicación es inválida";
		}
		
		return null;
	}

	/* =================================================================================
	* 		[ Effects ]
	* ================================================================================= */
	
	useEffect( ( ) => {
		if ( !loading ) {
			return;
		}
		
		if ( id > 0 ) {
			if ( storeCategories && ( storeCategories.length > 0 ) ) {
				loadProduct( );
			}
		}
		else {
			setLoading( false );
		}
		
		setCategories( {
			...categories,
			available: [ ...storeCategories ]
		} );
	}, [ storeCategories, loading ] ); //eslint-disable-line
	
	useEffect( ( ) => {
		bsCustomFileInput.init( );
	}, [ ] );

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
						<Link to="/admin/products">
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
				<Row>
					<Col>
						<Form className="admin__detail-form">
							<Form.Row>
								<Form.Group as={ Col } xs={ 8 }>
									<Form.Label>Título</Form.Label>
									<Form.Control
										required
										name="name"
										type="text"
										value={ input.name }
										placeholder="Ingresa el título"
										onChange={ handleInputChange }
									/>
								</Form.Group>
								<Form.Group as={ Col }>
									<Form.Label>Precio</Form.Label>
									<Form.Control
										required
										name="price"
										type="number"
										step="0.01"
										value={ input.price }
										placeholder="Ingresa el precio (i.e. 3,99)"
										onChange={ handleInputChange }
									/>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={ Col }>
									<Form.Label>Desarrolladora</Form.Label>
									<Form.Control
										required
										name="developer"
										type="text"
										value={ input.developer }
										placeholder="Ingresa la desarrolladora"
										onChange={ handleInputChange }
									/>
								</Form.Group>
								<Form.Group as={ Col }>
									<Form.Label>Publicadora</Form.Label>
									<Form.Control
										required
										name="publisher"
										type="text"
										value={ input.publisher }
										placeholder="Ingresa la publicadora"
										onChange={ handleInputChange }
									/>
								</Form.Group>
								<Form.Group as={ Col }>
									<Form.Label>Fecha de publicación</Form.Label>
									<Form.Control
										required
										name="publishDate"
										type="date"
										value={ input.publishDate }
										onChange={ handleInputChange }
									/>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={ Col }>
									<Form.Label>Descripción</Form.Label>
									<Form.Control
										required
										name="description"
										as="textarea"
										rows={ 4 }
										value={ input.description }
										placeholder="Ingresa la descripción"
										onChange={ handleInputChange }
									/>
								</Form.Group>
							</Form.Row>
						</Form>
					</Col>
				</Row>
				<Row className="admin__product-categories">
					<Col className="admin__product-categories--available">
						<p>Categorías disponibles <span className="text-muted">(clic para añadir)</span></p>
						<select multiple onChange={ handleCategoriesChange }>
						{
							categories.available.map( ( c, i ) => (
								<option key={ i } value={ c.id }>{ c.name }</option>
							) )
						}
						</select>
					</Col>
					<Col className="admin__product-categories--added">
						<p>Categorías añadidas <span className="text-muted">(clic para quitar)</span></p>
						<select multiple onChange={ handleCategoriesChange }>
						{
							categories.added.map( ( c, i ) => (
								<option key={ i } value={ c.id }>{ c.name }</option>
							) )
						}
						</select>
					</Col>
				</Row>
				<Row className="admin__product-media">
					<Col xs={ 6 }>
						<p>Añadir media</p>
						<Form className="admin__product-media--form" onSubmit={ handleMediaCreate }>
							<Form.Group>
								<Form.Control 
									name="path"
									type="text"
									value={ input.path }
									placeholder="Ingresar una URL de archivo (i.e. imgur)"
									disabled={ input.file ? true : null }
									onChange={ handleInputChange }
								/>
							</Form.Group>
							<Form.Group>
								<Form.File 
									custom
									ref={ inputFileElement }
									id="custom-file"
									name="file"
									label="Seleccionar un archivo"
									disabled={ input.path ? true : null }
									data-browse="Buscar media"
									onChange={ handleInputChange }
								/>
							</Form.Group>
							<Form.Row>
								<Form.Group as={ Col }>
									<Form.Control
										as="select"
										name="type"
										value={ input.type }
										onChange={ handleInputChange }
										custom
									>
										<option value="none">Seleccionar un tipo</option>
										<option value="portrait">Portada</option>
										<option value="image-small">Imagen chica</option>
										<option value="video-small">Video chico</option>
										<option value="image-big">Imagen grande</option>
										<option value="video-big">Video grande</option>
									</Form.Control>
								</Form.Group>
								<Form.Group as={ Col }>
									<Button type="submit" className="admin__product-media--form__submit">
										Agregar
									</Button>
								</Form.Group>
							</Form.Row>
						</Form>
					</Col>
					<Col xs={ 6 }>
						<p>Media añadida</p>
						<div className="admin__product-media--frames">
						{
							media.map( ( m, i ) => (
								<Col xs={ 12 } sm={ 6 }>
									<MediaFrame key={ i } media={ m } onDelete={ handleMediaDelete }/>
								</Col>
							) )
						}
						</div>
					</Col>
				</Row>
				<Row className="admin__product-keys">
					<Col>
						<Form className="admin__detail-form">
							<Form.Group>
								<Form.Label>Llaves</Form.Label>
								<Form.Control
									required
									name="keys"
									as="textarea"
									rows={ 4 }
									value={ input.keys }
									placeholder="Ingresa las llaves del producto (una por cada línea)"
									onChange={ handleInputChange }
								/>
							</Form.Group>
						</Form>
					</Col>
				</Row>
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

export default OrderDetails;