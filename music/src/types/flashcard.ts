export interface Deck {
  id: string;
  title: string;
  imageUrl: string;
  cards: Card[];
}

export interface Card {
  id: string;
  question: string;
  answer: string;
  imageUrl: string;
}