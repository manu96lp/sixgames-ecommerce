import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { orderApi } from "../../api";
import { showNotification } from "../../actions/notification";
import qs from 'query-string';
import Loading from "../Loading/Loading.jsx";

const _SELECTABLE_LIMITS = [ 5, 10, 20 ];

function OrderManager( )
{
	const [ loading, setLoading ] = useState( false );
	const [ count, setCount ] = useState( 0 );
	const [ orders, setOrders ] = useState( [ ] );
	const [ queryParams, setQueryParams ] = useState( {
		query: '',
		type: '',
		limit: 5,
		page: 0
	} );
	
	const timeout = useRef( { last: null, delay: 0 } );
	const firstRender = useRef( true );
	
	const dispatch = useDispatch( );
	
	const history = useHistory( );
	const location = useLocation( );
		
	const handleQueryInput = ( event ) => {
		const { value } = event.target;
		
		setQueryParams( {
			...queryParams,
			query: value
		} );
		
		timeout.current.delay = 500;
	};
	
	const handleLimitClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		setQueryParams( {
			...queryParams,
			page: 0,
			limit: value
		} );
	};
	
	const handlePaginationClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		setQueryParams( {
			...queryParams,
			page: value
		} );
	};
	
	const handleTypeChange = ( event ) => {
		const value = parseInt( event.target.value );
		
		setQueryParams( {
			...queryParams,
			type: value
		} );
	};
	
	const handleEditClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		history.push( `/admin/orders/${ value }`, { search: location.search } );
	};
	
	const handleDeleteClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		orderApi.deleteOrderById( value )
			.then( ( response ) => {
				setOrders( orders.filter( ( o ) => o.id !== value ) );
				setCount( count - 1 );
				
				setLoading( true );
				
				dispatch( showNotification( "¡Orden eliminada correctamente!", "success" ) );
			} )
			.catch( ( error ) => {
				dispatch( showNotification( "¡Ocurrió un error al intentar eliminar la orden!", "error" ) );
			} );
	};
	
	useEffect( ( ) => {
		if ( firstRender.current ) {
			const params = qs.parse( location.search, { parseNumbers: true } );
			
			setQueryParams( {
				...queryParams, ...params
			} );
			
			firstRender.current = false;
			
			return;
		}
		
		const query = qs.stringify( queryParams );
		
		history.push( `/admin/orders?${ query }` );
		
		if ( !timeout.current.delay ) {
			setLoading( true );
			
			return;
		}
		
		if ( timeout.current.last ) {
			clearTimeout( timeout.current.last );
		}
		
		timeout.current.last = setTimeout( ( ) => {
			setLoading( true );
		}, timeout.current.delay );
		
		timeout.current.delay = 0;
	}, [ queryParams ] );
	
	useEffect( ( ) => {
		if ( !loading ) {
			return;
		}
		
		productApi.getAllProducts( location.search )
			.then( ( response ) => {
				setCount( response.data.count );
				setProducts( response.data.rows );
				
				setLoading( false );
			} );
	}, [ loading ] );
	
	return (
		<div className="admin__page-wrapper">
			<div className="admin__page-panel">
				<Row>
					<Col className="admin__page-panel--search">
						<input type="text" value={ queryParams.query } onChange={ handleQueryInput } />
						<FontAwesomeIcon icon={ faSearch } />
					</Col>
					<Col className="admin__page-panel--action">
						<Link to={ { pathname: "/admin/orders/0", state: location.search } }>
							<button>
								<FontAwesomeIcon icon={ faPlus } /> Añadir un producto
							</button>
						</Link>
					</Col>
				</Row>
				<Row>
				{
					loading ? <Loading /> : ( count <= 0 ) ?
					
					<Col className="admin__page-panel--no-results">
						<div>
							<h2>No se encontraron resultados</h2>
							<p>Prueba a realizar una búsqueda distinta</p>
						</div>
					</Col> :
					<Col className="admin__page-panel--list">
						<div className="admin__list-item admin__list-header">
							<p style={ { width: "40%", textAlign: "left" } }>Título</p>
							<p style={ { width: "20%" } }>Precio</p>
							<p style={ { width: "15%" } }>Stock</p>
							<p style={ { width: "25%", textAlign: "right", paddingRight: "3.75rem" } }>Opciones</p>
						</div>
						
						{
							products.map( ( p, i ) => (
								<div className="admin__list-item" key={ i }>
									<p style={ { width: "40%", textAlign: "left" } }>{ p.name }</p>
									<p style={ { width: "20%" } }>{ p.price } US$</p>
									<p style={ { width: "15%" } }>{ p.stock }</p>
									<div style={ { width: "25%", textAlign: "right" } }>
										<button className="admin__edit-button" value={ p.id } onClick={ handleEditClick }>
											<FontAwesomeIcon icon={ faEdit } /> Editar
										</button>
										<button className="admin__delete-button" value={ p.id } onClick={ handleDeleteClick }>
											<FontAwesomeIcon icon={ faTrashAlt } /> Borrar
										</button>
									</div>
								</div>
							) )
						}
					</Col>
				}
				</Row>
				<Row>
					<Col className="admin__page-panel--limit">
						<div className="admin__limit">
						{
							_SELECTABLE_LIMITS.map( ( v, i ) => (
								<button
									key={ i }
									className={ ( queryParams.limit === v ) ? "active" : null }
									value={ v }
									onClick={ handleLimitClick }
								>
									{ v }
								</button>
							) )
						}
						</div>
					</Col>
					<Col className="admin__page-panel--pagination">
						<div className="admin__pagination">
							<button
								value={ queryParams.page - 1 }
								onClick={ handlePaginationClick }
								disabled={ queryParams.page <= 0 }
							>
								Anterior
							</button>
							<button className="current">
								{ queryParams.page + 1 }
							</button>
							<button
								value={ queryParams.page + 1 }
								onClick={ handlePaginationClick }
								disabled={ ( ( queryParams.page + 1 ) * queryParams.limit ) >= count }
							>
								Siguiente
							</button>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default OrderManager;