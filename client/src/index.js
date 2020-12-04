import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./store/store.js";
import App from './components/App/App.jsx';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<Provider store={ store }>
		<PersistGate persistor={ persistor }>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</PersistGate>
	</Provider>,
	
	document.getElementById( 'root' )
);

serviceWorker.unregister( );