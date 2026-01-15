import { useRouter } from "next/router";
import BlogsPage from "./index";

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;

  return <BlogsPage categoryParam={category} />;
};

export default CategoryPage;
