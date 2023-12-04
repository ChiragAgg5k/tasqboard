export default function Board({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className={`flex min-h-[90dvh] items-center justify-center`}>
      <h1>Board {id}</h1>
    </div>
  );
}
