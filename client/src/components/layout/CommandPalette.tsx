import { useEffect, useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "../ui/command";
import { navItems, personalInfo } from "../../data/portfolio";
import { useToast } from "@/hooks/use-toast";

interface CommandPaletteProps {
    scrollToSection: (id: string) => void;
}

const ZOOM_LEVELS: Record<string, string> = {
    hero: "z0",
    about: "z4",
    skills: "z8",
    experience: "z10",
    projects: "z12",
    certifications: "z14",
    contact: "z18",
};

/**
 * ⌘K / Ctrl+K command palette with GIS-flavored "fly to" commands.
 */
export const CommandPalette = ({ scrollToSection }: CommandPaletteProps) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const run = (action: () => void) => {
        setOpen(false);
        action();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Fly to a section, open a layer…" />
            <CommandList>
                <CommandEmpty>No features found in this extent.</CommandEmpty>
                <CommandGroup heading="Fly to">
                    {navItems.map((item) => (
                        <CommandItem
                            key={item.id}
                            onSelect={() => run(() => scrollToSection(item.id))}
                        >
                            <i className="fas fa-location-arrow text-primary mr-1" aria-hidden />
                            <span>{item.label}</span>
                            <CommandShortcut className="font-mono">{ZOOM_LEVELS[item.id]}</CommandShortcut>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Layers & links">
                    <CommandItem onSelect={() => run(() => window.open(personalInfo.github, "_blank"))}>
                        <i className="fab fa-github mr-1" aria-hidden />
                        <span>Open GitHub</span>
                    </CommandItem>
                    <CommandItem onSelect={() => run(() => window.open(personalInfo.linkedin, "_blank"))}>
                        <i className="fab fa-linkedin mr-1" aria-hidden />
                        <span>Open LinkedIn</span>
                    </CommandItem>
                    <CommandItem onSelect={() => run(() => window.open(personalInfo.cv, "_blank"))}>
                        <i className="fas fa-file-pdf mr-1" aria-hidden />
                        <span>View CV</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() =>
                            run(() => {
                                navigator.clipboard.writeText(personalInfo.email).then(() =>
                                    toast({
                                        title: "📍 Contact coordinates copied",
                                        description: personalInfo.email,
                                    })
                                );
                            })
                        }
                    >
                        <i className="fas fa-envelope mr-1" aria-hidden />
                        <span>Copy email</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
