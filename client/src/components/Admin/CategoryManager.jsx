import React, { useState, useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { deleteCategory } from "../../actions/category";
import { showNotification } from "../../actions/notification";
import qs from 'query-string';
import Loading from "../Loading/Loading.jsx";

const _SELECTABLE_LIMITS = [ 5, 10, 20 ];

function CategoryManager( props )
{
	const [ count, setCount ] = useState( 0 );
	const [ categories, setCategories ] = useState( [ ] );
	const [ loading, setLoading ] = useState( false );
	const [ queryParams, setQueryParams ] = useState( {
		query: '',
		limit: 5,
		page: 0
	} );
	
	const storeCategories = useSelector( ( state ) => state.category.categories );
	
	const timeout = useRef( { last: null, delay: 0 } );
	const firstRender = useRef( true );
	const location = useLocation( );
	const history = useHistory( );
	const dispatch = useDispatch( );
	
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
		
		if ( value === queryParams.limit ) {
			return;
		}
		
		setQueryParams( {
			...queryParams,
			page: 0,
			limit: value
		} );
	};
	
	const handlePaginationClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		if ( value === queryParams.page ) {
			return;
		}
		
		setQueryParams( {
			...queryParams,
			page: value
		} );
	};
	
	const handleEditClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		history.push( `/admin/categories/${ value }`, { search: location.search } );
	};
	
	const handleDeleteClick = ( event ) => {
		const value = parseInt( event.target.value );
		
		dispatch( deleteCategory( value ) );
	};
	
	useEffect( ( ) => {
		if ( !firstRender.current ) {
			setLoading( true );
		}
	}, [ storeCategories ] );
	
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
		
		history.push( `/admin/categories?${ query }` );
		
		setLoading( true );
	}, [ queryParams ] );
	
	useEffect( ( ) => {
		if ( !loading ) {
			return;
		}
		
		const filteredCats = storeCategories.filter( ( category ) => category.name.toUpperCase( ).includes( queryParams.query.toUpperCase( ) ) );
		const slicedCats = filteredCats.slice( ( queryParams.page * queryParams.limit ), ( queryParams.page * queryParams.limit ) + queryParams.limit );
		
		setCount( filteredCats.length );
		setCategories( slicedCats );
		
		setLoading( false );
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
						<Link to={ { pathname: "/admin/categories/0", state: location.search } }>
							<button>
								<FontAwesomeIcon icon={ faPlus } /> Añadir una categoría
							</button>
						</Link>
					</Col>
				</Row>
				<Row>
				{
					loading ? <Loading /> : ( categories.length <= 0 ) ?
					
					<Col className="admin__page-panel--no-results">
						<div>
							<h2>No se encontraron resultados</h2>
							<p>Prueba a realizar una búsqueda distinta</p>
						</div>
					</Col> :
					<Col className="admin__page-panel--list">
						<div className="admin__list-item admin__list-header">
							<p style={ { width: "75%", textAlign: "left" } }>Título</p>
							<p style={ { width: "25%", textAlign: "right", paddingRight: "3.75rem" } }>Opciones</p>
						</div>
						
						{
							categories.map( ( c, i ) => (
								<div className="admin__list-item" key={ i }>
									<p style={ { width: "75%", textAlign: "left" } }>{ c.name }</p>
									<div style={ { width: "25%", textAlign: "right" } }>
										<button className="admin__edit-button" value={ c.id } onClick={ handleEditClick }>
											<FontAwesomeIcon icon={ faEdit } /> Editar
										</button>
										<button className="admin__delete-button" value={ c.id } onClick={ handleDeleteClick }>
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

export default CategoryManager;