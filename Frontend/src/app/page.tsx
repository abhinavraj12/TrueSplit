import Link from 'next/link'
import React from 'react'
import styles from './page.module.css'

const Page = () => {
  return (
    <div className={styles.container}>
      <Link href={'/testing/avatar'} className={styles.link}>
        Avatar
      </Link>
      <Link href={'/testing/badge'} className={styles.link}>
        Badge
      </Link>
      <Link href={'/testing/button'} className={styles.link}>
        Button
      </Link>
      <Link href={'/testing/checkbox'} className={styles.link}>
        Checkbox
      </Link>
      <Link href={'/testing/icon'} className={styles.link}>
        Icon
      </Link>
      <Link href={'/testing/input'} className={styles.link}>
        Input
      </Link>
      <Link href={'/testing/radio'} className={styles.link}>
        Radio
      </Link>
      <Link href={'/testing/skeleton'} className={styles.link}>
        Skeleton
      </Link>
      <Link href={'/testing/typography'} className={styles.link}>
        Typography
      </Link>
      <Link href={'/testing/spinner'} className={styles.link}>
        Spinner
      </Link>
      <Link href={'/testing/switch'} className={styles.link}>
        Switch
      </Link>
      <Link href={'/testing/textarea'} className={styles.link}>
        Textarea
      </Link>
      <Link href={'/testing/tooltip'} className={styles.link}>
        Tooltip
      </Link>
    </div>
  )
}

export default Page