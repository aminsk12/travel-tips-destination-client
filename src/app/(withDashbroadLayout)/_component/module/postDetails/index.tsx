"use client";

import React from "react";
import PostActions from "../posts/postActions/postActions";
import { useGetSinglePostQuery } from "@/src/redux/features/post/postApi";
import PostDetailsHeader from "./postDetailsHeader";
import PostDetailsContent from "./postDetailsContent";
import DetailsCommentCard from "../posts/postActions/postComments/detailsCommentCard";
import PostImages from "./postImages";
import PostDetailsSkeleton from "@/src/components/ui/skeleton/postDetailsSkeleton";

interface TPostDetailsProps {
  postId: string;
}

export default function PostDetails({ postId }: TPostDetailsProps) {
  const { data: postData, isError, isLoading } = useGetSinglePostQuery(postId);

  // Handle loading state
  if (isLoading) {
    return <PostDetailsSkeleton />;
  }

  // Handle error state
  if (isError) {
    return (
      <p className="text-red-500">An error occurred while loading the post.</p>
    );
  }

  const post = postData?.data;

  return (
    <div className="w-full md:w-[500px] xl:w-[600px] mx-auto bg-default-50 rounded-md p-2 md:p-6">
      <PostDetailsHeader post={post} />
      <PostDetailsContent post={post} />
      {post?.images?.length > 0 && <PostImages post={post} />}
      <PostActions post={post} />
      <DetailsCommentCard postId={post?._id} />
    </div>
  );
}
