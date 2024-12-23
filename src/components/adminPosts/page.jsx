"use client";
import React, { useEffect, useState } from "react";
import styles from "./adminPosts.module.css";
import Image from "next/image";
import { deletePost } from "@/lib/action";
import Pagination from "../pagination/Pagination";
import { useRouter } from "next/navigation";

const getData = async (page) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blog?page=${page}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Something went wrong!");
  }
  return res.json();
};

const AdminPosts = ({ searchParams }) => {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const pageNum = parseInt(searchParams?.page) || 1;
      console.log("Page Number:", pageNum);

      try {
        const { posts, count } = await getData(pageNum);
        console.log("Fetched Data:", posts, count);

        setPosts(posts);
        setCount(count);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [searchParams?.page]);

  const POST_PER_PAGE = 6;
  const hasPrev = POST_PER_PAGE * (page - 1) > 0;
  const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

  const handleNextClick = () => {
    if (hasNext) {
      const nextPage = page + 1;
      console.log("Next Page:", nextPage);
      router.push(`/admin/blog?page=${nextPage}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div className={styles.post} key={post.id}>
          <div className={styles.detail}>
            <Image
              src={post.img || "/noAvatar.png"}
              alt=""
              width={50}
              height={50}
            />
            <span className={styles.postTitle}>{post.title}</span>
          </div>
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button className={styles.postButton}>Delete</button>
          </form>
        </div>
      ))}
      <Pagination
        page={page}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onNextClick={handleNextClick}
      />
    </div>
  );
};

export default AdminPosts;
