import PuzzleLoader from "@/components/PuzzleLoader";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper">
      <PuzzleLoader />
    </div>
  );
}
