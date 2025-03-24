import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

const Home = async () => {
  await db.set("HELLO", "MOHIT");
  return (
    <div className="text-red-900">
      <Button variant="default" size="default">
        Hello
      </Button>
    </div>
  );
};

export default Home;
