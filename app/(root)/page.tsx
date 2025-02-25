import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  console.log("session:", session);

  return (
    <>
      <h1 className="h1-bold">Welcome to DevOverflow</h1>
    </>
  );
};

export default Home;
