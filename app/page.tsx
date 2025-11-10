import { redirect } from "next/navigation";

export default function Home() {
  // Server-side redirect to portal
  //TO CHANGE ONCE FANTASY READY
  redirect("/classic");
}
