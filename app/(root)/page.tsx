import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <div className="p-10">
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
}
