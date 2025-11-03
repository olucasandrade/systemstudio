import { redirect } from "next/navigation";

const HomePage = () => {
  return redirect("/challenges");
};

export default HomePage;