import React from 'react';
import CardStyles from './Card.module.scss';

function Card({title, imageUrl, price, onFavorite, onPlus}) {
  const [isAdded, setIsAdded] = React.useState(false);

  const onClickPlus = () => {
    onPlus({title, imageUrl, price});
    setIsAdded(!isAdded);
  }

    return (
        <div className={CardStyles.card}>
          <div className={CardStyles.favorite} onClick = {onFavorite}> 
            <img src="/img/heart-unliked.svg" alt="Unliked"/></div>
          <img width={133} height={112} src={imageUrl} alt="Sneakers"/>
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column ">
              <span>Цена:</span>
              <b> {price} руб.</b>
            </div>
            <div>
              <img 
                className={CardStyles.plus} 
                onClick={onClickPlus} 
                src={isAdded ? "/img/btn-checked.svg" : "/img/btn-plus.svg"} 
                alt="Plus"
              />
            </div>
          </div>
        </div>
    );
}
export default Card;