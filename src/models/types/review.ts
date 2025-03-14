export interface Review {
  id?:number;
  productId:number;
  userName:string;
  reviewBody:string;
  image:string;
  createdAt:number;
}