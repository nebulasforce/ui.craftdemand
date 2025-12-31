"use client"
import dynamic from 'next/dynamic';

const ServerError = dynamic(
  () => import('@/components/ServerError/ServerError').then((mod) => ({ default: mod.ServerError })),
  {
    ssr: false,
  }
);

export default function Error(){
  return (
    <ServerError />
  );
}
