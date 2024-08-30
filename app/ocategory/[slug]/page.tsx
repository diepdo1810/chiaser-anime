import React from 'react';
import MangaList from './components/MangaList'; // Update with correct path
import styles from './page.module.css'

interface PageProps {
  params: {
    slug: string;
    page?: number;
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { slug, page } = params;

  return (
    <main id={styles.container}>
      <MangaList slug={slug} page={page ? Number(page) : 1} />
    </main> 
  );
};

export default Page;
