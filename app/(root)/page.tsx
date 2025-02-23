import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log("session:", session);

  return (
    <>
      <h1 className="h1-bold">Welcome to DevOverflow</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES?.SIGN_IN });
        }}
        className="px-10 pt-[100px]"
      >
        <Button type="submit" className="bg-white text-black">
          Log Out
        </Button>
      </form>
    </>
  );
};

export default Home;
