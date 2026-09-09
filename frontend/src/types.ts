export interface Beer {
  id: string;
  name: string;
  style: string;
  abv: number;
  ibu: number | null;
  description: string;
  imageUrl: string | null;
  price: string;
  stock: number;
  active: boolean;
}
