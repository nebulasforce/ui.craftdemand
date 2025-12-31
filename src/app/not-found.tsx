"use client"
import dynamic from 'next/dynamic';

const NotFoundImage = dynamic(
  () => import('@/components/NotFoundImage/NotFoundImage').then((mod) => ({ default: mod.NotFoundImage })),
  {
    ssr: false,
  }
);

export default function NotFound(){
  return (
    <NotFoundImage />
  );
}
