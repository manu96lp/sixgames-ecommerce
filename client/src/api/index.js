import axios from 'axios';
import * as authApi from './auth';
import * as cartApi from './cart';
import * as categoryApi from './category';
import * as mediaApi from './media';
import * as productApi from './product';
import * as orderApi from './order';

const baseApi = axios.create( {
	withCredentials: true,
	baseURL: process.env.REACT_APP_API_URL
} );

export {
	baseApi,
	authApi,
	cartApi,
	categoryApi,
	mediaApi,
	productApi,
	orderApi
}