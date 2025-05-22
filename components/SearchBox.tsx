import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchBox() {
  return (
    <form action="/search" className="flex w-full max-w-sm items-center relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        name="q"
        placeholder="本を検索..."
        className="w-full pl-10"
      />
      <Button type="submit" className="sr-only">
        検索
      </Button>
    </form>
  );
}
