export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
      <div className="max-w-md w-full mx-auto flex flex-col gap-6 items-center p-4 my-auto">
        {children}
      </div>
    </div>
  );
}
