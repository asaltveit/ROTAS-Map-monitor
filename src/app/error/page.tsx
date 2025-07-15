'use client'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Page",
  description: "Something has gone wrong!",
};

export default function ErrorPage() {
  return <p>Sorry, something went wrong</p>
}