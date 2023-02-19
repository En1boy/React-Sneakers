import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AppContext from './context';
import Orders from './pages/Orders';

function App() {
	const [items, setItems] = React.useState([]);
	const [cartItems, setCartItems] = React.useState([]);
	const [favorites, setFavorites] = React.useState([]);
	const [searchValue, setSearchValue] = React.useState('');
	const [cartOpened, setCartOpened] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		async function fetchData() {
			const cartResponse = await axios.get(
				'https://63ea096b811db3d7ef052b32.mockapi.io/cart',
			);
			const favoritesResponse = await axios.get(
				'https://634934c9a59874146b19fe11.mockapi.io/favorite',
			);
			const itemsResponse = await axios.get(
				'https://634934c9a59874146b19fe11.mockapi.io/items',
			);

			setIsLoading(false); //состояние карточек при загрузке данных(react skeleton)

			setCartItems(cartResponse.data);
			setFavorites(favoritesResponse.data);
			setItems(itemsResponse.data);
		}

		fetchData();
	}, []);

	const onAddToCart = (obj) => {
		if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
			axios.delete(
				`https://63ea096b811db3d7ef052b32.mockapi.io/cart/${obj.id}`,
			);
			setCartItems((prev) =>
				prev.filter((item) => Number(item.id) !== Number(obj.id)),
			);
		} else {
			axios.post('https://63ea096b811db3d7ef052b32.mockapi.io/cart', obj);
			setCartItems((prev) => [...prev, obj]);
		}
	};

	const onRemoveItem = (id) => {
		axios.delete(`https://63ea096b811db3d7ef052b32.mockapi.io/cart/${id}`); //удаление данных в бэкенд в корзине
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	};

	const onAddToFavorite = async (obj) => {
		try {
			if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
				axios.delete(
					`https://634934c9a59874146b19fe11.mockapi.io/favorite/${obj.id}`,
				);
				setFavorites((prev) =>
					prev.filter((item) => Number(item.id) !== Number(obj.id)),
				);
			} else {
				const { data } = await axios.post(
					'https://634934c9a59874146b19fe11.mockapi.io/favorite',
					obj,
				); //занесение данных в бэкенд в закладки
				setFavorites((prev) => [...prev, data]);
			}
		} catch (error) {
			alert('Не удалось добавить в закладки');
		}
	};

	const onChangeSearchInput = (event) => {
		setSearchValue(event.target.value);
	};

	const isItemAdded = (id) => {
		return cartItems.some((obj) => Number(obj.id) === Number(id));
	};

	return (
		<AppContext.Provider
			value={{
				cartItems,
				favorites,
				items,
				isItemAdded,
				onAddToCart,
				onAddToFavorite,
				setCartOpened,
				setCartItems,
			}}>
			<div className='wrapper clear'>
				<Sidebar
					items={cartItems}
					onClose={() => setCartOpened(false)}
					onRemove={onRemoveItem}
					opened={cartOpened}
				/>
				<Header onClickCart={() => setCartOpened(true)} />

				<Route path='/' exact>
					<Home
						items={items}
						cartItems={cartItems}
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						onChangeSearchInput={onChangeSearchInput}
						onAddToFavorite={onAddToFavorite}
						onAddToCart={onAddToCart}
						isLoading={isLoading}
					/>
				</Route>

				<Route path='/favorites' exact>
					<Favorites />
				</Route>

				<Route path='/orders' exact>
					<Orders />
				</Route>
			</div>
		</AppContext.Provider>
	);
}

export default App;
