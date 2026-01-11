import Link from "next/link";
import { PageLayout } from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <PageLayout title="Home">
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="text-center">
          <h2 className="text-6xl font-bold">My App</h2>
          <p className="mt-4 text-xl text-muted-foreground">Next.js 15 Full-Stack Application</p>
        </div>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
