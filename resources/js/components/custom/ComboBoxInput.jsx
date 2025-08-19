import React, { useState, useMemo, useCallback } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { Input } from "../ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";

export function ComboBoxInput({
    options = [],
    value,
    onChange,
    placeholder = "Search or select...",
    maxResults = 8,
    allowCustom = true,
    className,
}) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");

    const filteredOptions = useMemo(() => {
        if (!inputValue.trim()) return options.slice(0, maxResults);

        return options
            .filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, maxResults);
    }, [options, inputValue, maxResults]);

    const handleSelect = useCallback(
        (val) => {
            setInputValue(val);
            onChange?.(val);
            setOpen(false);
        },
        [onChange]
    );

    const handleInputChange = useCallback(
        (val) => {
            setInputValue(val);
            onChange?.(val);
        },
        [onChange]
    );

    const handleOpenChange = useCallback(
        (isOpen) => {
            setOpen(isOpen);
            if (!isOpen && inputValue !== value) {
                setInputValue(value || "");
            }
        },
        [inputValue, value]
    );

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (filteredOptions.length > 0 && filteredOptions[0]) {
                handleSelect(filteredOptions[0]);
            } else if (allowCustom && inputValue.trim()) {
                handleSelect(inputValue.trim());
            }
        }
    };

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <div className={cn("relative w-full", className)}>
                    <Input
                        value={inputValue}
                        placeholder={placeholder}
                        readOnly
                        className={cn(
                            "cursor-pointer pr-10 transition-all duration-200",
                            "hover:border-primary/50 focus:border-primary",
                            "bg-background/50 hover:bg-background",
                            open && "border-primary ring-1 ring-primary/20"
                        )}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDownIcon
                            className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                open && "rotate-180"
                            )}
                        />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "p-0 w-[var(--radix-popover-trigger-width)] min-w-[300px]",
                    "border-primary/20 shadow-lg"
                )}
                align="start"
            >
                <Command className="rounded-lg">
                    <div className="relative">
                        <CommandInput
                            placeholder="Type to search..."
                            value={inputValue}
                            onValueChange={handleInputChange}
                            className="pl-10 border-0 focus:ring-0"
                            onKeyDown={handleEnter}
                        />
                    </div>

                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                        {allowCustom ? (
                            <div className="space-y-2">
                                <p>No matches found</p>
                                <p className="text-xs">
                                    Press Enter to use "{inputValue}" as custom
                                    value
                                </p>
                            </div>
                        ) : (
                            "No results found"
                        )}
                    </CommandEmpty>

                    {filteredOptions.length > 0 && (
                        <CommandGroup className="max-h-[200px] overflow-auto">
                            {filteredOptions.map((option, index) => (
                                <CommandItem
                                    key={`${option}-${index}`}
                                    onSelect={() => handleSelect(option)}
                                    className={cn(
                                        "cursor-pointer transition-colors duration-150",
                                        "hover:bg-accent/80 data-[selected]:bg-accent",
                                        "flex items-center justify-between py-2 px-3 mt-1"
                                    )}
                                >
                                    <span className="flex-1 truncate">
                                        {option}
                                    </span>
                                    <CheckIcon
                                        className={cn(
                                            "h-4 w-4 transition-opacity duration-150",
                                            option === inputValue
                                                ? "opacity-100 text-primary"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
