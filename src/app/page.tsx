import styles from "./page.module.css";
import { Input } from "@/components/xAccountForm";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>X画像リンク生成</h1>
        <Input />
      </main>
    </div>
  );
}
