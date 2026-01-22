import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      disabled
    >
      <Moon className="h-4 w-4" />
      <span className="sr-only">Dark Mode Only</span>
    </Button>
  );
}