"use client";
import { useParams } from "next/navigation";

const blogListId = () => {
  const params = useParams();
  const id = params.id;
  return (
    <>
      <h1>hello</h1>
      <p>{id}</p>
    </>
  );
};

export default blogListId;
