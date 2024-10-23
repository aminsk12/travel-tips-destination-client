"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "Exploring the Beauty of Nature",
    description:
      "Discover the hidden gems of nature and learn how to enjoy the great outdoors.",
    image: "https://example.com/image1.jpg", // Replace with a real image URL
  },
  {
    id: 2,
    title: "Culinary Adventures: A Taste of Travel",
    description:
      "Join us on a journey through the flavors of the world and the stories behind them.",
    image: "https://example.com/image2.jpg", // Replace with a real image URL
  },
  {
    id: 3,
    title: "Travel Tips for Your Next Adventure",
    description:
      "Get insider tips on how to make the most of your travels and avoid common pitfalls.",
    image: "https://example.com/image3.jpg", // Replace with a real image URL
  },
];

export default function Blog() {
  return (
    <div className="p-5 min-h-screen mt-10">
      <motion.h1
        className="text-3xl font-bold text-center text-default-700 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Our Travel Blog
      </motion.h1>

      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            className="bg-default-50 bg-opacity-15 rounded-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-pink-600 mb-2">
                {post.title}
              </h2>
              <p className="text-default-700 mb-3">{post.description}</p>
              <Link
                className="text-pink-500 hover:underline"
                href={`/blog/${post.id}`}
              >
                Read More
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
