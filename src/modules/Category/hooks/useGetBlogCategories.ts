import { useQuery } from '@tanstack/react-query';
import api from '@src/api/api';
import { BlogCategoryResponse } from '../models';
import { GET_BLOG_CATEGORIES } from '../constants';

const fetchBlogCategories = async (
  currentPage?: number,
  pageSize?: number
): Promise<BlogCategoryResponse> => {
  try {
    let response: any = null;
    if (currentPage !== undefined && pageSize !== undefined)
      response = await api.getByQueryParams('/blog-categories', {
        currentPage,
        pageSize,
      });
    else response = await api.get('/blog-categories');

    const data = response.data as BlogCategoryResponse;

    const PaginationResponse: BlogCategoryResponse = {
      totalCount: data.totalCount ?? 0,
      pageSize: data.pageSize,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      results: data.results,
    };
    return PaginationResponse;
  } catch (error) {
    throw new Error('Error fetching blog categories');
  }
};

export function useGetBlogCategories(
  PageNumber: number = 1,
  PageSize: number = 10
) {
  return useQuery<BlogCategoryResponse>({
    queryKey: [GET_BLOG_CATEGORIES, PageNumber, PageSize],
    queryFn: () => fetchBlogCategories(PageNumber, PageSize),
    refetchInterval: 3000,
  });
}

export function useGetAllBlogCategories() {
  return useQuery<BlogCategoryResponse>({
    queryKey: [GET_BLOG_CATEGORIES],
    queryFn: () => fetchBlogCategories(),
    refetchInterval: 3000,
  });
}
