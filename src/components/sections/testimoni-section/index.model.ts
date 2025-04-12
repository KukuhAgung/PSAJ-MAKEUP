import { IPagination } from "@/lib/index.model";
import { User } from "@prisma/client";

export interface CarouselActionProps {
  activeIndex: number;
}

export interface IReviews {
  id: number;
  userId: number;
  category: string;
  stars: number;
  comment: string;
  createdAt: string;
  user: User;
}

export interface IReviewsApiResponse {
  pagination: IPagination;
  reviews: IReviews[];
  averageRating: number;
  totalCount: number;
}

export interface ITestimoniCarouselProps {
  items: IReviews[];
}

export interface ITestimoniCardProps {
  item: IReviews;
}
