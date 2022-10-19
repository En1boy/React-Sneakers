import React from 'react';
import axios from 'axios';
import Card from './components/Card';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);

  React.useEffect(() => {
    axios.get('https://634934c9a59874146b19fe11.mockapi.io/items').then((res) => {    //получение карточек с бэка (items)
      setItems(res.data);
    });
    axios.get('https://634934c9a59874146b19fe11.mockapi.io/cart').then((res) => {     //получение данных(cart) с бэка в корзину
      setCartItems(res.data);
    });
  }, []);

  const onAddToCart = (obj) => {
    axios.post('https://634934c9a59874146b19fe11.mockapi.io/cart', obj);  //занесение данных в бэкенд в корзину
    setCartItems(prev => [...prev, obj]);
  };

  const onRemoveItem = (id) => {
    axios.delete(`https://634934c9a59874146b19fe11.mockapi.io/cart/${id}`);  //удаление данных в бэкенд в корзине
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const onAddToFavorite = (obj) => {
    axios.post('https://634934c9a59874146b19fe11.mockapi.io/favorite', obj);  //занесение данных в бэкенд в закладки
    setFavorites(prev => [...prev, obj]);
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };
  

  return (
    <div className="wrapper clear">
      {cartOpened && <Sidebar items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />}
      <Header onClickCart = {() => setCartOpened(true)} />
      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
          <div className="search-block d-flex">
            <img src="/img/search.svg" alt="Search"/>
            {searchValue && (
              <img
                onClick={() => setSearchValue('')} 
                className="clear cu-p"
                src="/img/btn-remove.svg" 
                alt="Clear"/>)}
            <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..."/>
          </div>
        </div>
        
        <div className="d-flex flex-wrap">
          {items.filter(item => item.title.toLowerCase().includes(searchValue)).map((item) => (
            <Card
              key={item.imageUrl}
              title={item.title}
              price={item.price}
              imageUrl={item.imageUrl}
              onFavorite={(obj) => onAddToFavorite(obj)}
              onPlus={(obj) => onAddToCart(obj)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
