import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './component.module.css';

type BreadCrumbItem = {
    name: string;
    slug?: string;
    isCurrent?: boolean;
};

type BreadCrumbProps = {
    items: BreadCrumbItem[];
};

const BreadCrumb: React.FC<BreadCrumbProps> = ({ items }) => {
    return (
        <nav className={styles.breadcrumb}>
            {items.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={styles.breadcrumbItem}
                >
                    {item.slug ? (
                        <Link href={``}>
                             {item.name}
                        </Link>
                    ) : (
                        <span className={item.isCurrent ? styles.current : ''}>
                            {item.name}
                        </span>
                    )}
                    {index < items.length - 1 && <span className={styles.separator}>/</span>}
                </motion.div>
            ))}
        </nav>
    );
};

export default BreadCrumb;
