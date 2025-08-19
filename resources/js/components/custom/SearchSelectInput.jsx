import React, { useState, useMemo, useCallback } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import { cn } from "@/components/lib/utils";
import { Input } from "@/components/ui/input";
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

/**
 * Modular SearchSelect component
 *
 * @param {Array} options - The list of options (can be strings or objects)
 * @param {any} value - The selected value (must match getOptionValue(option))
 * @param {Function} onChange - Called when a new value is selected
 * @param {Function} getOptionLabel - Returns the display label for an option
 * @param {Function} getOptionValue - Returns the unique value for an option
 * @param {string} placeholder - Placeholder text
 * @param {number} maxResults - Max number of results to show
 * @param {string} className - Extra CSS classes
 */
export function SearchSelect({
    options = [],
    value,
    onChange,
    getOptionLabel = (o) => (typeof o === "string" ? o : o.label ?? ""),
    getOptionValue = (o) => (typeof o === "string" ? o : o.value ?? ""),
    placeholder = "Search and select...",
    maxResults = 10,
    className,
}) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const displayValue = useMemo(() => {
        if (!value) return "";
        const found = options.find(
            (option) => String(getOptionValue(option)) === String(value)
        );
        return found ? getOptionLabel(found) : "";
    }, [value, options, getOptionLabel, getOptionValue]);

    const filteredOptions = useMemo(() => {
        if (!searchValue.trim()) return options.slice(0, maxResults);

        return options
            .filter((option) =>
                getOptionLabel(option)
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            )
            .slice(0, maxResults);
    }, [options, searchValue, maxResults, getOptionLabel]);

    const handleSelect = useCallback(
        (selectedOption) => {
            onChange(getOptionValue(selectedOption));
            setOpen(false);
            setSearchValue("");
        },
        [onChange, getOptionValue]
    );

    const handleOpenChange = useCallback((newOpen) => {
        setOpen(newOpen);
        if (!newOpen) setSearchValue("");
    }, []);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn("relative w-full cursor-pointer", className)}
                >
                    <Input
                        value={displayValue}
                        placeholder={placeholder}
                        readOnly
                        className="pr-10 cursor-pointer hover:bg-accent/50 transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDownIcon
                            className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                open && "rotate-180"
                            )}
                        />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                <Command shouldFilter={false}>
                    <div className="flex items-center border-b px-3">
                        <CommandInput
                            placeholder="Search..."
                            value={searchValue}
                            onValueChange={setSearchValue}
                            className="border-0 focus:ring-0"
                        />
                    </div>
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                        <div className="space-y-2">
                            <p>No options found</p>
                            <p className="text-xs">
                                Please search another keyword
                            </p>
                        </div>
                    </CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-auto">
                        {filteredOptions.map((option) => (
                            <CommandItem
                                key={getOptionValue(option)}
                                onSelect={() => handleSelect(option)}
                                className="cursor-pointer hover:bg-accent transition-colors"
                            >
                                <span className="flex-1">
                                    {getOptionLabel(option)}
                                </span>
                                <CheckIcon
                                    className={cn(
                                        "ml-2 h-4 w-4 transition-opacity",
                                        String(getOptionValue(option)) ===
                                            String(value)
                                            ? "opacity-100 text-primary"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
