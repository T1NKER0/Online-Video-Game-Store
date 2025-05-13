import React from 'react';

type GameCardProps = {
  title: string;
  description: string;
  price: number;
  developer: string;
  imageUrl: string;
};

const GameCard: React.FC<GameCardProps> = ({ title, description, price, developer, imageUrl }) => {
  return (
    <div className="game-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <p>Developer: {developer}</p>
      <p>Price: ${price}</p>
    </div>
  );
};

export default GameCard;
